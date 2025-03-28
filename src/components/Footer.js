"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaInstagram, FaArrowUp} from "react-icons/fa";
import Image from "next/image";
import Gpimage from "../../public/assets/gp.png";


const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);


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
    { icon: <FaFacebookF />, link: "#" },
    { icon: <FaYoutube />, link: "#" },
    { icon: <FaLinkedinIn />, link: "#" },
    { icon: <FaInstagram />, link: "#" },

  ];

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Contact Info */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Contact</h5>
              <p className="text-sm my-2">📍 Rawat Plaza, Sector 7, Ramphal Chowk</p>
              <p className="text-sm my-2">📞 +91 8448668076</p>
              <p className="text-sm my-2 text-red-400 font-semibold">Mon - Fri, 9 AM - 6 PM (IST)</p>
              <p className="text-sm my-2">📧 support@digitalexportsmarketing.com</p>
              <p className="text-sm my-2">🌐 www.dialexportmart.com</p>
            </div>

            {/* Directory (Categories from API) */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Helps</h5>
              <ul className="space-y-2">
                {[ "Submit a Complaint", "Privacy Policy", "Terms of Use"].map((link, index) => (
                  <li key={index}>
                    <Link href="#" className="hover:text-gray-400 transition">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>

            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Quick Links</h5>
              <ul className="space-y-2">
                {["About Us", "Shipping & Delivery", "Contact Us"].map((link, index) => (
                  <li key={index}>
                    <Link href="#" className="hover:text-gray-400 transition">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>



            {/* Social Media */}
            <div className="text-center lg:text-left">
              <h5 className="text-lg font-semibold text-white mb-3">Follow Us</h5>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start m-auto" style={{ maxWidth: "130px" }}>
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.link}
                    className="bg-gray-800 hover:bg-gray-700 p-1 rounded-full text-white text-xl flex items-center justify-center"
                    style={{ width: "50px", height: "30px" }}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>

            </div>

          </div>

          {/* Divider */}
          <hr className="border-gray-700 my-6" />

          {/* Copyright & Apps */}
          <div className="flex flex-col md:flex-row items-center justify-between align-items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Dial Export Mart. All Rights Reserved.</p>
            <div className="flex gap-4 mt-3 md:mt-0 align-items-center">
              {/* ✅ Google Partner Link (Opens in New Tab) */}

              <Link
                href="https://www.google.com/partners/agency?id=7430369059"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={Gpimage}
                  alt="Google Partner Logo"
                  width={120}
                  height={150}
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
