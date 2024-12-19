import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Code Colab",
  description: "Collaborate with us to create innovative, top-tier code and exceptional projects.",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" className="min-w-screen">

      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap"
        />
      </head>


      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-screen`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              backdropFilter: 'blur(20px)', // Apply blur effect
              WebkitBackdropFilter: 'blur(20px)', // Safari support
              color: '#333', // Text color
              borderRadius: '8px', // Rounded corners
              fontSize: '14px', // Adjust font size
              padding: '12px 16px', // Add spacing
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // Solid white background for default
            },
            success: {
              style: {
                background: 'rgba(255, 255, 255, 0.5)', // Opaque white for success
                color: '#333', // Dark text for contrast
              },
            },
            error: {
              style: {
                backgroundcolor: 'rgba(255, 255, 255, 0.1) !important',
                color: 'black', // White text
              },
            },
          }}
        />

        <div className="absolute -z-10 w-screen h-screen">
          <img src="../grid.svg" alt="grid" className="w-screen h-screen" />
        </div>
        {children}
      </body>
    </html>
  );
}
