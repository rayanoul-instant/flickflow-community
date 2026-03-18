import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquareText, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/messages', label: 'Messages', icon: MessageSquareText },
  { href: '/account', label: 'Account', icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:hidden">
      <nav className="pointer-events-auto relative mb-4 mx-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-8 left-10 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" />
          <div className="absolute -top-5 right-14 w-1 h-1 rounded-full bg-accent/20 animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="absolute -top-10 left-1/2 w-1 h-1 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '0.5s' }} />

          <div
            className="flex items-center gap-3 rounded-[32px] px-4 py-3 relative"
            style={{
              background: 'linear-gradient(145deg, hsl(270 30% 18%), hsl(265 25% 12%))',
              boxShadow: '0 0 30px hsl(270 70% 40% / 0.25), 0 8px 32px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(270 40% 30% / 0.3)',
              border: '1px solid hsl(270 40% 25% / 0.5)',
            }}
          >
            {navItems.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.href;

              return (
                <div key={item.href} className="relative flex flex-col items-center">
                  {/* Tooltip above on mobile */}
                  <AnimatePresence>
                    {hovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-12 z-10 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-widest uppercase whitespace-nowrap"
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
                    animate={{ scale: hovered ? 1.25 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Link
                      to={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onTouchStart={() => setHoveredItem(item.href)}
                      onTouchEnd={() => setTimeout(() => setHoveredItem(null), 800)}
                      className="relative w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: 'transparent',
                        border: `2px solid ${
                          hovered
                            ? 'hsl(270 70% 60% / 0.9)'
                            : active
                              ? 'hsl(270 70% 65% / 0.95)'
                              : 'hsl(270 40% 35% / 0.6)'
                        }`,
                        boxShadow: hovered
                          ? '0 0 20px hsl(270 70% 55% / 0.5), inset 0 0 10px hsl(270 70% 55% / 0.15)'
                          : active
                            ? '0 0 18px hsl(270 70% 60% / 0.45), inset 0 0 10px hsl(270 70% 60% / 0.15)'
                            : 'none',
                      }}
                    >
                      <item.icon
                        className={cn(
                          "w-6 h-6 transition-all duration-200",
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
        </div>

        <div className="absolute -bottom-0.5 -right-1 w-3 h-3 text-muted-foreground/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
          </svg>
        </div>
      </nav>
    </div>
  );
}
