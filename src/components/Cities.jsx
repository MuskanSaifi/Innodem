import React from "react";
import Image from "next/image";

const cities = [
  { name: "Delhi", icon: "/countries/cities/delhi.png", link: "#" },
  { name: "Gurugram", icon: "/countries/cities/gurugram.png", link: "#" },
  { name: "Noida", icon: "/countries/cities/noida.png", link: "#" },
  { name: "Bengaluru", icon: "/countries/cities/bangalore.png", link: "#" },
  { name: "Chennai", icon: "/countries/cities/chennai.png", link: "#" },
  { name: "More Cities", icon: "", link: "#" },
];

const Cities = () => {
  return (
    <>
    <div className="bg-gray-100 p-6 rounded-lg mt-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Find Suppliers from Top Cities
      </h2>

      <div className="city-scroll flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-6 overflow-x-auto md:overflow-hidden justify-start">
        {cities.map((city, index) => (
          <a
            key={index}
            href={city.link}
            className="flex flex-col items-center space-y-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 min-w-[100px] flex-shrink-0"
          >
            {city.icon ? (
              <Image
                src={city.icon}
                alt={city.name}
                width={100}
                height={100}
                className="rounded-full border border-gray-300"
              />
            ) : (
              <span className="text-4xl">⋯</span>
            )}
            <span className="text-md font-medium text-gray-800">{city.name}</span>
          </a>
        ))}
      </div>

    
    </div>
      {/* ✅ Internal CSS to hide scrollbars */}
      <style jsx>{`
        .city-scroll {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .city-scroll::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </>
  );
};

export default Cities;
