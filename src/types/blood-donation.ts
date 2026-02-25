// Blood group types
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// User roles
export type UserRole = 'donor' | 'patient' | 'hospital' | 'admin';

// Donor interface
export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  age: number;
  city: string;
  address: string;
  lastDonationDate: string | null;
  isAvailable: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blood request status
export type RequestStatus = 'pending' | 'approved' | 'fulfilled' | 'cancelled' | 'expired';

export type RequestUrgency = 'normal' | 'urgent' | 'critical';

// Blood request interface
export interface BloodRequest {
  id: string;
  patientName: string;
  contactPhone: string;
  contactEmail: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  urgency: RequestUrgency;
  reason: string;
  status: RequestStatus;
  requiredByDate: string;
  createdAt: string;
  updatedAt: string;
  fulfilledBy?: string; // donor id
}

// Hospital/Blood Bank interface
export interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch?: string;
hospital_type?: string;
contact_person_name?: string;
contact_person_phone?: string;
license_number?: string;
pincode?: string;
website_url?: string | null;
map_route_url?: string | null;
  address: string;
  city: string;
  isVerified: boolean;
  bloodStock: BloodStock[];
  createdAt: string;
}

// Blood stock per hospital
export interface BloodStock {
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  lastUpdated: string;
}

// User session (simplified for localStorage)
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

// Dashboard stats
export interface DashboardStats {
  totalDonors: number;
  availableDonors: number;
  totalRequests: number;
  pendingRequests: number;
  fulfilledRequests: number;
  criticalRequests: number;
}

// Blood compatibility chart
export const BLOOD_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

// Can receive from
export const CAN_RECEIVE_FROM: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

// Cities for the system
export const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Bhopal', 'Indore', 'Nagpur', 'Patna'
];
