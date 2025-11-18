import React from "react";
import Image from "next/image";

export const metadata = {
  title: "About Dial Export Mart | Trusted Global Export Solutions Provider",
  description:
    "Dial Export Mart is India’s leading B2B marketplace helping exporters, suppliers, and manufacturers connect with verified global buyers.",
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
      "Dial Export Mart is a trusted platform connecting Indian manufacturers and exporters with verified global buyers.",
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
          alt="About Us Banner"
          width={1000}
          height={450}
          className="rounded w-full object-cover"
          priority
        />
      </div>

      <div className="container mx-auto p-6">
        <h1 className="title">About <span>Us</span></h1>

        <p className="text-sm text-gray-700 mb-6">
          <strong>Dial Export Mart</strong> is India’s leading B2B marketplace designed to empower 
          exporters, suppliers, manufacturers, and small and medium businesses. We bridge the gap 
          between companies and verified global buyers by offering a secure, transparent, and 
          efficient trade ecosystem. Our platform is built to help businesses grow, collaborate, 
          and build long-term international partnerships.
        </p>

        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-sm text-gray-700 mb-6">
          Exporting can be complex and competitive. Our mission is simple — to make exporting 
          easier, faster, and more profitable for Indian businesses. We provide a seamless 
          ecosystem where companies can list their products, connect with global buyers, and 
          secure verified business deals.
        </p>

        <h2 className="text-2xl font-bold mb-4">Vision</h2>
        <p className="text-sm text-gray-700 mb-6">
          Our vision is to become India’s most trusted and reliable online export marketplace, 
          helping thousands of businesses expand globally and build long-term international 
          partnerships.
        </p>

        <h2 className="text-2xl font-bold mb-4">Core Values</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
          <li><strong>Commitment:</strong> We are dedicated to helping exporters grow with real, result-driven global exposure.</li>
          <li><strong>Consistency:</strong> We ensure smooth communication and reliable support throughout the export journey.</li>
          <li><strong>Credibility:</strong> Trust and transparency define every part of our platform — from verified buyers to secure trade processes.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Our Team</h2>
        <p className="text-sm text-gray-700 mb-6">
          Behind Dial Export Mart is a passionate team of trade experts, digital strategists, and 
          export consultants who work together to empower Indian businesses. We stay ahead of 
          global trade trends, market demands, and digital innovations to deliver:
        </p>

        <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
          <li>Updated market insights</li>
          <li>Authentic and verified buyer connections</li>
          <li>Growth-focused and practical solutions</li>
        </ul>

        <p className="text-sm text-gray-700 mb-6">
          Our collaborative culture encourages innovation, strategic thinking, and solutions 
          that drive long-term business success.
        </p>

        <h2 className="text-2xl font-bold mb-4">How We Work</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700 mb-6 space-y-2">
          <li><strong>Company Analysis:</strong> We begin by understanding your products, market position, and growth potential.</li>
          <li><strong>Guidance on Improvement:</strong> We help refine packaging, branding, communication, and export readiness.</li>
          <li><strong>Requirement Documentation:</strong> We document goals, product details, and target markets for a personalized plan.</li>
          <li><strong>Buyer Identification:</strong> We match you with verified, relevant buyers aligned with your product category.</li>
          <li><strong>Facilitated Communication:</strong> We arrange meetings and ensure seamless buyer-seller communication.</li>
          <li><strong>Negotiation Support:</strong> Experts assist both sides for clarity and confidence in decision-making.</li>
          <li><strong>Deal Progression:</strong> Both parties proceed based on agreed terms for smooth execution.</li>
          <li><strong>Deal Closure:</strong> We collect feedback and continue supporting long-term global growth.</li>
        </ol>

        <h2 className="text-2xl font-bold mb-4">What Makes Us Different</h2>
        <p className="text-sm text-gray-700 mb-6">
          As part of We Export Trade Mart, we stay committed to service excellence. Unlike 
          platforms that only offer buy leads, Dial Export Mart focuses on facilitating genuine 
          and direct business deals. Our built-in <strong>video conferencing system</strong> helps suppliers 
          understand buyer requirements clearly, communicate efficiently, and build trust.
        </p>

        <p className="text-sm text-gray-700 mb-6">
          We understand that businesses need confirmed opportunities, not endless inquiries. 
          This is why Dial Export Mart serves as a true growth partner — ensuring reliable, 
          verified, and profitable trade connections for exporters, suppliers, and manufacturers.
        </p>
      </div>
    </>
  );
};

export default Page;
