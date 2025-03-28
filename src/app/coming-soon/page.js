import React from "react";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex items-center justify-center m-5 p-5 bg-gray-100">
      <div className="text-center p-5 bg-white shadow-lg rounded-2xl">
        <h1 className="text-4xl font-bold text-gray-800">Coming Soon</h1>
        <p className="text-gray-600 mt-2">We're working hard to bring something amazing. Stay tuned!</p>
        <p className="text-gray-600 mt-2">Mobile application coming soon for iOS and Android</p>
        <div className="flex justify-center gap-4 mt-3">

          <Link href="/coming-soon">
            <Image src="/assets/play.png" alt="Google Play" width={128} height={40} />
          </Link>

          <Link href="/coming-soon">
            <Image src="/assets/appstore.png" alt="App Store" width={128} height={40} />
          </Link>

        </div>

        <br></br>
        <Link href="../" >Go back...</Link>
      </div>
    </div>
  );
};

export default Page;