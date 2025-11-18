import User from "@/models/User";
import connectdb from "@/lib/dbConnect";

export async function POST(req) {
    try {
        await connectdb();
        const body = await req.json();

        const { fullname, email, mobileNumber, pincode, companyName } = body;

        console.log("BODY RECEIVED:", body);

        // ⭐ REQUIRED FIELDS CHECK
        if (!fullname || !mobileNumber) {
            return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
        }

        const finalMobile = mobileNumber.trim();

        // ⭐ CHECK IF MOBILE EXISTS
        const existingMobile = await User.findOne({ mobileNumber: finalMobile });
        if (existingMobile) {
            return new Response(JSON.stringify({ error: "Mobile number already registered" }), { status: 400 });
        }

        // ⭐ CHECK EMAIL DUPLICATE ONLY IF EMAIL PROVIDED
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return new Response(JSON.stringify({ error: "Email already registered" }), { status: 400 });
            }
        }

        // ⭐ CREATE OR UPDATE USER FOR OTP TESTING
        let user = new User({
            fullname,
            email,
            mobileNumber: finalMobile,
            pincode,
            companyName,
        });

        // ⭐ FIXED OTP
        user.otp = "12345";
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "OTP sent successfully",
                otp: "12345",
                mobileNumber: finalMobile,
            }),
            { status: 200 }
        );

    } catch (err) {
        console.log("Error in sendsotp:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
