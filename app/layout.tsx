import type { Metadata } from "next";
import "./globals.css";
import AuthContext from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import ActiveStatus from "./components/ActiveStatus";

export const metadata: Metadata = {
  title: "TalkSpace",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-mono"
      >
        <AuthContext>
          <Toaster />
          <ActiveStatus/>
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
