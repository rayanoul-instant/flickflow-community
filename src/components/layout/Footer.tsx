import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import logoInstant from '@/assets/logo-instant.png';

export function Footer() {
  return (
    <footer className="bg-cinema-darker border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoInstant} alt="Instant" className="h-8" />
            </Link>
            <p className="text-muted-foreground max-w-md">
              Discover, watch and share the best royalty-free short films. 
              A community passionate about short cinema.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/search" className="hover:text-primary transition-colors">Films</Link></li>
              <li><Link to="/discussions" className="hover:text-primary transition-colors">Discussions</Link></li>
              <li><Link to="/search?sortBy=popular" className="hover:text-primary transition-colors">Popular</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><span className="cursor-pointer hover:text-primary transition-colors">Terms of use</span></li>
              <li><span className="cursor-pointer hover:text-primary transition-colors">Privacy</span></li>
              <li><span className="cursor-pointer hover:text-primary transition-colors">Licenses</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 Instant. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> for film lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
