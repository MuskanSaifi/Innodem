import twilio from "twilio";
import User from "@/models/User";
import connectdb from "@/lib/dbConnect";
import { generateToken } from "@/lib/jwt";

export async function POST(req) {
    try {
        await connectdb();
        const body = await req.json();
        const { mobileNumber, otp } = body;

        if (!mobileNumber) {
            return new Response(JSON.stringify({ error: "Mobile number is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const formattedMobile = mobileNumber.startsWith("+") ? mobileNumber : `+91${mobileNumber}`;

        if (!otp) {
            const user = await User.findOne({ mobileNumber });

            if (!user) {
                return new Response(JSON.stringify({ error: "User not found, please register first" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const generatedOtp = Math.floor(100000 + Math.random() * 900000);
            const otpExpires = new Date(Date.now() + 5 * 60000);

            user.otp = generatedOtp;
            user.otpExpires = otpExpires;
            await user.save();

            try {
                const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
                await client.messages.create({
                    body: `Your OTP for login is: ${generatedOtp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: formattedMobile,
                });

                return new Response(JSON.stringify({ message: "OTP sent successfully", mobileNumber }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } catch (twilioError) {
                console.error("Twilio Error:", twilioError);
                return new Response(JSON.stringify({ error: "Failed to send OTP. Please try again." }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        } else {
            const user = await User.findOne({ mobileNumber, otp, otpExpires: { $gt: new Date() } });

            if (!user) {
                return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            user.isVerified = true;
            user.otp = null; // Clear OTP after verification
            user.otpExpires = null;
            await user.save();

            const token = generateToken(user);

            return new Response(JSON.stringify({ message: "Login successful", token, user }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.error("Error in login API:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
