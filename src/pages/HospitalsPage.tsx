import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
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
import { Search, Filter } from "lucide-react";

// 1. Import your external HospitalCard component
import { HospitalCard } from "@/components/HospitalCard"; 

const HospitalsPage = () => {
  const { hospitals, isLoading } = useBloodDonation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        hospital.name?.toLowerCase().includes(search) ||
        hospital.branch?.toLowerCase().includes(search) ||
        hospital.city?.toLowerCase().includes(search);

      const matchesCity =
        selectedCity === "all" ||
        hospital.city?.toLowerCase() === selectedCity.toLowerCase();

      const matchesType =
        selectedType === "all" ||
        hospital.hospital_type === selectedType;

      return matchesSearch && matchesCity && matchesType;
    });
  }, [hospitals, searchTerm, selectedCity, selectedType]);

  const hospitalCities = useMemo(() => {
    const cities = [...new Set(hospitals.map((h) => h.city).filter(Boolean))];
    return cities.sort();
  }, [hospitals]);

  const hospitalTypes = useMemo(() => {
    const types = [...new Set(hospitals.map((h) => h.hospital_type).filter(Boolean))];
    return types;
  }, [hospitals]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("all");
    setSelectedType("all");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground font-medium mt-4">Syncing healthcare network...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-b from-primary/5 to-transparent border-b py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Healthcare Directory
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Find, filter, and connect with registered hospitals and blood banks across the country.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-muted/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9 bg-muted/20"
                        placeholder="Name, branch or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">City</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="bg-muted/20">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {hospitalCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-muted/20">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {hospitalTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full border-dashed" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Found <span className="text-foreground font-bold">{filteredHospitals.length}</span> facilities
              </p>
            </div>

            {filteredHospitals.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {filteredHospitals.map((hospital) => (
                  // 2. Use the imported component here
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed border-2">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold">No hospitals found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search keywords.</p>
                <Button className="mt-6" onClick={clearFilters}>Reset Filters</Button>
              </Card>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default HospitalsPage;