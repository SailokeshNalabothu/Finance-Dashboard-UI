import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Button } from '../UI/Button';

interface LayoutProps {
  activePage: 'dashboard' | 'transactions';
  setActivePage: (page: 'dashboard' | 'transactions') => void;
  children: React.ReactNode;
}

export function Layout({ activePage, setActivePage, children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center border-b bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl px-4 lg:hidden shrink-0 shadow-sm z-30">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="mx-auto font-bold text-lg text-primary tracking-tight">FinDash</div>
          <div className="w-10"></div> {/* Spacer to center title */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 lg:p-10 relative">
          <div className="max-w-6xl mx-auto w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
