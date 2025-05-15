import ContactPage from "./ContactPage";

export const metadata = {
  title: "Contact Us | Dial Export Mart",
  description: "Get in touch with Dial Export Mart for inquiries, support, partnerships, and more. We're here to help you grow.",
  keywords: ["Contact Dial Export Mart", "Customer Support", "Business Inquiry", "Export Help", "Import Assistance", "Partnerships"],
  alternates: {
    canonical: "https://dialexportmart.com/contact-us",
  },
  openGraph: {
    title: "Contact Us | Dial Export Mart",
    description: "Reach out to us for any questions or support related to exports, imports, or partnership opportunities.",
    url: "https://dialexportmart.com/contact-us",
    siteName: "Dial Export Mart",
    images: [
      {
        url: "https://dialexportmart.com/assets/contact-us.png", // optional: update this if you have a contact banner
        width: 1200,
        height: 630,
        alt: "Contact Us Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Dial Export Mart",
    description: "We're here to help. Contact Dial Export Mart for any queries or business support.",
    images: ["https://dialexportmart.com/assets/contact-us.png"], // optional
  },
};

export default function Page() {
  return <ContactPage />;
}
  