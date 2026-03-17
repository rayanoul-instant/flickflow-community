import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquareText, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/messages', label: 'Messages', icon: MessageSquareText, isCenter: true },
  { href: '/account', label: 'Account', icon: User },
  { href: '/discussions', label: 'Discussions', icon: Settings },
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
      {/* Floating dock container */}
      <nav className="pointer-events-auto relative mb-3 mx-4">
        {/* Dock shape with contoured edges */}
        <div className="relative flex items-end justify-center">
          {/* Main bar background */}
          <div className="flex items-center gap-0 rounded-[28px] px-2 py-2 relative"
            style={{
              background: 'linear-gradient(145deg, hsl(270 30% 18%), hsl(265 25% 12%))',
              boxShadow: '0 0 30px hsl(270 70% 40% / 0.25), 0 8px 32px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(270 40% 30% / 0.3)',
              border: '1px solid hsl(270 40% 25% / 0.5)',
            }}
          >
            {/* Subtle dust motes */}
            <div className="absolute -top-6 left-8 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" />
            <div className="absolute -top-4 right-12 w-1 h-1 rounded-full bg-accent/20 animate-pulse animation-delay-300" />
            <div className="absolute -top-8 left-1/2 w-1 h-1 rounded-full bg-primary/20 animate-pulse animation-delay-500" />

            {navItems.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.href;

              if (item.isCenter) {
                return (
                  <div key={item.href} className="relative flex flex-col items-center -mt-5 mx-1">
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          className="absolute -top-10 z-10 px-3 py-1 rounded-lg text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap"
                          style={{
                            background: 'hsl(265 25% 12% / 0.95)',
                            border: '1px solid hsl(180 70% 70% / 0.5)',
                            color: 'hsl(180 70% 85%)',
                            boxShadow: '0 0 12px hsl(180 70% 70% / 0.2)',
                          }}
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active badge */}
                    {active && (
                      <div className="absolute -top-1 -right-1 z-20 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: 'hsl(180 70% 75%)',
                          boxShadow: '0 0 10px hsl(180 70% 70% / 0.6)',
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="hsl(265 25% 15%)" className="w-3 h-3">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    )}

                    <Link
                      to={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105"
                      style={{
                        background: active
                          ? 'linear-gradient(145deg, hsl(260 10% 45%), hsl(260 10% 35%))'
                          : 'linear-gradient(145deg, hsl(260 10% 40%), hsl(260 10% 30%))',
                        boxShadow: active
                          ? '0 0 20px hsl(270 70% 55% / 0.4), 0 4px 16px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(260 10% 55% / 0.3)'
                          : '0 4px 16px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(260 10% 50% / 0.2)',
                        border: '2px solid hsl(270 50% 40% / 0.5)',
                      }}
                    >
                      <item.icon className="w-7 h-7" style={{ color: 'hsl(260 10% 25%)' }} strokeWidth={2.5} />
                    </Link>
                  </div>
                );
              }

              return (
                <div key={item.href} className="relative flex flex-col items-center mx-0.5">
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-9 z-10 px-3 py-1 rounded-lg text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap"
                        style={{
                          background: 'hsl(265 25% 12% / 0.95)',
                          border: '1px solid hsl(180 70% 70% / 0.5)',
                          color: 'hsl(180 70% 85%)',
                          boxShadow: '0 0 12px hsl(180 70% 70% / 0.2)',
                        }}
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Link
                    to={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    style={{
                      border: `2px solid ${active ? 'hsl(270 60% 55% / 0.8)' : 'hsl(270 40% 35% / 0.6)'}`,
                      background: 'transparent',
                      boxShadow: active
                        ? '0 0 12px hsl(270 70% 55% / 0.3), inset 0 0 8px hsl(270 70% 55% / 0.1)'
                        : 'none',
                    }}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-all duration-200",
                        active ? "drop-shadow-[0_0_6px_hsl(270_70%_55%/0.6)]" : "group-hover:drop-shadow-[0_0_6px_hsl(270_70%_55%/0.4)]"
                      )}
                      style={{
                        color: active ? 'hsl(180 60% 70%)' : 'hsl(180 40% 55%)',
                      }}
                      strokeWidth={1.5}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Branding star */}
        <div className="absolute -bottom-0.5 -right-1 w-3 h-3 text-muted-foreground/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
          </svg>
        </div>
      </nav>
    </div>
  );
}
