import { useState, useEffect } from "react";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/adminprofile/category`); // API endpoint
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Directory (Categories from API) */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-3">Directory</h5>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((category) => (
<li key={category._id || category.slug || category.name}>
<a href={`/category/${category.slug}`} className="hover:text-gray-400 transition">
                      {category.name}
                    </a>
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
              <li><a href="#" className="hover:text-gray-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-gray-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-400 transition">Terms of Use</a></li>
              <li><a href="#" className="hover:text-gray-400 transition">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-gray-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-400 transition">Submit a Complaint</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-3">Contact</h5>
            <p className="text-sm my-2"><i className="fas fa-map-marker-alt mr-2"></i> Ramnagar, Ramgarh, Alwar, Delhi Road 301026</p>
            <p className="text-sm my-2"><i className="fas fa-phone mr-2"></i> +91-85-1097-1098</p>
            <p className="text-sm my-2 text-red-400 font-semibold">Mon - Fri, 9 AM - 6 PM (IST)</p>
            <p className="text-sm my-2"><i className="fas fa-envelope mr-2"></i> support@example.com</p>
            <p className="text-sm my-2"><i className="fas fa-globe mr-2"></i> www.example.com</p>
          </div>

          {/* Social Media */}
          <div className="text-center lg:text-left">
            <h5 className="text-lg font-semibold text-white mb-3">Follow Us</h5>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded"><i className="fab fa-youtube"></i></a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded"><i className="fab fa-twitter"></i></a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded"><i className="fab fa-instagram"></i></a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-6" />

        {/* Copyright & Apps */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">&copy; 2025 Your Company. All Rights Reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="#"><img src="/google-play.png" alt="Google Play" className="w-32" /></a>
            <a href="#"><img src="/app-store.png" alt="App Store" className="w-32" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
