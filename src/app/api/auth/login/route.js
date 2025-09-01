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

        // ✅ Static test number
        const testNumber = "9643685727";
        const testOtp = "12345";

        // ========== OTP Send ==========
        if (!otp) {
            // Agar test number h to OTP send ki zaroorat hi nahi
            if (mobileNumber === testNumber) {
                return new Response(
                    JSON.stringify({ message: `Use OTP ${testOtp} to login`, mobileNumber }),
                    { status: 200, headers: { "Content-Type": "application/json" } }
                );
            }

            const user = await User.findOne({ mobileNumber });
            if (!user) {
                return new Response(JSON.stringify({ error: "User not found, please register first" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const generatedOtp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
            const otpExpires = new Date(Date.now() + 5 * 60000);

            user.otp = generatedOtp;
            user.otpExpires = otpExpires;
            await user.save();

            try {
                const apiKey = "afd6c091-063e-11f0-8b17-0200cd936042"; 
                const otpTemplateName = "OTPtemplate";

                const response = await fetch(
                    `https://2factor.in/API/V1/${apiKey}/SMS/91${mobileNumber}/${generatedOtp}/${otpTemplateName}`,
                    { method: "GET" }
                );
                const result = await response.json();

                if (response.ok && result.Status === "Success") {
                    return new Response(JSON.stringify({ message: "OTP sent successfully", mobileNumber }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                } else {
                    console.error("2Factor Error:", result);
                    return new Response(JSON.stringify({ error: "Failed to send OTP. Please try again." }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            } catch (apiError) {
                console.error("2Factor API Error:", apiError);
                return new Response(JSON.stringify({ error: "Failed to send OTP. Please try again." }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        // ========== OTP Verify ==========
      // ========== OTP Verify ==========
else {
    // ✅ Agar test number h to static OTP allow karo
    if (mobileNumber === testNumber && otp === testOtp) {
        let user = await User.findOne({ mobileNumber });
        if (!user) {
            // agar user DB me nahi h to ek dummy create kar lo
            user = new User({ mobileNumber, isVerified: true });
            await user.save();
        }

        const token = generateToken(user);
        return new Response(JSON.stringify({ message: "Login successful", token, user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    // ⚡ baki sab ke liye normal OTP verify
    const user = await User.findOne({
        mobileNumber,
        otp,
        otpExpires: { $gt: new Date() },
    });

    if (!user) {
        return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user);
    return new Response(JSON.stringify({ message: "Login successful", token, user }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

}
