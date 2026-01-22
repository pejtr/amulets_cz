import React from 'react';
import { usePremiumButtonVariant } from '@/contexts/ABTestContext';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Lock, Gem } from 'lucide-react';

interface PremiumButtonProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

// Icon mapping
const ICON_MAP: Record<string, React.ReactNode> = {
  '👑': <Crown className="w-5 h-5" />,
  '✨': <Sparkles className="w-5 h-5" />,
  '🔓': <Lock className="w-5 h-5" />,
  '💎': <Gem className="w-5 h-5" />,
};

export default function PremiumButton({ 
  onClick, 
  className = '', 
  size = 'md',
  showSubtext = true 
}: PremiumButtonProps) {
  const { props, trackPremiumClick } = usePremiumButtonVariant();

  const handleClick = () => {
    trackPremiumClick();
    onClick?.();
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative overflow-hidden rounded-xl font-semibold
        bg-gradient-to-r ${props.bgColor} ${props.textColor}
        hover:shadow-lg hover:scale-105 transition-all duration-300
        flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Shine effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Icon */}
      <span className="relative z-10">
        {ICON_MAP[props.icon] || props.icon}
      </span>
      
      {/* Text */}
      <span className="relative z-10 flex flex-col items-start">
        <span>{props.text}</span>
        {showSubtext && props.subtext && (
          <span className="text-xs opacity-80 font-normal">{props.subtext}</span>
        )}
      </span>
    </button>
  );
}

// Floating Premium CTA component
export function FloatingPremiumCTA({ onClose }: { onClose?: () => void }) {
  const { props, trackPremiumClick } = usePremiumButtonVariant();

  const handleClick = () => {
    trackPremiumClick();
    // Navigate to premium page or open modal
    window.location.href = '/premium';
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 animate-bounce-slow">
      <div className="relative">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center hover:bg-gray-700 z-10"
          >
            ×
          </button>
        )}
        
        {/* Main CTA */}
        <button
          onClick={handleClick}
          className={`
            relative overflow-hidden rounded-2xl font-semibold
            bg-gradient-to-r ${props.bgColor} ${props.textColor}
            shadow-2xl hover:shadow-3xl transition-all duration-300
            px-6 py-4 flex items-center gap-3
          `}
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-white" />
          
          {/* Icon */}
          <span className="text-2xl">{props.icon}</span>
          
          {/* Text */}
          <span className="flex flex-col items-start">
            <span className="text-lg">{props.text}</span>
            <span className="text-xs opacity-80">{props.subtext}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

// Premium badge for header/navigation
export function PremiumBadge({ onClick }: { onClick?: () => void }) {
  const { props, trackPremiumClick } = usePremiumButtonVariant();

  const handleClick = () => {
    trackPremiumClick();
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        bg-gradient-to-r ${props.bgColor} ${props.textColor}
        text-sm font-medium hover:shadow-md transition-all duration-300
      `}
    >
      <span>{props.icon}</span>
      <span>PREMIUM</span>
    </button>
  );
}
