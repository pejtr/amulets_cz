/**
 * Italy Flag Icon - SVG komponenta
 * Malá ikona italské vlajky pro cross-linking
 */

interface ItalyFlagProps {
  className?: string;
  size?: number;
}

export default function ItalyFlag({ className = "", size = 20 }: ItalyFlagProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Italská vlajka"
    >
      {/* Green stripe */}
      <rect x="2" y="4" width="6.67" height="16" fill="#009246" rx="1" />
      
      {/* White stripe */}
      <rect x="8.67" y="4" width="6.67" height="16" fill="#FFFFFF" />
      
      {/* Red stripe */}
      <rect x="15.33" y="4" width="6.67" height="16" fill="#CE2B37" rx="1" />
      
      {/* Border */}
      <rect 
        x="2" 
        y="4" 
        width="20" 
        height="16" 
        rx="1" 
        stroke="#000000" 
        strokeWidth="0.5" 
        strokeOpacity="0.1"
        fill="none"
      />
    </svg>
  );
}
