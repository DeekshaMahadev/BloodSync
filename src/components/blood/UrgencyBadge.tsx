import { BloodRequest } from '@/types/blood-donation';
import { cn } from '@/lib/utils';
import { AlertTriangle, Zap, Clock } from 'lucide-react';

interface UrgencyBadgeProps {
  // Use 'any' or string here to prevent strict type errors if DB keys vary
  urgency: any; 
  className?: string;
}

const urgencyConfig = {
  normal: {
    label: 'Normal',
    icon: Clock,
    className: 'bg-muted text-muted-foreground',
  },
  urgent: {
    label: 'Urgent',
    icon: AlertTriangle,
    className: 'bg-warning text-warning-foreground',
  },
  critical: {
    label: 'Critical',
    icon: Zap,
    className: 'bg-destructive text-destructive-foreground animate-pulse-soft',
  },
};

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  // 🔹 FIX: Fallback to 'normal' if the value is undefined or doesn't match keys
  const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.normal;
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}