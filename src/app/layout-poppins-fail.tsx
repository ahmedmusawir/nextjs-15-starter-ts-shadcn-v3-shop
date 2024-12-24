/**
 * RootLayout: /app/layout.tsx
 *
 * This layout file is responsible for wrapping all pages within the application.
 * It sets up the ThemeProvider, global styles, and Toaster for notifications.
 * It also handles backend operations during the initial page load, such as
 * generating the ticket types JSON file.
 *
 * The `fetchAndGenerateTicketTypes` function from the services folder is invoked here
 * to ensure that the ticket types data is fetched and generated on the server side
 * before rendering any pages. This operation is cached using Next.js's revalidation
 * mechanism to prevent unnecessary API calls.
 *
 * This approach ensures a non-blocking, efficient process for handling backend
 * operations while keeping the client-side components lightweight.
 */
import "./globals.scss";
import type { Metadata } from "next";
import Navbar from "@/components/global/Navbar";
import Main from "@/components/common/Main";
import Footer from "@/components/global/Footer";
import Cart from "@/components/cart/Cart";
import { Poppins } from "@next/font/google";
// import { Toaster } from "@/components/ui/toaster";
// import { ThemeProvider } from "./providers/ThemeProvider";

// Configure Poppins font with subsets and weights
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "700"], // Adjust weights as needed
//   display: "swap", // Ensures the font loads without blocking rendering
// });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Moose Next Framework v3",
  description: "This is just ui/ux framework with Shadcn",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Main className="flex flex-col">
            {children
              ? children
              : "This is a Layout container. Must have children"}
          </Main>
          <Footer />
          <Cart />
        </div>
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
