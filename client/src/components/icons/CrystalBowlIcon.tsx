interface CrystalBowlIconProps {
  className?: string;
  size?: number;
}

export default function CrystalBowlIcon({ className = "", size = 24 }: CrystalBowlIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Singing bowl body */}
      <path
        d="M4 10C4 10 5 14 12 14C19 14 20 10 20 10C20 10 19 8 12 8C5 8 4 10 4 10Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M5 10C5 10 6 13 12 13C18 13 19 10 19 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Bowl rim */}
      <ellipse
        cx="12"
        cy="9"
        rx="8"
        ry="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Sound waves */}
      <path
        d="M2 6C2 6 3 5 4 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M22 6C22 6 21 5 20 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M1 9C1 9 2 8 3 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M23 9C23 9 22 8 21 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      
      {/* Striker/mallet */}
      <line
        x1="16"
        y1="3"
        x2="18"
        y2="1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="18.5"
        cy="0.5"
        r="1"
        fill="currentColor"
      />
      
      {/* Base stand */}
      <path
        d="M10 14V15C10 15 10 16 12 16C14 16 14 15 14 15V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
