import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search as SearchIcon, MessageSquareText, User, Settings, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import logoInstant from '@/assets/logo-instant.png';
import { useState } from 'react';

const dockItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: SearchIcon },
  { href: '/messages', label: 'Messages', icon: MessageSquareText, isCenter: true },
  { href: '/account', label: 'Account', icon: User },
  { href: '/discussions', label: 'Discussions', icon: Settings },
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
          <div className="hidden md:flex items-end gap-0 rounded-[24px] px-2 py-1.5 relative"
            style={{
              background: 'linear-gradient(145deg, hsl(270 30% 18%), hsl(265 25% 12%))',
              boxShadow: '0 0 20px hsl(270 70% 40% / 0.2), 0 4px 20px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(270 40% 30% / 0.3)',
              border: '1px solid hsl(270 40% 25% / 0.5)',
            }}
          >
            {dockItems.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.href;

              if (item.isCenter) {
                return (
                  <div key={item.href} className="relative flex flex-col items-center -mt-3 -mb-1 mx-1">
                    <AnimatePresence>
                      {hovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          className="absolute -top-8 z-10 px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap"
                          style={{
                            background: 'hsl(265 25% 12% / 0.95)',
                            border: '1px solid hsl(180 70% 70% / 0.5)',
                            color: 'hsl(180 70% 85%)',
                            boxShadow: '0 0 10px hsl(180 70% 70% / 0.2)',
                          }}
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {active && (
                      <div className="absolute -top-1 -right-0.5 z-20 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          background: 'hsl(180 70% 75%)',
                          boxShadow: '0 0 8px hsl(180 70% 70% / 0.6)',
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="hsl(265 25% 15%)" className="w-2.5 h-2.5">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    )}

                    <Link
                      to={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="relative w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105"
                      style={{
                        background: active
                          ? 'linear-gradient(145deg, hsl(260 10% 45%), hsl(260 10% 35%))'
                          : 'linear-gradient(145deg, hsl(260 10% 40%), hsl(260 10% 30%))',
                        boxShadow: active
                          ? '0 0 16px hsl(270 70% 55% / 0.4), 0 4px 12px hsl(0 0% 0% / 0.4)'
                          : '0 4px 12px hsl(0 0% 0% / 0.3)',
                        border: '2px solid hsl(270 50% 40% / 0.5)',
                      }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: 'hsl(260 10% 25%)' }} strokeWidth={2.5} />
                    </Link>
                  </div>
                );
              }

              return (
                <div key={item.href} className="relative flex flex-col items-center mx-0.5">
                  <AnimatePresence>
                    {hovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-7 z-10 px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap"
                        style={{
                          background: 'hsl(265 25% 12% / 0.95)',
                          border: '1px solid hsl(180 70% 70% / 0.5)',
                          color: 'hsl(180 70% 85%)',
                          boxShadow: '0 0 10px hsl(180 70% 70% / 0.2)',
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
                    className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    style={{
                      border: `2px solid ${active ? 'hsl(270 60% 55% / 0.8)' : 'hsl(270 40% 35% / 0.6)'}`,
                      background: 'transparent',
                      boxShadow: active ? '0 0 10px hsl(270 70% 55% / 0.3)' : 'none',
                    }}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 transition-all duration-200",
                        active ? "drop-shadow-[0_0_6px_hsl(270_70%_55%/0.6)]" : "group-hover:drop-shadow-[0_0_6px_hsl(270_70%_55%/0.4)]"
                      )}
                      style={{ color: active ? 'hsl(180 60% 70%)' : 'hsl(180 40% 55%)' }}
                      strokeWidth={1.5}
                    />
                  </Link>
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
