import twilio from "twilio";
import User from "@/models/User";
import BusinessProfile from "@/models/BusinessProfile";
import connectdb from "@/lib/dbConnect";
import Bankdetails from "@/models/BankDetails";
import Product from "@/models/Product";

export async function POST(req) {
    try {
        await connectdb(); // Connect to the database first
        const body = await req.json();
        console.log("Request Body:", body);

        const { productname, fullname, email, mobileNumber, pincode, companyName } = body;

        if (!fullname || !mobileNumber || !pincode) {
            return new Response(JSON.stringify({ error: "All fields are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Ensure mobile number is in E.164 format
        const formattedMobile = mobileNumber.startsWith("+") ? mobileNumber : `+91${mobileNumber}`;

        // Check if mobile number already exists
        let existingUser = await User.findOne({ mobileNumber });

        if (existingUser) {
            return new Response(JSON.stringify({ error: "This number already exists. Please sign in." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ fullname, email, mobileNumber, pincode, companyName });
        } else {
            user.fullname = fullname;
            user.pincode = pincode;
            user.companyName = companyName;
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = new Date(Date.now() + 5 * 60000);

        user.otp = otp;
        user.otpExpires = otpExpires;

        await user.save();

        // Check if BusinessProfile exists, if not, create one
        let businessProfile = await BusinessProfile.findOne({ userId: user._id });

        if (!businessProfile) {
            businessProfile = new BusinessProfile({
                userId: user._id,
                companyName,
                officeContact: mobileNumber, // Using mobileNumber as default office contact
                ownershipType: "",
                annualTurnover: "",
                yearOfEstablishment: new Date().getFullYear(),
                numberOfEmployees: 0,
                address: "",
                pincode,
                city: "",
                state: "",
                country: "India",
                gstNumber: "",
                aadharNumber: "",
                panNumber: "",
                iecNumber: "",
                tanNumber: "",
                vatNumber: "",
                companyLogo: "",
                companyPhotos: [],
                companyVideo: "",
                companyDescription: "",
                workingDays: [],
                workingTime: { from: "", to: "" },
                preferredBusinessStates: [],
                preferredBusinessCities: [],
                nonBusinessCities: [],
            });

            await businessProfile.save();
        }

        // Check if Bank Details exist, if not, create one
        let existingBankDetails = await Bankdetails.findOne({ userId: user._id });

        if (!existingBankDetails) {
            const newBankDetails = new Bankdetails({
                userId: user._id,
                accountType: "",
                accountHolderName: "",
                accountNumber: "",
                confirmAccountNumber: "",
                ifscCode: "",
                mobileLinked: "",
            });

            await newBankDetails.save();
        }

        if (productname) {
            // Save Product Name In Product, if not create one
            const addproduct = new Product({
                userId: user._id,
                name: productname,
                category: "679a65c59a30cb344bae901e", // ✅ Add default category
            });
            await addproduct.save();
        }


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
            console.error("Twilio Error:", twilioError);
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
