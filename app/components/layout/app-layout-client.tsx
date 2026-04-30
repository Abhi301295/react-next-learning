'use client';

import { useState, ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AppLayoutClient({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 min-h-screen">
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}