import { Link } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-cinema-darker border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-gradient-gold">
                CinéCourt
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Découvrez, visionnez et partagez les meilleurs courts métrages libres de droits. 
              Une communauté passionnée par le cinéma court.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Explorer</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/films" className="hover:text-primary transition-colors">Films</Link></li>
              <li><Link to="/discussions" className="hover:text-primary transition-colors">Discussions</Link></li>
              <li><Link to="/films?sortBy=popular" className="hover:text-primary transition-colors">Populaires</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><span className="cursor-pointer hover:text-primary transition-colors">Conditions d'utilisation</span></li>
              <li><span className="cursor-pointer hover:text-primary transition-colors">Confidentialité</span></li>
              <li><span className="cursor-pointer hover:text-primary transition-colors">Licences</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 CinéCourt. Tous droits réservés.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Fait avec <Heart className="w-4 h-4 text-accent fill-accent" /> pour les cinéphiles
          </p>
        </div>
      </div>
    </footer>
  );
}
