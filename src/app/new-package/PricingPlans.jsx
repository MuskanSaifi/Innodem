"use client";
import React, { useState } from 'react';
import './PricingPlans.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import plans from './PlansData';
import Image from "next/image";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const PricingPlans = () => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const handleToggle = (planTitle, sectionTitle) => {
    const key = `${planTitle}-${sectionTitle}`;
    setExpandedSections(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handlePayNowClick = (plan) => {
    if (!user) {
      router.push("/user/login");
      return;
    }
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleFixedAmount = () => {
    const numericAmount = parseFloat(selectedPlan.price) * 1.18;
    const queryParams = new URLSearchParams({
      amount: numericAmount,
      packageName: selectedPlan.title,
      totalAmount: numericAmount
    }).toString();
  
    router.push(`/payment/initiate?${queryParams}`);
  };

  const handleProceedCustom = () => {
    if (!customAmount || isNaN(customAmount) || Number(customAmount) < 1) {
      alert("Please enter a valid amount");
      return;
    }
  
    const queryParams = new URLSearchParams({
      amount: customAmount,
      packageName: selectedPlan.title,
      totalAmount: customAmount
    }).toString();
  
    router.push(`/payment/initiate?${queryParams}`);
  };

  const renderFeatures = (plan, sectionTitle, features) => {
    const isExpanded = expandedSections[`${plan.title}-${sectionTitle}`];
    return (
      <div className="accordion-item">
        <button
          className="accordion-header"
          onClick={() => handleToggle(plan.title, sectionTitle)}
        >
          {sectionTitle}
          {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
        </button>
        {isExpanded && (
          <ul className="accordion-content">
            {features.map(([text, included], idx) => (
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
        )}
      </div>
    );
  };

  return (
    <>
      <div className="text-center">
        <Image
          src="/assets/pagesbanner/Become-a-Member.png"
          alt="Blog Banner"
          layout="responsive"
          width={1425}
          height={486}
          className="rounded w-full object-cover"
          priority
        />
      </div>

      <section className="pricing-section rounded-4 mt-5">
        <h1 className="title">Pricing and <span>Plan</span></h1>
        <div className="pricing-cards">
          {plans.map((plan, index) => (
            <div key={index} className={`card ${plan.highlighted ? 'highlight' : ''}`}>
              {plan.highlighted && <div className="ribbon shadow"><span className='d-block'>Popular</span> Choice</div>}
              <h2 className={`py-2 shadow pricing-titlt rounded-2 ${plan.highlighted ? 'title-highlight' : 'title-normal'}`}>
                {plan.title}
              </h2>
              {/* Render collapsible sections */}
              {renderFeatures(plan, 'Top Service', plan.topService)}
              {renderFeatures(plan, 'Website Packages', plan.website)}
              {renderFeatures(plan, 'SEO (Search Engine Optimization)', plan.seo)}
              {renderFeatures(plan, 'SMO (Social Media Optimization)', plan.smo)}

              <h3>₹ {Number(plan.price).toLocaleString('en-IN')}</h3>
              <p className="gst">+ 18% GST Per Year</p>

              <button className="shadow" onClick={() => handlePayNowClick(plan)}>
                Pay Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL (unchanged) */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* ... modal code */}
        </div>
      )}

      {/* Modal CSS (unchanged) */}
      <style jsx>{`
        /* ... CSS code */
      `}</style>
    </>
  );
};

export default PricingPlans;