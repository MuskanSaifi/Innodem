"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaInstagram, FaArrowUp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


import Image from "next/image";
import Gpimage from "../../public/assets/gp.png";
import GoogleTranslate from "./GoogleTranslate";
import axios from "axios";
import Swal from "sweetalert2";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [subscribe, setSubscribe] = useState("")

  const handlesubscribe = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      if (!subscribe) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please enter your email!",
        });
        return;
      }

      const response = await axios.post("/api/subscribers", { email: subscribe });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Subscribed Successfully!",
          text: "You have been added to our mailing list.",
        });
        setSubscribe(""); // Clear input field
      }
    } catch (error) {
      console.error("Subscription Error:", error);

      if (error.response) {
        if (error.response.status === 409) {
          Swal.fire({
            icon: "info",
            title: "Already Subscribed",
            text: "This email is already subscribed to our mailing list.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Subscription Failed",
            text: error.response.data.message || "Something went wrong. Please try again later.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Please check your internet connection and try again.",
        });
      }
    }
  };




  // Handle Scroll-to-Top Button Visibility
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll-to-Top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    { icon: <FaFacebookF />, link: "https://www.facebook.com/dialexportmart", color: "#3b5998" },
    { icon: <FaYoutube />, link: "https://www.youtube.com/@DialExportMart", color: "#ff0000" },
    { icon: <FaLinkedinIn />, link: "https://www.linkedin.com/company/dialexportmart", color: "#0077b5" },
    { icon: <FaXTwitter />, link: "https://x.com/DialExportMart", color: "#1da1f2" },
    { icon: <FaInstagram />, link: "https://www.instagram.com/dialexportmart", color: "#e1306c" },
  ];

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 py-10 mt-5">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Contact</h5>
              <p className="text-sm my-2">📍 Rawat Plaza, Sector 7, Ramphal Chowk</p>
              <p className="text-sm my-2">📞 +91 8448668076</p>
              <p className="text-sm my-2 text-red-400 font-semibold">Mon - Fri, 9 AM - 6 PM (IST)</p>
              <p className="text-sm my-2">📧 info@dialexportmart.com</p>
              <p className="text-sm my-2">🌐 www.dialexportmart.com</p>
            </div>


            {/* Directory Links */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Directory</h5>
              <ul className="space-y-2 p-0 text-sm">
                <li>
                  <Link href="/become-a-member" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    Become a Member
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/what-we-do" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    What We Do
                  </Link>
                </li>
                <li>
                  <Link href="/user/register" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    Join Us
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>


            {/* Quick Links (Categories from API) */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Help & Support</h5>
              <ul className="space-y-2 p-0 text-sm">
                <li>
                  <Link href="/contact-us" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-use" className="hover:text-gray-200 transition text-gray-300 text-decoration-none">
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>



            {/* Social Media */}
            <div className="">
              <h5 className="text-lg font-semibold text-white mb-2">Follow Us</h5>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.link}
                    target="_blank"
                    className="rounded-full text-white hover:opacity-80 transition-all"
                    style={{
                      backgroundColor: social.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>

              {/* Subscribe Section */}
              <h5 className="text-lg font-semibold text-white mb-2 mt-4">Subscribe</h5>
              <form onSubmit={handlesubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-2 rounded-md w-full text-black outline-none common-shad"
                  value={subscribe}
                  onChange={(e) => setSubscribe(e.target.value)}
                />
                <button type="submit" className="bg-red-500 hover:bg-red-600 fs-3 text-white px-2  rounded-md common-shad">➤</button>
              </form>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-700 my-6" />

          {/* Copyright & Apps */}
          <div className="flex flex-col md:flex-row items-center justify-between align-items-center">
            <p className="text-sm mb-0 text-red-400">&copy; {new Date().getFullYear()} Dial Export Mart. All Rights Reserved.</p>
            <div className="flex gap-4 md:mt-0 align-items-center  py-1 rounded-3">

              <GoogleTranslate />
              {/* ✅ Google Partner Link (Opens in New Tab) */}
              <Link
                href="https://www.google.com/partners/agency?id=7430369059"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={Gpimage}
                  alt="Google Partner Logo"
                  width={100}
                  height={100}
                  className="gp-img shadow"
                />
              </Link>


              {/* ✅ Google Play Link */}
              <Link href="/coming-soon">
                <Image src="/assets/play.png" alt="Google Play" width={128} height={40} />
              </Link>

              {/* ✅ App Store Link */}
              <Link href="/coming-soon">
                <Image src="/assets/appstore.png" alt="App Store" width={128} height={40} />
              </Link>


            </div>
          </div>

        </div>
      </footer>

      {/* Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 res-des3 text-white p-3  bot-to-top rounded-full shadow-lg transition-opacity ${isVisible ? "opacity-100" : "opacity-0"
          }`}
        style={{ width: "50px", height: "50px", zIndex: "1000" }} // Ensure it's always on top
      >
        <FaArrowUp size={20} />
      </button>
    </>
  );
};

export default Footer;
