import { Heart } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function Logo({ size = 'md', showIcon = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const heartSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const iconHeartSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-2">
      {showIcon && (
        <div className={`${iconSizes[size]} bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg`}>
          <Heart className={`${iconHeartSizes[size]} text-white fill-white`} />
        </div>
      )}
      <span className={`${sizeClasses[size]} font-serif text-gray-800 flex items-center`}>
        <span>L</span>
        <Heart className={`${heartSizes[size]} text-rose-500 fill-rose-500 mx-0.5 -mt-1`} />
        <span>vify</span>
      </span>
    </div>
  );
}
