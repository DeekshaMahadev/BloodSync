import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  Donor,
  BloodRequest,
  Hospital,
  User,
  DashboardStats,
} from "@/types/blood-donation";

/* ================= CONTEXT TYPE ================= */

interface BloodDonationContextType {
  donors: Donor[];
  requests: BloodRequest[];
  hospitals: Hospital[];
  currentUser: User | null;
  isLoading: boolean;

  refreshDonors: () => Promise<void>;
  refreshRequests: () => Promise<void>;
  refreshHospitals: () => Promise<void>;

  verifyDonor: (id: string) => Promise<void>;
  deleteDonor: (id: string) => Promise<void>;

  verifyHospital: (id: string) => Promise<void>;
  deleteHospital: (id: string) => Promise<void>;

  updateRequestStatus: (
    id: string,
    status: BloodRequest["status"]
  ) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;

  getStats: () => DashboardStats;
}

const BloodDonationContext = createContext<
  BloodDonationContextType | undefined
>(undefined);

/* ================= PROVIDER ================= */

export function BloodDonationProvider({ children }: { children: ReactNode }) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [currentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ================= FETCH DONORS ================= */

  const fetchDonors = async () => {
    const { data, error } = await supabase
      .from("donors")
      .select(`
        id,
        blood_group,
        location,
        availability,
        last_donation_date,
        is_verified,
        profiles (
          name,
          phone
        )
      `);

    if (error) {
      console.error("Supabase donor error:", error);
      return;
    }

    const formatted: Donor[] =
      data?.map((d: any) => ({
        id: d.id,
        name: d.profiles?.name || "Unknown",
        email: "",
        phone: d.profiles?.phone || "",
        bloodGroup: d.blood_group,
        city: d.location,
        isAvailable: d.availability,
        lastDonationDate: d.last_donation_date,
        isVerified: d.is_verified ?? false,
        createdAt: "",
        updatedAt: "",
      })) || [];

    setDonors(formatted);
  };

  /* ================= FETCH REQUESTS ================= */

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase request error:", error);
      return;
    }

    const formatted: BloodRequest[] =
      data?.map((r: any) => ({
        id: r.id,
        patientName: r.patient_name,
        contactPhone: r.contact_phone,
        contactEmail: r.contact_email,
        bloodGroup: r.blood_group,
        unitsRequired: r.units_required,
        hospitalName: r.hospital_name,
        hospitalAddress: r.hospital_address,
        city: r.city,
        urgency: r.urgency_level,
        reason: r.reason,
        requiredByDate: r.required_by_date,
        status: r.status,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })) || [];

    setRequests(formatted);
  };

  /* ================= FETCH HOSPITALS (UPDATED) ================= */

  const fetchHospitals = async () => {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase hospital error:", error);
      return;
    }

    const formatted: Hospital[] =
      data?.map((h: any) => ({
        id: h.id,
        name: h.name,
        branch: h.branch,
        email: h.email,
        phone: h.phone,
        city: h.city,
        address: h.address,
        hospital_type: h.hospital_type,
        contact_person_name: h.contact_person_name,
        contact_person_phone: h.contact_person_phone,
        license_number: h.license_number,
        pincode: h.pincode,
        website_url: h.website_url || null, // optional
        map_route_url: h.map_route_url || null, // optional
        isVerified: h.is_verified ?? false,
        createdAt: h.created_at,
        updatedAt: h.updated_at,
      })) || [];

    setHospitals(formatted);
  };

  /* ================= VERIFY DONOR ================= */

  const verifyDonor = async (id: string) => {
    const { error } = await supabase
      .from("donors")
      .update({ is_verified: true })
      .eq("id", id);

    if (!error) await fetchDonors();
  };

  /* ================= DELETE DONOR ================= */

  const deleteDonor = async (id: string) => {
    const { error } = await supabase
      .from("donors")
      .delete()
      .eq("id", id);

    if (!error) await fetchDonors();
  };

  /* ================= VERIFY HOSPITAL ================= */

  const verifyHospital = async (id: string) => {
    const { error } = await supabase
      .from("hospitals")
      .update({ is_verified: true })
      .eq("id", id);

    if (!error) await fetchHospitals();
  };

  /* ================= DELETE HOSPITAL ================= */

  const deleteHospital = async (id: string) => {
    const { error } = await supabase
      .from("hospitals")
      .delete()
      .eq("id", id);

    if (!error) await fetchHospitals();
  };

  /* ================= UPDATE REQUEST ================= */

  const updateRequestStatus = async (
    id: string,
    status: BloodRequest["status"]
  ) => {
    const { error } = await supabase
      .from("blood_requests")
      .update({ status })
      .eq("id", id);

    if (!error) await fetchRequests();
  };

  /* ================= DELETE REQUEST ================= */

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from("blood_requests")
      .delete()
      .eq("id", id);

    if (!error) await fetchRequests();
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await fetchDonors();
      await fetchRequests();
      await fetchHospitals();
      setIsLoading(false);
    };

    loadAll();
  }, []);

  /* ================= DASHBOARD STATS ================= */

  const getStats = (): DashboardStats => {
    return {
      totalDonors: donors.length,
      availableDonors: donors.filter((d) => d.isAvailable).length,
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === "pending").length,
      fulfilledRequests: requests.filter((r) => r.status === "fulfilled")
        .length,
      criticalRequests: requests.filter(
        (r) => r.urgency === "critical" && r.status === "pending"
      ).length,
    };
  };

  return (
    <BloodDonationContext.Provider
      value={{
        donors,
        requests,
        hospitals,
        currentUser,
        isLoading,
        refreshDonors: fetchDonors,
        refreshRequests: fetchRequests,
        refreshHospitals: fetchHospitals,
        verifyDonor,
        deleteDonor,
        verifyHospital,
        deleteHospital,
        updateRequestStatus,
        deleteRequest,
        getStats,
      }}
    >
      {children}
    </BloodDonationContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useBloodDonation() {
  const context = useContext(BloodDonationContext);
  if (!context) {
    throw new Error(
      "useBloodDonation must be used within BloodDonationProvider"
    );
  }
  return context;
}