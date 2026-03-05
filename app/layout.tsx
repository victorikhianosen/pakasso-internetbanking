import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/providers/contextProvider";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Pakasso | Internet Banking",
  description:
    "Pakasso Credit and Capital Ltd is a licensed Nigerian finance company providing fast, transparent, and flexible credit solutions for individuals, SMEs, farmers, and businesses nationwide under CBN regulation — from working capital and trade finance to personal and payroll-backed loans.",
  keywords: [
    "pakasso",
    "internet Banking",
    "finance",
    "credit",
    "financial services",
    "Transfer",
    "Loan",
    "Deposit",
    "Payment",
  ],
  icons: "./favicon.ico",
  openGraph: {
    title: "Pakasso - Trusted Credit & Finance Partner",
    description:
      "Get fast and responsible financing for personal needs, business growth, agriculture, payroll loans, and more with Pakasso Credit and Capital Ltd — a CBN-regulated lender in Nigeria.",
    url: "https://pakassocreditandcapital.com/",
    siteName: "Pakasso Credit and Capital Ltd",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${beVietnamPro.variable} antialiased`}>
        <Providers>
          {children}
          <ToastContainer position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
