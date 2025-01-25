import { UserProfileProvider } from "@/contexts/profile/index";
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
        {/* User Profile Context */}
        <UserProfileProvider>
          {/* All Other Pages and Components */}
          <main>
            {children}
          </main>
        </UserProfileProvider>

        {/* Globally Placed Toast Element */}
        <Toaster />
      </body>
    </html>
  );
}
