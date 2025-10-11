"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import Image from "next/image";

import { useDispatch,  useSelector } from "react-redux";

import { setUser } from "@/app/store/userSlice";

// Country Code List
const countryCodes = [
    { value: "+91", label: "🇮🇳 +91", name: "India" },
    { value: "+93", label: "🇦🇫 +93", name: "Afghanistan" },
    { value: "+355", label: "🇦🇱 +355", name: "Albania" },
    { value: "+213", label: "🇩🇿 +213", name: "Algeria" },
    { value: "+1684", label: "🇦🇸 +1684", name: "American Samoa" },
    { value: "+376", label: "🇦🇩 +376", name: "Andorra" },
    { value: "+244", label: "🇦🇴 +244", name: "Angola" },
    { value: "+1264", label: "🇬🇸 +1264", name: "Anguilla" },
    { value: "+672", label: "🇦🇶 +672", name: "Antarctica" },
    { value: "+1268", label: "🇦🇬 +1268", name: "Antigua and Barbuda" },
    { value: "+54", label: "🇦🇷 +54", name: "Argentina" },
    { value: "+374", label: "🇦🇲 +374", name: "Armenia" },
    { value: "+297", label: "🇦🇼 +297", name: "Aruba" },
    { value: "+61", label: "🇦🇺 +61", name: "Australia" },
    { value: "+43", label: "🇦🇹 +43", name: "Austria" },
    { value: "+994", label: "🇦🇿 +994", name: "Azerbaijan" },
    { value: "+1242", label: "🇧🇸 +1242", name: "Bahamas" },
    { value: "+973", label: "🇧🇭 +973", name: "Bahrain" },
    { value: "+880", label: "🇧🇩 +880", name: "Bangladesh" },
    { value: "+1246", label: "🇧🇧 +1246", name: "Barbados" },
    { value: "+375", label: "🇧🇾 +375", name: "Belarus" },
    { value: "+32", label: "🇧🇪 +32", name: "Belgium" },
    { value: "+501", label: "🇧🇿 +501", name: "Belize" },
    { value: "+229", label: "🇧🇯 +229", name: "Benin" },
    { value: "+1441", label: "🇧🇲 +1441", name: "Bermuda" },
    { value: "+975", label: "🇧🇹 +975", name: "Bhutan" },
    { value: "+591", label: "🇧🇴 +591", name: "Bolivia" },
    { value: "+387", label: "🇧🇦 +387", name: "Bosnia and Herzegovina" },
    { value: "+267", label: "🇧🇼 +267", name: "Botswana" },
    { value: "+55", label: "🇧🇷 +55", name: "Brazil" },
    { value: "+246", label: "🇮🇴 +246", name: "British Indian Ocean Territory" },
    { value: "+673", label: "🇧🇳 +673", name: "Brunei" },
    { value: "+359", label: "🇧🇬 +359", name: "Bulgaria" },
    { value: "+226", label: "🇧🇫 +226", name: "Burkina Faso" },
    { value: "+257", label: "🇧🇮 +257", name: "Burundi" },
    { value: "+855", label: "🇰🇭 +855", name: "Cambodia" },
    { value: "+237", label: "🇨🇲 +237", name: "Cameroon" },
    { value: "+1", label: "🇨🇦 +1", name: "Canada" },
    { value: "+238", label: "🇨🇻 +238", name: "Cape Verde" },
    { value: "+1345", label: "🇰🇾 +1345", name: "Cayman Islands" },
    { value: "+236", label: "🇨🇫 +236", name: "Central African Republic" },
    { value: "+56", label: "🇨🇱 +56", name: "Chile" },
    { value: "+86", label: "🇨🇳 +86", name: "China" },
    { value: "+61", label: "🇨🇨 +61", name: "Christmas Island" },
    { value: "+61", label: "🇨🇨 +61", name: "Cocos (Keeling) Islands" },
    { value: "+57", label: "🇨🇴 +57", name: "Colombia" },
    { value: "+269", label: "🇰🇲 +269", name: "Comoros" },
    { value: "+242", label: "🇨🇬 +242", name: "Congo" },
    { value: "+243", label: "🇨🇩 +243", name: "Congo (Democratic Republic)" },
    { value: "+682", label: "🇨🇰 +682", name: "Cook Islands" },
    { value: "+506", label: "🇨🇷 +506", name: "Costa Rica" },
    { value: "+225", label: "🇨🇮 +225", name: "Ivory Coast" },
    { value: "+385", label: "🇭🇷 +385", name: "Croatia" },
    { value: "+53", label: "🇨🇺 +53", name: "Cuba" },
    { value: "+357", label: "🇨🇾 +357", name: "Cyprus" },
    { value: "+420", label: "🇨🇿 +420", name: "Czech Republic" },
    { value: "+45", label: "🇩🇰 +45", name: "Denmark" },
    { value: "+253", label: "🇩🇯 +253", name: "Djibouti" },
    { value: "+1", label: "🇲🇾 +1", name: "Dominica" },
    { value: "+1", label: "🇩🇴 +1", name: "Dominican Republic" },
    { value: "+670", label: "🇩🇲 +670", name: "East Timor" },
    { value: "+593", label: "🇪🇨 +593", name: "Ecuador" },
    { value: "+20", label: "🇪🇬 +20", name: "Egypt" },
    { value: "+503", label: "🇸🇻 +503", name: "El Salvador" },
    { value: "+240", label: "🇬🇶 +240", name: "Equatorial Guinea" },
    { value: "+291", label: "🇪🇷 +291", name: "Eritrea" },
    { value: "+372", label: "🇪🇪 +372", name: "Estonia" },
    { value: "+251", label: "🇪🇹 +251", name: "Ethiopia" },
    { value: "+500", label: "🇬🇮 +500", name: "Falkland Islands" },
    { value: "+298", label: "🇩🇴 +298", name: "Faroe Islands" },
    { value: "+679", label: "🇫🇯 +679", name: "Fiji" },
    { value: "+358", label: "🇫🇮 +358", name: "Finland" },
    { value: "+33", label: "🇫🇷 +33", name: "France" },
    { value: "+594", label: "🇬🇳 +594", name: "French Guiana" },
    { value: "+689", label: "🇵🇬 +689", name: "French Polynesia" },
    { value: "+241", label: "🇶🇸 +241", name: "Gabon" },
    { value: "+220", label: "🇬🇭 +220", name: "Gambia" },
    { value: "+995", label: "🇬🇪 +995", name: "Georgia" },
    { value: "+49", label: "🇩🇪 +49", name: "Germany" },
    { value: "+233", label: "🇬🇭 +233", name: "Ghana" },
    { value: "+350", label: "🇬🇮 +350", name: "Gibraltar" },
    { value: "+30", label: "🇬🇷 +30", name: "Greece" },
    { value: "+299", label: "🇬🇸 +299", name: "Greenland" },
    { value: "+1473", label: "🇬🇩 +1473", name: "Grenada" },
    { value: "+1", label: "🇬🇩 +1", name: "Guadeloupe" },
    { value: "+1671", label: "🇬🇺 +1671", name: "Guam" },
    { value: "+502", label: "🇬🇹 +502", name: "Guatemala" },
    { value: "+224", label: "🇬🇳 +224", name: "Guinea" },
    { value: "+245", label: "🇬🇼 +245", name: "Guinea-Bissau" },
    { value: "+592", label: "🇬🇾 +592", name: "Guyana" },
    { value: "+509", label: "🇭🇹 +509", name: "Haiti" },
    { value: "+504", label: "🇭🇳 +504", name: "Honduras" },
    { value: "+852", label: "🇭🇰 +852", name: "Hong Kong" },
    { value: "+36", label: "🇭🇺 +36", name: "Hungary" },
    { value: "+354", label: "🇮🇸 +354", name: "Iceland" },
    { value: "+62", label: "🇮🇩 +62", name: "Indonesia" },
    { value: "+98", label: "🇮🇷 +98", name: "Iran" },
    { value: "+964", label: "🇮🇶 +964", name: "Iraq" },
    { value: "+353", label: "🇮🇪 +353", name: "Ireland" },
    { value: "+972", label: "🇮🇱 +972", name: "Israel" },
    { value: "+39", label: "🇮🇹 +39", name: "Italy" },
    { value: "+1876", label: "🇯🇲 +1876", name: "Jamaica" },
    { value: "+81", label: "🇯🇵 +81", name: "Japan" },
    { value: "+962", label: "🇯🇴 +962", name: "Jordan" },
    { value: "+254", label: "🇰🇪 +254", name: "Kenya" },
    { value: "+996", label: "🇰🇬 +996", name: "Kyrgyzstan" },
    { value: "+856", label: "🇱🇸 +856", name: "Laos" },
    { value: "+371", label: "🇱🇻 +371", name: "Latvia" },
    { value: "+961", label: "🇱🇧 +961", name: "Lebanon" },
    { value: "+266", label: "🇱🇸 +266", name: "Lesotho" },
    { value: "+231", label: "🇱🇷 +231", name: "Liberia" },
    { value: "+218", label: "🇱🇾 +218", name: "Libya" },
    { value: "+423", label: "🇱🇮 +423", name: "Liechtenstein" },
    { value: "+370", label: "🇱🇹 +370", name: "Lithuania" },
    { value: "+352", label: "🇱🇺 +352", name: "Luxembourg" },
    { value: "+853", label: "🇲🇴 +853", name: "Macau" },
    { value: "+389", label: "🇲🇰 +389", name: "Macedonia" },
    { value: "+261", label: "🇲🇬 +261", name: "Madagascar" },
    { value: "+265", label: "🇲🇼 +265", name: "Malawi" },
    { value: "+60", label: "🇲🇾 +60", name: "Malaysia" },
    { value: "+960", label: "🇲🇻 +960", name: "Maldives" },
    { value: "+223", label: "🇲🇱 +223", name: "Mali" },
    { value: "+356", label: "🇲🇹 +356", name: "Malta" },
    { value: "+692", label: "🇲🇭 +692", name: "Marshall Islands" },
    { value: "+596", label: "🇲🇬 +596", name: "Martinique" },
    { value: "+222", label: "🇲🇷 +222", name: "Mauritania" },
    { value: "+230", label: "🇲🇺 +230", name: "Mauritius" },
    { value: "+262", label: "🇲🇶 +262", name: "Mayotte" },
    { value: "+52", label: "🇲🇽 +52", name: "Mexico" },
    { value: "+691", label: "🇲🇽 +691", name: "Micronesia" },
    { value: "+373", label: "🇲🇩 +373", name: "Moldova" },
    { value: "+377", label: "🇲🇨 +377", name: "Monaco" },
    { value: "+976", label: "🇲🇳 +976", name: "Mongolia" },
    { value: "+382", label: "🇲🇪 +382", name: "Montenegro" },
    { value: "+1", label: "🇲🇸 +1", name: "Montserrat" },
    { value: "+212", label: "🇲🇦 +212", name: "Morocco" },
    { value: "+258", label: "🇲🇿 +258", name: "Mozambique" },
    { value: "+95", label: "🇲🇲 +95", name: "Myanmar" },
    { value: "+264", label: "🇳🇦 +264", name: "Namibia" },
    { value: "+674", label: "🇳🇷 +674", name: "Nauru" },
    { value: "+977", label: "🇳🇵 +977", name: "Nepal" },
    { value: "+31", label: "🇳🇱 +31", name: "Netherlands" },
    { value: "+64", label: "🇳🇿 +64", name: "New Zealand" },
    { value: "+505", label: "🇳🇮 +505", name: "Nicaragua" },
    { value: "+227", label: "🇳🇪 +227", name: "Niger" },
    { value: "+234", label: "🇳🇬 +234", name: "Nigeria" },
    { value: "+683", label: "🇳🇺 +683", name: "Niue" },
    { value: "+672", label: "🇳🇮 +672", name: "Norfolk Island" },
    { value: "+1", label: "🇳🇷 +1", name: "Northern Mariana Islands" },
    { value: "+47", label: "🇳🇴 +47", name: "Norway" },
    { value: "+968", label: "🇴🇲 +968", name: "Oman" },
    { value: "+92", label: "🇵🇰 +92", name: "Pakistan" },
    { value: "+680", label: "🇵🇼 +680", name: "Palau" },
    { value: "+970", label: "🇵🇸 +970", name: "Palestine" },
    { value: "+507", label: "🇵🇦 +507", name: "Panama" },
    { value: "+675", label: "🇵🇬 +675", name: "Papua New Guinea" },
    { value: "+595", label: "🇵🇾 +595", name: "Paraguay" },
    { value: "+51", label: "🇵🇪 +51", name: "Peru" },
    { value: "+63", label: "🇵🇭 +63", name: "Philippines" },
    { value: "+48", label: "🇵🇱 +48", name: "Poland" },
    { value: "+351", label: "🇵🇹 +351", name: "Portugal" },
    { value: "+1", label: "🇵🇷 +1", name: "Puerto Rico" },
    { value: "+974", label: "🇶🇦 +974", name: "Qatar" },
    { value: "+40", label: "🇷🇴 +40", name: "Romania" },
    { value: "+7", label: "🇷🇺 +7", name: "Russia" },
    { value: "+250", label: "🇷🇼 +250", name: "Rwanda" },
    { value: "+290", label: "🇾🇹 +290", name: "Saint Helena" },
    { value: "+1869", label: "🇰🇳 +1869", name: "Saint Kitts and Nevis" },
    { value: "+1758", label: "🇱🇨 +1758", name: "Saint Lucia" },
    { value: "+1", label: "🇱🇮 +1", name: "Saint Pierre and Miquelon" },
    { value: "+1", label: "🇻🇨 +1", name: "Saint Vincent and the Grenadines" },
    { value: "+684", label: "🇼🇸 +684", name: "Samoa" },
    { value: "+378", label: "🇸🇲 +378", name: "San Marino" },
    { value: "+239", label: "🇸🇹 +239", name: "Sao Tome and Principe" },
    { value: "+966", label: "🇸🇦 +966", name: "Saudi Arabia" },
    { value: "+221", label: "🇸🇳 +221", name: "Senegal" },
    { value: "+381", label: "🇷🇸 +381", name: "Serbia" },
    { value: "+248", label: "🇸🇨 +248", name: "Seychelles" },
    { value: "+232", label: "🇸🇱 +232", name: "Sierra Leone" },
    { value: "+65", label: "🇸🇬 +65", name: "Singapore" },
    { value: "+421", label: "🇸🇰 +421", name: "Slovakia" },
    { value: "+386", label: "🇸🇮 +386", name: "Slovenia" },
    { value: "+677", label: "🇸🇧 +677", name: "Solomon Islands" },
    { value: "+252", label: "🇸🇴 +252", name: "Somalia" },
    { value: "+27", label: "🇿🇦 +27", name: "South Africa" },
    { value: "+82", label: "🇰🇷 +82", name: "South Korea" },
    { value: "+34", label: "🇪🇸 +34", name: "Spain" },
    { value: "+94", label: "🇱🇰 +94", name: "Sri Lanka" },
    { value: "+249", label: "🇸🇩 +249", name: "Sudan" },
    { value: "+597", label: "🇸🇷 +597", name: "Suriname" },
    { value: "+268", label: "🇸🇿 +268", name: "Swaziland" },
    { value: "+46", label: "🇸🇪 +46", name: "Sweden" },
    { value: "+41", label: "🇨🇭 +41", name: "Switzerland" },
    { value: "+963", label: "🇸🇾 +963", name: "Syria" },
    { value: "+886", label: "🇹🇼 +886", name: "Taiwan" },
    { value: "+992", label: "🇹🇯 +992", name: "Tajikistan" },
    { value: "+255", label: "🇹🇿 +255", name: "Tanzania" },
    { value: "+66", label: "🇹🇭 +66", name: "Thailand" },
    { value: "+670", label: "🇹🇱 +670", name: "Timor-Leste" },
    { value: "+228", label: "🇹🇬 +228", name: "Togo" },
    { value: "+690", label: "🇹🇴 +690", name: "Tonga" },
    { value: "+1", label: "🇹🇹 +1", name: "Trinidad and Tobago" },
    { value: "+216", label: "🇹🇳 +216", name: "Tunisia" },
    { value: "+90", label: "🇹🇷 +90", name: "Turkey" },
    { value: "+993", label: "🇹🇲 +993", name: "Turkmenistan" },
    { value: "+1", label: "🇹🇻 +1", name: "Tuvalu" },
    { value: "+256", label: "🇺🇬 +256", name: "Uganda" },
    { value: "+380", label: "🇺🇦 +380", name: "Ukraine" },
    { value: "+971", label: "🇦🇪 +971", name: "United Arab Emirates" },
    { value: "+44", label: "🇬🇧 +44", name: "United Kingdom" },
    { value: "+1", label: "🇺🇸 +1", name: "United States" },
    { value: "+598", label: "🇺🇾 +598", name: "Uruguay" },
    { value: "+998", label: "🇺🇿 +998", name: "Uzbekistan" },
    { value: "+678", label: "🇻🇺 +678", name: "Vanuatu" },
    { value: "+58", label: "🇻🇪 +58", name: "Venezuela" },
    { value: "+84", label: "🇻🇳 +84", name: "Vietnam" },
    { value: "+1", label: "🇻🇬 +1", name: "Virgin Islands" },
    { value: "+684", label: "🇻🇺 +684", name: "Wallis and Futuna" },
    { value: "+967", label: "🇾🇪 +967", name: "Yemen" },
    { value: "+260", label: "🇿🇲 +260", name: "Zambia" },
    { value: "+263", label: "🇿🇼 +263", name: "Zimbabwe" }
  ];
  
export default function Login() {
    const [countryCode, setCountryCode] = useState(countryCodes[0]); // Default to India
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showOtpField, setShowOtpField] = useState(false);
// const token = useSelector((state) => state.user.token);
const { user, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

useEffect(() => {
  if (token && user) {
    if (user.termsAccepted) {
      router.push("/userdashboard");   // ✅ Terms accepted → dashboard
    } else {
      router.push("/accept-terms");    // ❌ Not accepted → terms page
    }
  }
}, [token, user, router]);


    // Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const fullMobileNumber = `${countryCode.value}${mobileNumber}`; // Combine country code and mobile number

            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobileNumber: fullMobileNumber }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setShowOtpField(true);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");
        try {
            const fullMobileNumber = `${countryCode.value}${mobileNumber}`;

            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobileNumber: fullMobileNumber, otp }),
            });

            const data = await res.json();

         if (res.ok) {
  setMessage("Login successful!");
  // Redux store update
  dispatch(setUser({ user: data.user, token: data.token }));

  if (data.user.termsAccepted) {
    router.push("/userdashboard");
  } else {
    router.push("/accept-terms"); // ✅ Terms page par bhejna
  }
} else {
  setError(data.error);
}
        } catch (err) {
            setError("Invalid OTP or something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center m-5">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login with Mobile </h2>

           <Image
  src={"/assets/2-copy-0.png" || "/placeholder.png"}
  alt="login user"
  width={180}
  height={180}
  className="rounded-md object-cover mx-auto block"
  priority={false}
/>


                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!showOtpField ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Mobile Number:</label>
                            <div className="flex items-center">
                                <div className="w-48 h-full">
                                    <Select
                                        options={countryCodes}
                                        value={countryCode}
                                        onChange={setCountryCode}
                                        className="w-full"
                                        getOptionLabel={(e) => `${e.label}`} // Show only Flag + Code
                                        filterOption={(option, input) =>
                                            option.data.name.toLowerCase().includes(input.toLowerCase()) ||
                                            option.data.value.includes(input)
                                        }
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: "42px",
                                                minWidth: "100px",
                                                whiteSpace: "nowrap",
                                                borderRadius: "6px 0 0 6px",
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                whiteSpace: "nowrap",
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                        }}
                                    />
                                </div>
                            <input
    type="text"
    value={mobileNumber}
    onChange={(e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
            setMobileNumber(value);
        }
    }}
    required
    className="w-full p-2 border rounded-r h-[42px]"
    placeholder="Enter your mobile number"
/>

                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Enter OTP:</label>
                            <input
                                type="number"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength={4}
                                className="w-full p-2 border rounded"
                                placeholder="Enter OTP"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? "Verifying OTP..." : "Verify OTP"}
                        </button>                        
                    </form>
                )}
                <div className="mt-4">
                    <Link href="/user/register">Don't have an account? Register here</Link>
                </div>
            </div>
        </div>
    );
}
