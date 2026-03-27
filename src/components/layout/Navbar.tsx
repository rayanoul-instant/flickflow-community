import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search as SearchIcon, MessageSquareText, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
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
    <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block bg-background/60 backdrop-blur-xl border-b border-border/30">
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
            className="hidden md:flex items-center gap-3 rounded-[24px] px-4 py-2 relative"
            style={{
              background: 'linear-gradient(145deg, hsl(270 20% 50% / 0.35), hsl(265 30% 40% / 0.25))',
              backdropFilter: 'blur(24px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
              boxShadow: '0 8px 32px hsl(270 40% 10% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.08), inset 0 -1px 0 hsl(270 30% 20% / 0.3)',
              border: '1px solid hsl(0 0% 100% / 0.12)',
            }}
          >
            {dockItems.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.href;

              return (
                <motion.div
                  key={item.href}
                  animate={{ scale: hovered ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Link
                    to={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-300"
                    style={{
                      background: active
                        ? 'linear-gradient(145deg, hsl(0 0% 100% / 0.22), hsl(0 0% 100% / 0.10))'
                        : hovered
                          ? 'hsl(0 0% 100% / 0.08)'
                          : 'transparent',
                      boxShadow: active
                        ? 'inset 0 1px 0 hsl(0 0% 100% / 0.15), 0 2px 8px hsl(270 40% 10% / 0.2)'
                        : 'none',
                    }}
                  >
                    <item.icon
                      className="w-5 h-5 transition-all duration-200"
                      style={{
                        color: active
                          ? 'hsl(0 0% 100%)'
                          : hovered
                            ? 'hsl(270 20% 85%)'
                            : 'hsl(270 15% 65%)',
                      }}
                      strokeWidth={active ? 2 : 1.5}
                    />
                  </Link>
                </motion.div>
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
