import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface ViewingCounterProps {
  baseCount?: number;
  variation?: number;
}

export default function ViewingCounter({ 
  baseCount = 8, 
  variation = 4 
}: ViewingCounterProps) {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    // Generate initial count with some randomness
    const initialCount = baseCount + Math.floor(Math.random() * variation);
    setCount(initialCount);

    // Update count every 15-30 seconds to simulate real-time changes
    const interval = setInterval(() => {
      const change = Math.random() > 0.5 ? 1 : -1;
      setCount(prev => {
        const newCount = prev + change;
        // Keep within reasonable range
        return Math.max(baseCount - 2, Math.min(baseCount + variation, newCount));
      });
    }, 15000 + Math.random() * 15000);

    return () => clearInterval(interval);
  }, [baseCount, variation]);

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border">
      <Eye className="w-3 h-3" />
      <span className="font-medium">{count} lidí si prohlíží</span>
    </div>
  );
}
