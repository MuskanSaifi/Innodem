"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaFacebookF, FaYoutube, FaTwitter, FaLinkedinIn, 
  FaInstagram,  FaTelegramPlane, FaWhatsapp, 
  FaArrowUp 
} from "react-icons/fa";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/adminprofile/category`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
    { icon: <FaTwitter />, link: "#" },
    { icon: <FaLinkedinIn />, link: "#" },
    { icon: <FaInstagram />, link: "#" },
    { icon: <FaWhatsapp />, link: "#" },

  ];

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Directory (Categories from API) */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Directory</h5>
              <ul className="space-y-2 my-cat-list">
  {categories.length > 0 ? (
    categories.map((category, index) => (
      <li key={category.id || category.slug || index}>
        <Link href={`/category/${category.slug}`} className="hover:text-gray-400 transition">
          {category.name}
        </Link>
      </li>
    ))
  ) : (
    <li className="text-gray-500">Loading categories...</li>
  )}
</ul>

            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Quick Links</h5>
              <ul className="space-y-2">
                {["About Us", "Privacy Policy", "Terms of Use", "Shipping & Delivery", "Contact Us", "Submit a Complaint"].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-gray-400 transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Contact</h5>
              <p className="text-sm my-2">📍 Rawat Plaza, Sector 7, Ramphal Chowk</p>
              <p className="text-sm my-2">📞 +91 8448668076</p>
              <p className="text-sm my-2 text-red-400 font-semibold">Mon - Fri, 9 AM - 6 PM (IST)</p>
              <p className="text-sm my-2">📧 support@digitalexportsmarketing.com</p>
              <p className="text-sm my-2">🌐 www.dialexportmart.com</p>
            </div>

            {/* Social Media */}
            <div className="text-center lg:text-left">
              <h5 className="text-lg font-semibold text-white mb-3">Follow Us</h5>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start m-auto" style={{ maxWidth: "130px" }}>
  {socialLinks.map((social, index) => (
    <a 
      key={index} 
      href={social.link} 
      className="bg-gray-800 hover:bg-gray-700 p-1 rounded-full text-white text-xl flex items-center justify-center"
      style={{ width: "40px", height: "40px" }}
    >
      {social.icon}
    </a>
  ))}
</div>

            </div>

          </div>

          {/* Divider */}
          <hr className="border-gray-700 my-6" />

          {/* Copyright & Apps */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm">&copy; {new Date().getFullYear()} Dial Export Mart. All Rights Reserved.</p>
            <div className="flex gap-4 mt-3 md:mt-0">
              <a href="/coming-soon"><img src="/assets/play.png" alt="Google Play" className="w-32" /></a>
              <a href="/coming-soon"><img src="/assets/appstore.png" alt="App Store" className="w-32" /></a>
            </div>
          </div>

        </div>
      </footer>

      {/* Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 res-des3 text-white p-3  bot-to-top rounded-full shadow-lg transition-opacity ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: "50px", height: "50px", zIndex: "1000" }} // Ensure it's always on top
      >
        <FaArrowUp size={20} />
      </button>
    </>
  );
};

export default Footer;
