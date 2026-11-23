
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SalonBook | Modern Salon Appointment Booking",
  description: "Explore premium salon services and book your appointment online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body className={`${inter.className} bg-stone-50 text-stone-900 antialiased`}>
        <NextTopLoader color="#e17100" showSpinner={false} />
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
