import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  showNavLogo?: boolean;
}

export function Layout({ children, hideNav = false, showNavLogo = true }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <Navbar showLogo={showNavLogo} />}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex-1 pt-16 pb-20 md:pb-0"
      >
        {children}
      </motion.main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
