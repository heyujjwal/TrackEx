import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrackEx",
  description: "AI Powered Expense Tracker",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.className } `}
      >
        {/* //header */}
        <Header/>

        <main className="min-h-screen">
          {children}
        </main>
        <Toaster richColors />
        {/* //footer */}
        <footer className="bg-gray-300 py-12">
          
          <div className="container mx-auto px-4 text-center text-gray-700">
            <p>&copy; 2025 TrackEx. All rights reserved.</p>
            <p>
              Built with Next.js and Tailwind CSS.{" "}
              <a
                href="https://github.com/yourusername/trackex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
