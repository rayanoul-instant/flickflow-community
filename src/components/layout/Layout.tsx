import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  showNavLogo?: boolean;
}

export function Layout({ children, hideNav = false, showNavLogo = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <Navbar showLogo={showNavLogo} />}
      <main className="flex-1 pt-16 pb-20 md:pb-0">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
