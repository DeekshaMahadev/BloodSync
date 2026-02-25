import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { RequestCard } from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBloodDonation } from "@/contexts/BloodDonationContext";
import { BLOOD_GROUPS } from "@/types/blood-donation";
import { Filter, Clock, MapPin, Droplet, Activity, AlertCircle } from "lucide-react";

const BloodRequestsPage = () => {
  const { requests, isLoading } = useBloodDonation();

  /* ---------------- FILTER STATES ---------------- */
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // 1. Status Check: Match 'pending' status
      const isPending = req.status === "pending";

      // 2. Blood Group Match (Using the property name from your RequestCard: bloodGroup)
      const matchesBloodGroup =
        selectedBloodGroup === "all" ||
        req.bloodGroup === selectedBloodGroup;

      // 3. Urgency Match (Using the property name from your RequestCard: urgency)
      const matchesUrgency =
        selectedUrgency === "all" ||
        req.urgency?.toLowerCase() === selectedUrgency.toLowerCase();

      // 4. City Match (Using the property name from your RequestCard: city)
      const matchesCity =
        selectedCity === "all" ||
        req.city?.toLowerCase() === selectedCity.toLowerCase();

      return isPending && matchesBloodGroup && matchesUrgency && matchesCity;
    });
  }, [requests, selectedBloodGroup, selectedUrgency, selectedCity]);

  /* ---------------- UNIQUE CITY LIST ---------------- */
  const requestCities = useMemo(() => {
    const cities = [
      ...new Set(requests.map((r) => r.city).filter(Boolean))
    ];
    return cities.sort();
  }, [requests]);

  const clearFilters = () => {
    setSelectedBloodGroup("all");
    setSelectedUrgency("all");
    setSelectedCity("all");
  };

  /* ---------------- LOADING STATE ---------------- */
  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Droplet className="h-12 w-12 animate-pulse text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-b from-red-50 to-white py-12 border-b">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
              <AlertCircle className="h-4 w-4" />
              Live Blood Requirements
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
              Active Patient Appeals
            </h1>
            <p className="text-slate-600">
              View all current blood requirements. Your contribution helps save lives in real-time.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5 text-primary" />
                  Filter Search
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-red-500" />
                    Blood Type
                  </label>
                  <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Urgency Level
                  </label>
                  <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    City
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {requestCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Results Area */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                <Activity className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">
                  {filteredRequests.length} active requirements
                </span>
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onRespond={(req) => console.log("Responding to:", req.patientName)}
                  />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed">
                <div className="mb-4 rounded-full bg-slate-50 p-6">
                  <Activity className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-semibold">No active requests</h3>
                <p className="mt-2 text-muted-foreground max-w-sm">
                  Try adjusting your filters to find more blood requests.
                </p>
                <Button className="mt-6" onClick={clearFilters}>
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

export default BloodRequestsPage;