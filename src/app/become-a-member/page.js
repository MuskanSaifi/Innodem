import PricingPlans from './PricingPlans';

export const metadata = {
  title: "Pricing and Membership Plans | Dial Export Mart",
  description: "Explore flexible and affordable pricing plans at Dial Export Mart. Choose the ideal membership package to boost your business growth.",
  keywords: [
    "pricing plans",
    "membership",
    "subscription",
    "packages",
    "dial export mart",
    "affordable membership"
  ],
  openGraph: {
    title: "Pricing and Membership Plans | Dial Export Mart",
    description: "Explore flexible and affordable pricing plans at Dial Export Mart. Choose the ideal membership package to boost your business growth.",
    url: "https://dialexportmart.com/become-a-member",
    siteName: "Dial Export Mart",
    images: [
      {
        url: "https://dialexportmart.com/assets/pagesbanner/Become-a-Member.png",
        width: 1200,
        height: 630,
        alt: "Become a Member Banner",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  alternates: {
    canonical: "https://dialexportmart.com/become-a-member",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [
    {
      name: 'Dial Export Mart',
      url: 'https://dialexportmart.com',
    },
  ],
  publisher: 'Dial Export Mart',
  metadataBase: new URL('https://dialexportmart.com'),
};

const Page = () => {
  return (
    <section className='mt-5 mb-5'>
      <div className='container'>
        <PricingPlans />
      </div>
    </section>
  );
};

export default Page;
