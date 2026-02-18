import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search as SearchIcon, MessageCircle, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import logoInstant from '@/assets/logo-instant.png';

export function Navbar({ showLogo = true }: { showLogo?: boolean }) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: SearchIcon },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    { href: '/account', label: 'Account', icon: User },
  ];

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

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <link.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            ))}
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
