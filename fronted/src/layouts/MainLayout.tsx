import React from 'react';
import { Navbar } from '../components/Navbar';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
        © 2026 FashionAI System. Built for Global Challenge.
      </footer>
    </div>
  );
};