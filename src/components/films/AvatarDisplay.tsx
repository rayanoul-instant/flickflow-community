import avatarDefault from '@/assets/avatar-default.png';
import { cn } from '@/lib/utils';

// Color options for the avatar
export const AVATAR_COLORS = [
  { id: 'purple', value: '#7C3AED', label: 'Purple' },
  { id: 'blue', value: '#2563EB', label: 'Blue' },
  { id: 'green', value: '#16A34A', label: 'Green' },
  { id: 'red', value: '#DC2626', label: 'Red' },
  { id: 'orange', value: '#EA580C', label: 'Orange' },
  { id: 'pink', value: '#DB2777', label: 'Pink' },
  { id: 'teal', value: '#0D9488', label: 'Teal' },
  { id: 'yellow', value: '#CA8A04', label: 'Yellow' },
];

// Accessories rendered as emoji overlays
export const AVATAR_HATS = [
  { id: 'none', label: 'None', emoji: '' },
  { id: 'fedora', label: 'Fedora', emoji: '🎩' },
  { id: 'beret', label: 'Beret', emoji: '🪖' },
  { id: 'crown', label: 'Crown', emoji: '👑' },
  { id: 'cowboy', label: 'Cowboy', emoji: '🤠' },
  { id: 'wizard', label: 'Wizard', emoji: '🧙' },
  { id: 'graduation', label: 'Grad', emoji: '🎓' },
  { id: 'tophat', label: 'Top hat', emoji: '🎩' },
];

export const AVATAR_FACE = [
  { id: 'none', label: 'None', emoji: '' },
  { id: 'mustache', label: 'Mustache', emoji: '👨' },
  { id: 'sunglasses', label: 'Sunglasses', emoji: '🕶️' },
  { id: 'monocle', label: 'Monocle', emoji: '🧐' },
  { id: 'wink', label: 'Wink', emoji: '😉' },
  { id: 'clown', label: 'Clown nose', emoji: '🤡' },
];

export const AVATAR_EXTRAS = [
  { id: 'none', label: 'None', emoji: '' },
  { id: 'bowtie', label: 'Bow Tie', emoji: '🎀' },
  { id: 'scarf', label: 'Scarf', emoji: '🧣' },
  { id: 'medal', label: 'Medal', emoji: '🏅' },
  { id: 'star', label: 'Star', emoji: '⭐' },
];

interface AvatarDisplayProps {
  color?: string;
  hat?: string;
  face?: string;
  extra?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { wrapper: 'w-8 h-8', emoji: 'text-xs' },
  md: { wrapper: 'w-12 h-12', emoji: 'text-sm' },
  lg: { wrapper: 'w-20 h-20', emoji: 'text-lg' },
  xl: { wrapper: 'w-28 h-28', emoji: 'text-2xl' },
};

export function AvatarDisplay({ color = '#7C3AED', hat, face, extra, size = 'md', className }: AvatarDisplayProps) {
  const s = sizeMap[size];
  const hatEmoji = AVATAR_HATS.find(h => h.id === hat)?.emoji || '';
  const faceEmoji = AVATAR_FACE.find(f => f.id === face)?.emoji || '';
  const extraEmoji = AVATAR_EXTRAS.find(e => e.id === extra)?.emoji || '';

  return (
    <div className={cn('relative flex-shrink-0', s.wrapper, className)}>
      {/* Colored avatar image */}
      <div
        className="w-full h-full rounded-full overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <img
          src={avatarDefault}
          alt="Avatar"
          className="w-full h-full object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>
      {/* Accessories */}
      {hatEmoji && (
        <span className={cn('absolute -top-1 left-1/2 -translate-x-1/2', s.emoji)}>
          {hatEmoji}
        </span>
      )}
      {faceEmoji && (
        <span className={cn('absolute top-1/3 left-1/2 -translate-x-1/2', s.emoji)}>
          {faceEmoji}
        </span>
      )}
      {extraEmoji && (
        <span className={cn('absolute bottom-0 right-0', s.emoji)}>
          {extraEmoji}
        </span>
      )}
    </div>
  );
}
