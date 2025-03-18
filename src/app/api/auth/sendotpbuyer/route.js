import twilio from "twilio";
import Buyer from "@/models/Buyer";
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User"; // Import User model

export async function POST(req) {
    try {
        await connectdb();
        const body = await req.json();
        console.log("✅ Received Request Body:", body);

        const { fullname, email, mobileNumber, countryCode, companyName, productname, otp } = body;

        if (!mobileNumber || !productname || !countryCode) {
            return new Response(JSON.stringify({ error: "All fields (including country code) are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const formattedMobile = mobileNumber.startsWith("+") ? mobileNumber : `${countryCode}${mobileNumber}`;
        let existingBuyer = await Buyer.findOne({ mobileNumber });

        if (!existingBuyer) {
            existingBuyer = new Buyer({ fullname, email, mobileNumber, countryCode, companyName, productname });
        }

        // ✅ Step 1: Send OTP if not provided
        if (!otp) {
            const generatedOtp = Math.floor(100000 + Math.random() * 900000);
            existingBuyer.otp = generatedOtp;
            existingBuyer.otpExpires = new Date(Date.now() + 5 * 60000);
            await existingBuyer.save();

            try {
                const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
                await client.messages.create({
                    body: `Your OTP is: ${generatedOtp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: formattedMobile,
                });

                return new Response(JSON.stringify({ message: "OTP sent successfully", mobileNumber }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            } catch (twilioError) {
                console.error("❌ Twilio Error:", twilioError);
                return new Response(JSON.stringify({ error: "Failed to send OTP via Twilio" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }
        } 

        // ✅ Step 2: If OTP is provided, verify OTP and send product details
        else {
            if (existingBuyer.otp !== otp || new Date() > existingBuyer.otpExpires) {
                return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            // ✅ OTP Verified - Find Matching Products & Seller Details
            const matchingProducts = await Product.find({ name: productname }).populate("userId", "fullname");

            if (!matchingProducts.length) {
                return new Response(JSON.stringify({ message: "No matching products found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }

            // ✅ Format product details with seller info
            const productDetails = matchingProducts
                .map(p => `🛍️ *${p.name}*\n💰 Price: ₹${p.price}\n👤 Seller: ${p.userId ? p.userId.fullname : "Unknown"}\n🔗 View: ${p.url || 'No Link'}`)
                .join("\n\n");

            // ✅ Send Product Details via WhatsApp
            try {
                const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
                await client.messages.create({
                    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                    to: `whatsapp:${formattedMobile}`,
                    body: `Hi ${fullname},\n\nHere are the matching products for "${productname}":\n\n${productDetails}`,
                });

                return new Response(JSON.stringify({ message: "OTP verified. Product details sent on WhatsApp!" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            } catch (twilioError) {
                console.error("❌ Twilio Error:", twilioError);
                return new Response(JSON.stringify({ error: "Failed to send product details on WhatsApp" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

    } catch (error) {
        console.error("❌ Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
