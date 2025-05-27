import React, { useState } from "react";
import Image from "next/image";

const allFaqs = [
  {
    question: "What is Dial Export Mart?",
    answer:
      "Dial Export Mart is a trusted B2B platform that connects Indian exporters, manufacturers, and suppliers with verified international buyers...",
  },
  {
    question: "Who can register on Dial Export Mart?",
    answer:
      "Any exporter, manufacturer, trader, or supplier based in India can register...",
  },
  {
    question: "Is registration on Dial Export Mart free?",
    answer:
      "Yes, basic registration is free. We also offer premium plans with advanced features...",
  },
  {
    question: "What products can be listed on the platform?",
    answer:
      "You can list products across various industries including Spices, Handicrafts...",
  },
  {
    question: "How do I connect with global buyers?",
    answer:
      "Once you create your profile and list your products, verified international buyers can view...",
  },
  {
    question: "Is my data and business information secure?",
    answer:
      "Yes, we prioritize data security. All business and personal information is stored securely...",
  },
  {
    question: "What is the verification process?",
    answer:
      "After registration, you can submit business documents to get a Verified Seller badge...",
  },
  {
    question: "Can I manage multiple products and categories?",
    answer:
      "Yes, our dashboard allows you to manage multiple product listings...",
  },
  {
    question: "How do I get support if I have questions or issues?",
    answer:
      "You can reach out to us through our Contact Us page...",
  },
  {
    question: "How does Dial Export Mart help in increasing exports?",
    answer:
      "By offering a global platform, we help Indian businesses expand their reach...",
  },
  // More FAQs beyond the top 10
  {
    question: "How can I get verified leads?",
    answer: "Premium members receive verified leads through our smart matchmaking engine.",
  },
  {
    question: "Can I track buyer interactions?",
    answer: "Yes, our dashboard provides analytics on buyer views and inquiries.",
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes, our mobile app is coming soon for both Android and iOS platforms.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support various payment gateways including Razorpay and Stripe.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = searchTerm
    ? allFaqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allFaqs.slice(0, 10); // Show top 10 by default

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#e6f0ff] to-[#fcefe7] relative px-4 py-16 mt-5 mb-5">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse z-0"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Frequently Asked <br /> Questions
          </h2>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search question here"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* FAQ List with max height */}
          <div
            className="space-y-4 overflow-y-auto pr-2"
            style={{ maxHeight: "470px" }}
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
              <div
  key={index}
  className="bg-white border border-gray-100 rounded-xl shadow hover:shadow-lg hover:border-indigo-300 transition duration-300"
>
  <button
    className="w-full px-5 py-4 text-left flex justify-between items-center text-gray-800 font-medium"
    onClick={() => toggle(index)}
  >
    {faq.question}
    <span className="text-2xl text-indigo-500">
      {openIndex === index ? "−" : "+"}
    </span>
  </button>
  {openIndex === index && (
    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
      {faq.answer}
    </div>
  )}
</div>

              ))
            ) : (
              <p className="text-gray-500">No matching FAQs found.</p>
            )}
          </div>
        </div>

        {/* Right Illustration */}
   <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
  <Image
    src="/assets/faq.png"
    alt="FAQ Illustration"
    fill
    className="object-contain md:object-cover"
    priority
  />
</div>

      </div>
    </div>
  );
};

export default Faq;
