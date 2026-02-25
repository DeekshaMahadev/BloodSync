import { BloodRequest } from '@/types/blood-donation';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock, CheckCircle, XCircle, Timer } from 'lucide-react';

interface StatusBadgeProps {
  status: BloodRequest['status'];
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  approved: {
    label: 'Approved',
    icon: Timer,
    className: 'bg-info/10 text-info border-info/20',
  },
  fulfilled: {
    label: 'Fulfilled',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-muted text-muted-foreground border-border',
  },
  expired: {
    label: 'Expired',
    icon: AlertCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
