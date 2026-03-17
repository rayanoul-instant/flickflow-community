import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search as SearchIcon, MessageSquareText, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import logoInstant from '@/assets/logo-instant.png';
import { useState } from 'react';

const dockItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: SearchIcon },
  { href: '/messages', label: 'Messages', icon: MessageSquareText },
  { href: '/account', label: 'Account', icon: User },
];

export function Navbar({ showLogo = true }: { showLogo?: boolean }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img
              src={logoInstant}
              alt="Instant"
              className="h-10 object-contain"
              animate={{ opacity: showLogo ? 1 : 0, scale: showLogo ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          {/* Desktop floating dock */}
          <div
            className="hidden md:flex items-center gap-4 rounded-[28px] px-5 py-2.5 relative"
            style={{
              background: 'linear-gradient(145deg, hsl(270 30% 18%), hsl(265 25% 12%))',
              boxShadow: '0 0 24px hsl(270 70% 40% / 0.2), 0 6px 24px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(270 40% 30% / 0.3)',
              border: '1px solid hsl(270 40% 25% / 0.5)',
            }}
          >
            <div className="absolute -top-6 left-6 w-1 h-1 rounded-full bg-primary/25 animate-pulse" />
            <div className="absolute -top-4 right-10 w-1 h-1 rounded-full bg-accent/20 animate-pulse" style={{ animationDelay: '0.4s' }} />

            {dockItems.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.href;

              return (
                <div key={item.href} className="relative flex flex-col items-center">
                  {/* Tooltip below */}
                  <AnimatePresence>
                    {hovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -bottom-11 z-10 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase whitespace-nowrap"
                        style={{
                          background: 'hsl(265 25% 10% / 0.95)',
                          border: '1.5px solid hsl(180 70% 70% / 0.7)',
                          color: 'hsl(180 70% 90%)',
                          boxShadow: '0 0 16px hsl(180 70% 70% / 0.3), 0 0 4px hsl(180 70% 70% / 0.2)',
                        }}
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{ scale: hovered ? 1.3 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Link
                      to={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="relative w-11 h-11 rounded-full flex items-center justify-center"
                      style={{
                        background: 'transparent',
                        border: `2px solid ${
                          hovered
                            ? 'hsl(270 70% 60% / 0.9)'
                            : active
                              ? 'hsl(270 60% 55% / 0.8)'
                              : 'hsl(270 40% 35% / 0.6)'
                        }`,
                        boxShadow: hovered
                          ? '0 0 20px hsl(270 70% 55% / 0.5), inset 0 0 10px hsl(270 70% 55% / 0.15)'
                          : active
                            ? '0 0 10px hsl(270 70% 55% / 0.3)'
                            : 'none',
                      }}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-all duration-200",
                          hovered && "drop-shadow-[0_0_8px_hsl(270_70%_55%/0.7)]",
                          active && !hovered && "drop-shadow-[0_0_6px_hsl(270_70%_55%/0.6)]"
                        )}
                        style={{
                          color: hovered
                            ? 'hsl(180 70% 80%)'
                            : active
                              ? 'hsl(180 60% 70%)'
                              : 'hsl(180 40% 55%)',
                        }}
                        strokeWidth={1.5}
                      />
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="border-border hover:bg-secondary text-sm"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button variant="default" size="sm" className="btn-cinema">
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Log in
                  </span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
