import { BloodGroup } from '@/types/blood-donation';
import { cn } from '@/lib/utils';

interface BloodGroupBadgeProps {
  bloodGroup: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  className?: string;
}

export function BloodGroupBadge({ 
  bloodGroup, 
  size = 'md', 
  variant = 'default',
  className 
}: BloodGroupBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 w-8 text-xs',
    md: 'h-8 w-10 text-sm',
    lg: 'h-10 w-14 text-base',
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border-2 border-primary text-primary bg-transparent',
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center rounded-md font-bold",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {bloodGroup}
    </span>
  );
}
