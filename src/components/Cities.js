import React from "react";
import Image from "next/image";

const cities = [
  { name: "Delhi", icon: "/countries/cities/delhi.png", link: "#" },
  { name: "Gurugram", icon: "/countries/cities/gurugram.png", link: "#" },
  { name: "Noida", icon: "/countries/cities/noida.png", link: "#" },
  { name: "Bengaluru", icon: "/countries/cities/bangalore.png", link: "#" },
  { name: "Chennai", icon: "/countries/cities/chennai.png", link: "#" },
  // { name: "Mumbai", icon: "/countries/cities/mumbai.png", link: "#" },
  // { name: "Ahmedabad", icon: "/countries/cities/ahmedabad.png", link: "#" },
  // { name: "Kolkata", icon: "/countries/cities/kolkata.png", link: "#" },
  // { name: "Pune", icon: "/countries/cities/pune.png", link: "#" },
  // { name: "Surat", icon: "/countries/cities/surat.png", link: "#" },
  // { name: "Hyderabad", icon: "/countries/cities/hyderabad.png", link: "#" },
  { name: "More Cities", icon: "", link: "#" },
];

const Cities = () => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Find Suppliers from Top Cities
      </h2>
      <div className="flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-6 overflow-x-auto md:overflow-hidden justify-center">
        {cities.map((city, index) => (
          <a
            key={index}
            href={city.link}
            className="flex flex-col items-center space-y-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 min-w-[100px]"
          >
            {city.icon ? (
              <Image
                src={city.icon || "city icon"}
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
  );
};

export default Cities;
