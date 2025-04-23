import React from "react";

const stats = [
    { value: "50k+", label: "Active Verified Sellers" },
    { value: "200k+", label: "Products Listed Daily" },
    { value: "30k+", label: "Buyer Enquiries Per Day" },
    { value: "99%", label: "Positive Buyer-Seller Match Rate" },
  ];
  

const StatsWithImage = () => {
  return (
    <section className="py-16 px-4 md:px-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Stats Section */}
        <div className="grid grid-cols-2 gap-6 flex-1">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 text-center"
            >
              <h3 className="text-3xl font-bold text-purple-600 mb-2">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Right Image Section */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl border-8 border-white bg-gradient-to-tr from-green-300 to-purple-500 p-1">
            <img
              src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt="Smiling woman"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsWithImage;
