import { motion, AnimatePresence } from 'framer-motion';
import logoInstant from '@/assets/logo-instant.png';

interface SplashScreenProps {
  show: boolean;
}

export function SplashScreen({ show }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Glow background */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(270 70% 55% / 0.3) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.8, 0] }}
            transition={{ duration: 2, times: [0, 0.5, 1], ease: 'easeOut' }}
          />

          {/* Logo */}
          <motion.img
            src={logoInstant}
            alt="Instant"
            className="h-28 md:h-40 object-contain relative z-10"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{
              scale: [0.3, 1.1, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.6, 1],
              ease: 'easeOut',
            }}
          />

          {/* Subtitle */}
          <motion.p
            className="absolute bottom-[38%] text-muted-foreground text-sm font-medium tracking-widest uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -5] }}
            transition={{ duration: 2, times: [0, 0.4, 0.7, 1], delay: 0.6 }}
          >
            Short Films
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
