import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <>
    <section className="mt-2">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Image src="/assets/coming-soon-min.png" alt="Google Play" width={2164} height={919} />
          </div>
        </div>
      </div>
    </section>

    </>
  );
};

export default Page;