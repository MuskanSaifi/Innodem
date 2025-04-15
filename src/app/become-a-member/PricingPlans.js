"use client";
import React, { useEffect } from 'react';
import './PricingPlans.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import plans from './PlansData';
import Image from "next/image";


const PricingPlans = () => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    userdata();
  }, [token]);

  const userdata = async () => {
    // Your async logic here
  };

  return (
    <>
      <div className="text-center">
        <Image
          src={"/assets/pagesbanner/B2B (12).png" || "/placeholder.png"}
          alt="Blog Banner"
          layout="responsive" // Makes the image 100% width
          width={1000} // Base width (ignored in responsive mode)
          height={450} // Aspect ratio is maintained
          className="rounded img-fluid"
          style={{ objectFit: "cover", width: "100%" }} // Ensures it stretches to full width
          priority
        />
      </div>

    <section className="pricing-section rounded-4">
      <h1 className="title">Pricing and <span>Plan</span></h1>
      <div className="pricing-cards">
        {plans.map((plan, index) => (
          <div key={index} className={`card ${plan.highlighted ? 'highlight' : ''}`}>
            {plan.highlighted && <div className="ribbon shadow"><span className='d-block'>Popular</span> Choice</div>}
            <h2 className={`py-2 shadow rounded-2 ${plan.highlighted ? 'title-highlight' : 'title-normal'}`}>
              {plan.title}
            </h2>
            <ul>
              {plan.features.map(([text, included], idx) => (
                <li key={idx} className='text-ssm'>
                  {included ? (
                    <FaCheckCircle className="check" color="#04BA00" />
                  ) : (
                    <FaTimesCircle className="cross" color="#F34234" />
                  )}
                  {text}
                </li>
              ))}
            </ul>
            <h3>{plan.price}</h3>
            <p className="gst">+ 18% GST Per Year</p>

            <button
              className="shadow"
              onClick={() => {
                if (user) {
                  const numericAmount = plan.price.replace(/[^\d]/g, ""); // Clean the amount (remove ₹, commas, etc.)

                  // Prepare query parameters with dynamic amount and package name
                  const queryParams = new URLSearchParams({
                    amount: numericAmount, // Amount based on selected plan
                    packageName: plan.title,
                  }).toString();
                  router.push(`/payment/initiate?${queryParams}`);
                } else {
                  router.push("/user/login");
                }
              }}
            >
              {user ? 'Pay Now' : 'Pay Now'}
            </button>
          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default PricingPlans;
