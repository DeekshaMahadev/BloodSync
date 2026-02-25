import { Donor } from '@/types/blood-donation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BloodGroupBadge } from '@/components/blood/BloodGroupBadge';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DonorCardProps {
  donor: Donor;
  onContact?: (donor: Donor) => void;
  showActions?: boolean;
}

export function DonorCard({ donor, onContact, showActions = true }: DonorCardProps) {
  const lastDonation = donor.lastDonationDate 
    ? format(new Date(donor.lastDonationDate), 'MMM dd, yyyy')
    : 'Never donated';

  return (
    <Card className="group transition-all hover:shadow-card-hover">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Donor Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{donor.name}</h3>
              {donor.isVerified && (
                <CheckCircle className="h-4 w-4 text-success" />
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />
              <Badge variant={donor.isAvailable ? "default" : "secondary"} className="text-xs">
                {donor.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
              <span className="text-xs text-muted-foreground">Age: {donor.age}</span>
            </div>

            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{donor.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Last donation: {lastDonation}</span>
              </div>
            </div>
          </div>

          {/* Blood Group Large */}
          <BloodGroupBadge bloodGroup={donor.bloodGroup} size="lg" variant="outline" />
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="border-t bg-muted/30 px-5 py-3">
          <div className="flex w-full items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.location.href = `tel:${donor.phone}`}
            >
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              Call
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = `mailto:${donor.email}`}
            >
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              Email
            </Button>
            {onContact && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onContact(donor)}
              >
                Contact
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
