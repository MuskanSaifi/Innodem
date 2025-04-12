import React from 'react';
import Link from 'next/link'; // Import the Link component
import './PricingPlans.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const plans = [
  {
    title: 'Welcome Package',
    features: [
      ['3 Buyer Connect Per Month', true],
      ['1 Complimentary Deal Per Year', false],
      ['1 Business Email', true],
      ['Static Website', true],
      ['Domain', true],
      ['Website Maintenance For 1 year', true],
      ['Responsive Website', true],
      ['SEO 1 Keyword (Local Searches)', true],
      ['Whatsapp Chat Integration', false],
      ['SSL', true],
      ['Favicon Icon', true],
      ['Live Chat Integration', false],
      ['Social Media Profile Creation & Posting', false],
      ['Company Certificate', false],
      ['Customer Support Person', true],
    ],
    price: '₹ 21,999',
    highlighted: false,
  },
  {
    title: 'Premium Package',
    features: [
      ['5 Buyer Connect Per Month', true],
      ['1 Complimentary Deal Per Year', true],
      ['2 Business Emails', true],
      ['Static Website', true],
      ['Domain', true],
      ['Website Maintenance For 1 Year', true],
      ['Responsive Website', true],
      ['SEO 2 Keyword (Local Searches)', true],
      ['WhatsApp Chat Integration', true],
      ['SSL', true],
      ['Favicon Icon', false],
      ['Live Chat Integration', false],
      ['Social Media Profile Creation & Posting', false],
      ['Company Certificate', true],
      ['Customer Support Person', true],
    ],
    price: '₹ 41,999',
    highlighted: true,
  },
  {
    title: 'Diamond Package',
    features: [
      ['7 Buyer Connect Per Month', true],
      ['3 Complimentary Deals Per Year', true],
      ['3 Business Emails', true],
      ['Dynamic Website', true],
      ['Domain', true],
      ['Website Maintenance For 1 Year', true],
      ['Responsive Website', true],
      ['SEO (4 to 5 Keywords)', true],
      ['WhatsApp Chat Integration', true],
      ['SSL', true],
      ['Favicon Icon', true],
      ['Live Chat Integration', true],
      ['Social Media Profile Creation & Posting', false],
      ['Company Certificate', true],
      ['Customer Support Person', true],
    ],
    price: '₹ 79,999',
    highlighted: false,
  },
  {
    title: 'Premium Diamond',
    features: [
      ['15 Buyer Connect Per Month', true],
      ['4 Complimentary Deals Per Year', true],
      ['4 Business Emails', true],
      ['Dynamic Website', true],
      ['Domain', true],
      ['Website Maintenance For 1 Year', true],
      ['Responsive Website', true],
      ['SEO (6 to 8 Keywords)', true],
      ['WhatsApp Chat Integration', true],
      ['SSL', true],
      ['Favicon Icon', true],
      ['Live Chat Integration', true],
      ['Social Media Profile Creation & Posting', true],
      ['Company Certificate', true],
      ['Customer Support Person', true],
    ],
    price: '₹ 129,999',
    highlighted: false,
  },
];

const PricingPlans = () => {
  return (
    <section className="pricing-section rounded-4">
      <h1 className="title">Pricing and <span>Plan</span></h1>
      <div className="pricing-cards">
        {plans.map((plan, index) => (
          <div key={index} className={`card ${plan.highlighted ? 'highlight' : ''}`}>
            {plan.highlighted && <div className="ribbon shadow"><span className='d-block'>Popular</span> Choice</div>}
            <h2
              className={`py-2 shadow rounded-2 ${
                plan.highlighted ? 'title-highlight' : 'title-normal'
              }`}
            >
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
            <Link href="https://pmny.in/mISYyKZbaDRw" target="_blank" rel="noopener noreferrer">
              <button className="shadow">Pay Now</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPlans;
