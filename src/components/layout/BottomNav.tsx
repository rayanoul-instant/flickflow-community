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
      <nav className="pointer-events-auto relative mb-5 mx-4">
        <div
          className="flex items-center gap-2 rounded-[28px] px-3 py-2.5 relative"
          style={{
            background: 'linear-gradient(145deg, hsl(270 20% 50% / 0.35), hsl(265 30% 40% / 0.25))',
            backdropFilter: 'blur(24px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
            boxShadow: '0 8px 32px hsl(270 40% 10% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.08), inset 0 -1px 0 hsl(270 30% 20% / 0.3)',
            border: '1px solid hsl(0 0% 100% / 0.12)',
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className="relative w-16 h-14 rounded-[20px] flex items-center justify-center transition-all duration-300"
                style={{
                  background: active
                    ? 'linear-gradient(145deg, hsl(0 0% 100% / 0.22), hsl(0 0% 100% / 0.10))'
                    : 'transparent',
                  boxShadow: active
                    ? 'inset 0 1px 0 hsl(0 0% 100% / 0.15), 0 2px 8px hsl(270 40% 10% / 0.2)'
                    : 'none',
                }}
              >
                <item.icon
                  className="w-6 h-6 transition-all duration-200"
                  style={{
                    color: active
                      ? 'hsl(0 0% 100%)'
                      : 'hsl(270 15% 70%)',
                  }}
                  strokeWidth={active ? 2 : 1.5}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
