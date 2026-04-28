import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import type { ReactNode } from "react";

export const metadata = {
  title: "User Dashboard",
  description: "Manage users",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}