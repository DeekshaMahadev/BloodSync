import { BloodRequest } from '@/types/blood-donation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BloodGroupBadge } from '@/components/blood/BloodGroupBadge';
import { StatusBadge } from '@/components/blood/StatusBadge';
import { UrgencyBadge } from '@/components/blood/UrgencyBadge';
import { MapPin, Phone, Calendar, Building2, Droplets } from 'lucide-react';
import { format } from 'date-fns';

interface RequestCardProps {
  request: BloodRequest;
  onRespond?: (request: BloodRequest) => void;
  onViewDetails?: (request: BloodRequest) => void;
  showActions?: boolean;
}

export function RequestCard({ request, onRespond, onViewDetails, showActions = true }: RequestCardProps) {
  const requiredBy = format(new Date(request.requiredByDate), 'MMM dd, yyyy');

  return (
    <Card className="group transition-all hover:shadow-card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{request.patientName}</h3>
              <UrgencyBadge urgency={request.urgency} />
            </div>
            <p className="text-sm text-muted-foreground">{request.reason}</p>
          </div>
          <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{request.hospitalName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{request.city}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplets className="h-4 w-4" />
            <span>{request.unitsRequired} unit(s) required</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Required by: {requiredBy}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <StatusBadge status={request.status} />
        </div>
      </CardContent>

      {showActions && request.status === 'pending' && (
        <CardFooter className="border-t bg-muted/30 px-5 py-3">
          <div className="flex w-full gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.location.href = `tel:${request.contactPhone}`}
            >
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              Call
            </Button>
            
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
