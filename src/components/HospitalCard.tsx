import { Hospital } from "@/types/blood-donation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Building2,
  CheckCircle,
} from "lucide-react";

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Card className="group rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-6 space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold tracking-tight">
                {hospital.name}
              </h3>
              {hospital.isVerified && (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {hospital.hospital_type && (
                <Badge variant="outline" className="rounded-full text-xs">
                  {hospital.hospital_type}
                </Badge>
              )}
              {hospital.branch && (
                <Badge variant="secondary" className="rounded-full text-xs">
                  {hospital.branch}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* ================= LOCATION ================= */}
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5" />
          <div>
            {hospital.address}, {hospital.city}
            {hospital.pincode && (
              <span className="block text-xs opacity-70">
                Pincode: {hospital.pincode}
              </span>
            )}
          </div>
        </div>

        {/* ================= CONTACT SECTION ================= */}
        <div className="grid gap-4 md:grid-cols-2">

          {/* Hospital Contact Box */}
          <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Building2 className="h-4 w-4" />
              Hospital Contact
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>{hospital.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span>{hospital.email}</span>
              </div>
            </div>
          </div>

          {/* Contact Person Box */}
          {hospital.contact_person_name && (
            <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center gap-2 font-medium text-sm">
                <User className="h-4 w-4" />
                Contact Person
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div>{hospital.contact_person_name}</div>
                {hospital.contact_person_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{hospital.contact_person_phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* ================= ACTIONS ================= */}
      <CardFooter className="border-t bg-muted/20 px-6 py-4">
        <div className="flex w-full flex-wrap gap-3">

          {/* Primary Website CTA */}
          {hospital.website_url && (
            <Button
              className="flex-1 rounded-xl"
              onClick={() => window.open(hospital.website_url!, "_blank")}
            >
              <Globe className="mr-2 h-4 w-4" />
              Visit Website
            </Button>
          )}
           {/* Primary Map Route CTA */}
          {hospital.map_route_url && (
            <Button
              className="flex-1 rounded-xl"
              onClick={() => window.open(hospital.map_route_url!, "_blank")}
            >
              <Globe className="mr-2 h-4 w-4" />
              Visit Map Route
            </Button>
          )}

          {/* Secondary Actions */}
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => window.location.href = `tel:${hospital.phone}`}
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Hospital
          </Button>

          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => window.location.href = `mailto:${hospital.email}`}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>

          {hospital.contact_person_phone && (
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() =>
                window.location.href = `tel:${hospital.contact_person_phone}`
              }
            >
              <User className="mr-2 h-4 w-4" />
              Call Contact Person
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}