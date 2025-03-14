import twilio from "twilio";
import Buyer from "@/models/Buyer";
import connectdb from "@/lib/dbConnect";

export async function POST(req) {
    try {
        await connectdb();
        const body = await req.json();
        console.log("✅ Received Request Body:", body);

        const { fullname, email, mobileNumber, countryCode, companyName, productname } = body;

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

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = new Date(Date.now() + 5 * 60000);

        existingBuyer.otp = otp;
        existingBuyer.otpExpires = otpExpires;

        console.log("✅ Saving Buyer:", existingBuyer);
        await existingBuyer.save();

        // Send OTP via Twilio
        try {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                body: `Your OTP is: ${otp}`,
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
    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
