import React from "react";

const Page = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-4xl font-bold text-gray-800">Coming Soon</h1>
        <p className="text-gray-600 mt-2">We're working hard to bring something amazing. Stay tuned!</p>
        <p className="text-gray-600 mt-4">Mobile application coming soon for iOS and Android</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="/coming-soon"><img src="/assets/play.png" alt="Google Play" className="w-32" /></a>
          <a href="/coming-soon"><img src="/assets/appstore.png" alt="App Store" className="w-32" /></a>
        </div>
      </div>
    </div>
  );
};

export default Page;