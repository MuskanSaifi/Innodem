import React from "react";
import Image from "next/image";

export const metadata = {
  title: "About Dial Export Mart | Trusted Global Export Solutions Provider",
  description:
    "Dial Export Mart is a trusted platform that connects verified Indian manufacturers and exporters with buyers worldwide using smart AI technology.",
  keywords: [
    "about Dial Export Mart",
    "export platform",
    "global trade",
    "business networking",
    "SME support",
    "export services",
  ],
  openGraph: {
    title: "About Dial Export Mart | Trusted Global Export Solutions Provider",
    description:
      "Dial Export Mart is a trusted platform that connects verified Indian manufacturers and exporters with buyers worldwide using smart AI technology.",
    url: "https://www.dialexportmart.com/about-us",
    siteName: "Dial Export Mart",
    images: [
      {
        url: "https://www.dialexportmart.com/assets/pagesbanner/About-Us.png",
        width: 1200,
        height: 630,
        alt: "About Us Banner",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  alternates: {
    canonical: "https://www.dialexportmart.com/about-us",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [
    {
      name: "Dial Export Mart",
      url: "https://www.dialexportmart.com",
    },
  ],
  publisher: "Dial Export Mart",
  metadataBase: new URL("https://www.dialexportmart.com"),
};



const Page = () => {
  return (
    <>
    <div className="text-center">
<Image
  src={"/assets/pagesbanner/About-Us.png"}
  alt="Blog Banner"
  layout="responsive"
  width={1000}
  height={450}
  className="rounded w-full object-cover"
  priority
/>

    </div>

    <div className="container mx-auto p-6">
    <h1 className="title">About <span>Us</span></h1>
    <p className="text-sm text-gray-700 mb-6">
        <strong>Dial Export Mart</strong> is a cutting-edge web network-centric trade platform meticulously crafted for small and medium businesses worldwide. Our platform seamlessly unites traders, wholesalers, retailers, manufacturers, and brands, providing them with a unified space to conduct business efficiently. With a commitment to exporting trade marts, we prioritize delivering exceptional services that empower businesses to scale and thrive in the global market.
      </p>
      
      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
      <p className="text-sm text-gray-700 mb-6">
        At <strong>Dial Export Mart</strong>, we understand the challenges of navigating the complex world of export trade. That's why we have created a platform that makes exporting simple, efficient, and profitable for businesses in Delhi and across India. Our platform connects exporters with a global network of buyers, providing access to new markets and opportunities.
      </p>
      
      <h2 className="text-2xl font-bold mb-4">Our Values</h2>
      <p className="text-sm text-gray-700 mb-6">
        Our objective is to extend our reach to a maximum number of small and medium enterprises, providing unwavering support in securing instant business deals. At <strong>Dial Export Mart</strong>, we are dedicated to empowering businesses by connecting them with valuable opportunities in a seamless and efficient manner.
      </p>
      
      <h2 className="text-2xl font-bold mb-4">Core Values</h2>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>Commitment:</strong> We are steadfast in our dedication to our clients, partners, and stakeholders.</li>
        <li><strong>Consistency:</strong> We strive for uniformity in the quality of our services, interactions, and support.</li>
        <li><strong>Credibility:</strong> We prioritize transparency, integrity, and reliability in every aspect of our operations.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mb-4">Our Team</h2>
      <p className="text-sm text-gray-700 mb-6">
        At <strong>Dial Export Mart</strong>, we recognize that the strength of our organization lies in the collective efforts of our experienced and skilled team. Each member of our team is not only seasoned in their respective fields but also committed to staying abreast of the latest developments. 
      </p>
      
      <p className="text-sm text-gray-700 mb-6">
        Our team's collaborative efforts are geared towards crafting tailored solutions that meet the unique needs of our clients. By fostering a culture of continual learning and excellence, we strive to maintain a cutting-edge approach, delivering innovative solutions that exceed expectations.
      </p>
    </div>
    </>
  );
};

export default Page;