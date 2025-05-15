import JoinUs from "./JoinUs";

export const metadata = {
  title: "Join Us | Dial Export Mart",
  description: "Register now on Dial Export Mart to buy or sell products and grow your business globally.",
  keywords: ["Join Dial Export Mart", "Buy and Sell", "Register", "Business Growth", "Export", "Import"],
  alternates: {
    canonical: "https://dialexportmart.com/join-us",
  },
  openGraph: {
    title: "Join Us | Dial Export Mart",
    description: "Sign up today to buy or sell products on Dial Export Mart. Connect with global buyers and sellers.",
    url: "https://dialexportmart.com/join-us",
    siteName: "Dial Export Mart",
    images: [
      {
        url: "https://dialexportmart.com/assets/join-us.png", // make sure this path is accessible
        width: 1200,
        height: 630,
        alt: "Join Us Banner",
      },
    ],
    type: "website",
  },
};

export default function Page() {
  return <JoinUs />;
}
