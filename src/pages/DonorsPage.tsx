import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DonorCard } from "@/components/donors/DonorCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBloodDonation } from "@/contexts/BloodDonationContext";
import { BLOOD_GROUPS } from "@/types/blood-donation";
import { Filter, Users, MapPin, Droplet, Sparkles } from "lucide-react";

/* ---------------- BLOOD COMPATIBILITY MAP ---------------- */

const BLOOD_COMPATIBILITY: Record<string, string[]> = {
  "O-": ["O-"],
  "O+": ["O+", "O-"],
  "A-": ["A-", "O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

const DonorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { donors, isLoading } = useBloodDonation();

  /* ---------------- FILTER STATES ---------------- */

  const [requiredBloodGroup, setRequiredBloodGroup] = useState<string>(
    searchParams.get("bloodGroup") || "all"
  );
  const [matchingType, setMatchingType] = useState<string>("compatible");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<string>("available");

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredDonors = useMemo(() => {
    return donors
      .filter((donor) => {
        const matchesCity =
          selectedCity === "all" ||
          donor.city?.toLowerCase() === selectedCity.toLowerCase();

        const matchesAvailability =
          availabilityFilter === "all" ||
          (availabilityFilter === "available" && donor.isAvailable) ||
          (availabilityFilter === "unavailable" && !donor.isAvailable);

        let matchesBloodGroup = true;

        if (requiredBloodGroup !== "all") {
          if (matchingType === "exact") {
            matchesBloodGroup =
              donor.bloodGroup === requiredBloodGroup;
          } else if (matchingType === "compatible") {
            matchesBloodGroup =
              BLOOD_COMPATIBILITY[requiredBloodGroup]?.includes(
                donor.bloodGroup
              );
          } else if (matchingType === "universal") {
            matchesBloodGroup = donor.bloodGroup === "O-";
          }
        }

        return matchesCity && matchesAvailability && matchesBloodGroup;
      })
      .sort((a, b) => {
        if (a.isAvailable && !b.isAvailable) return -1;
        if (!a.isAvailable && b.isAvailable) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [
    donors,
    requiredBloodGroup,
    matchingType,
    selectedCity,
    availabilityFilter,
  ]);

  /* ---------------- UNIQUE CITY LIST ---------------- */

  const donorCities = useMemo(() => {
    const cities = [...new Set(donors.map((d) => d.city).filter(Boolean))];
    return cities.sort();
  }, [donors]);

  const clearFilters = () => {
    setRequiredBloodGroup("all");
    setMatchingType("compatible");
    setSelectedCity("all");
    setAvailabilityFilter("available");
    setSearchParams({});
  };

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Droplet className="h-12 w-12 animate-pulse text-primary" />
        </div>
      </Layout>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <section className="bg-gradient-hero py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">
            Smart Blood Donor Finder
          </h1>
          <p className="text-muted-foreground">
            Select patient blood requirement to find best matching donors
          </p>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">

          {/* Sidebar */}
          <aside>
            <Card className="sticky top-20 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Donor Selection Filters
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                {/* Required Blood Group */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Droplet className="h-4 w-4" />
                    Patient Needs Blood Group
                  </label>

                  <Select
                    value={requiredBloodGroup}
                    onValueChange={setRequiredBloodGroup}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select required blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Any Blood Group
                      </SelectItem>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Matching Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Matching Preference
                  </label>

                  <Select
                    value={matchingType}
                    onValueChange={setMatchingType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select matching type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compatible">
                        Compatible Donors (Recommended)
                      </SelectItem>
                      <SelectItem value="exact">
                        Exact Blood Group Match
                      </SelectItem>
                      <SelectItem value="universal">
                        Universal Donor Only (O-)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Select City
                  </label>

                  <Select
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose city location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All Cities
                      </SelectItem>
                      {donorCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Donor Availability
                  </label>

                  <Select
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">
                        Available Donors Only
                      </SelectItem>
                      <SelectItem value="unavailable">
                        Currently Unavailable
                      </SelectItem>
                      <SelectItem value="all">
                        Show All Donors
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Reset All Filters
                </Button>

              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>
                  Found <strong>{filteredDonors.length}</strong> matching donors
                </span>
              </div>
            </div>

            {filteredDonors.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredDonors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Users className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Matching Donors Found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your selection filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default DonorsPage;