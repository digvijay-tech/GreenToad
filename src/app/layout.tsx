import { AccountProvider } from "@/contexts/account/index";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenToad Web",
  description: "Welcome to GreenToad App!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* User Account Context */}
        <AccountProvider>
          {/* All Other Pages and Components */}
          { children }
        </AccountProvider>

        {/* Globally Placed Toast Element */}
        <Toaster />
      </body>
    </html>
  );
}
