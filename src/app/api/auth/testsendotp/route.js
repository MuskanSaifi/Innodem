import User from "@/models/User";
import BusinessProfile from "@/models/BusinessProfile";
import connectdb from "@/lib/dbConnect";
import Bankdetails from "@/models/BankDetails";

export async function POST(req) {
    try {
        await connectdb(); 
        const body = await req.json();

        const { fullname, email, mobileNumber, pincode, companyName } = body;

        if (!fullname || !mobileNumber) {
            return new Response(JSON.stringify({ error: "All fields are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Mobile format
        const formattedMobile = mobileNumber.startsWith("+") 
            ? mobileNumber.slice(1) 
            : `91${mobileNumber}`;

        // Check if mobile number already exists
        let existingUser = await User.findOne({ mobileNumber });

        if (existingUser) {
            return new Response(JSON.stringify({ error: "This number already exists. Please sign in." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check if email exists
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ 
                fullname, 
                email, 
                mobileNumber, 
                pincode, 
                companyName,
                createdBy: "data-entry"  // ✅ NEW FIELD ADDED HERE
            });
        } else {
            user.fullname = fullname;
            user.pincode = pincode;
            user.companyName = companyName;
            user.createdBy = "data-entry"; // ✅ FOR EXISTING EMAIL ALSO
        }

        // 👉 FIXED OTP
        const otp = "12345";  
        const otpExpires = new Date(Date.now() + 10 * 60000);

        user.otp = otp;
        user.otpExpires = otpExpires;

        // Save user
        await user.save();

        // Create Business Profile
        let businessProfile = await BusinessProfile.findOne({ userId: user._id });

        if (!businessProfile) {
            businessProfile = new BusinessProfile({
                userId: user._id,
                companyName,
                officeContact: mobileNumber,
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

        // Create Bank Details (if not existing)
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

        return new Response(
            JSON.stringify({ message: "OTP generated", mobileNumber }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
