import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BloodGroupBadge } from '@/components/blood/BloodGroupBadge';
import { StatusBadge } from '@/components/blood/StatusBadge';
import { UrgencyBadge } from '@/components/blood/UrgencyBadge';
import { useBloodDonation } from '@/contexts/BloodDonationContext';
import { BloodRequest } from '@/types/blood-donation';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Droplet,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  HeartPulse,
  LogOut,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';

const AdminPage = () => {
  const navigate = useNavigate();
  const {
    donors,
    requests,
    getStats,
    verifyDonor,
    deleteDonor,
    updateRequestStatus,
    deleteRequest,
    isLoading
  } = useBloodDonation();

  const { toast } = useToast();
  const stats = getStats();

  const [donorSearch, setDonorSearch] = useState('');
  const [requestFilter, setRequestFilter] = useState<string>('all');

  // 🔹 Hospital States
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [hospitalCity, setHospitalCity] = useState('');
  const [hospitalBranch, setHospitalBranch] = useState('');
  const [hospitalPhone, setHospitalPhone] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [hospitalType, setHospitalType] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactPersonPhone, setContactPersonPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [mapRouteUrl, setMapRouteUrl] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    const { data } = await supabase.from('hospitals').select('*').order('created_at', { ascending: false });
    if (data) setHospitals(data);
  };

const handleAddHospital = async () => {
  if (!hospitalName || !hospitalEmail || !hospitalCity || !hospitalPhone || !hospitalAddress || !hospitalBranch || !licenseNumber || !licenseNumber || !hospitalType || !contactPersonName || !contactPersonPhone ) {
    toast({ title: 'All fields required', variant: 'destructive' });
    return;
  }

  // 1️⃣ Create auth user
  const { data, error: authError } = await supabase.auth.signUp({
    email: hospitalEmail,
    password: "Hospital@123",
  });

  if (authError) {
    toast({
      title: 'Auth Error',
      description: authError.message,
      variant: 'destructive'
    });
    return;
  }

  if (!data.user) {
    toast({
      title: 'User creation failed',
      description: 'Auth user not returned.',
      variant: 'destructive'
    });
    return;
  }

  const authUserId = data.user.id;

  // 2️⃣ Insert hospital
  const { error } = await supabase.from('hospitals').insert([
    {
      name: hospitalName,
      email: hospitalEmail,
      city: hospitalCity,
      branch: hospitalBranch,
      phone: hospitalPhone,
      address: hospitalAddress,
      license_number: licenseNumber,
      pincode: pincode,
      hospital_type: hospitalType,
      contact_person_name: contactPersonName,
      contact_person_phone: contactPersonPhone,
      website_url: websiteUrl || null,
      map_route_url: mapRouteUrl || null,
      auth_user_id: data.user.id,
    }
  ]);
   console.log(authUserId); 
   
  if (error) {
    toast({
      title: 'Database Error',
      description: error.message,
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'Hospital Registered Successfully',
      description: 'Default password: Hospital@123'
    });

    fetchHospitals();
  }
};

  const handleDeleteHospital = async (id: string) => {
    await supabase.from('hospitals').delete().eq('id', id);
    toast({ title: 'Hospital Deleted', variant: 'destructive' });
    fetchHospitals();
  };

  

  // ✅ Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-login', { replace: true });
  };
  

  // Filter donors
  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
    donor.email.toLowerCase().includes(donorSearch.toLowerCase()) ||
    donor.bloodGroup.includes(donorSearch.toUpperCase())
  );

  // Filter requests
  const filteredRequests = requests.filter(request =>
    requestFilter === 'all' || request.status === requestFilter
  );

  const handleVerifyDonor = (id: string) => {
    verifyDonor(id);
    toast({
      title: 'Donor Verified',
      description: 'The donor has been verified successfully.',
    });
  };

  const handleDeleteDonor = (id: string) => {
    deleteDonor(id);
    toast({
      title: 'Donor Deleted',
      description: 'The donor has been removed from the system.',
      variant: 'destructive',
    });
  };

  const handleUpdateRequestStatus = (id: string, status: BloodRequest['status']) => {
    updateRequestStatus(id, status);
    toast({
      title: 'Request Updated',
      description: `Request status changed to ${status}.`,
    });
  };

  const handleDeleteRequest = (id: string) => {
    deleteRequest(id);
    toast({
      title: 'Request Deleted',
      description: 'The blood request has been removed.',
      variant: 'destructive',
    });
  };

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
      {/* Header */}
      <section className="bg-gradient-hero py-8">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage donors, requests, and system data
            </p>
          </div>

          {/* ✅ Logout Button */}
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </section>

      <div className="container py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Donors"
            value={stats.totalDonors}
            description={`${stats.availableDonors} available`}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Pending Requests"
            value={stats.pendingRequests}
            description="Awaiting action"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Fulfilled"
            value={stats.fulfilledRequests}
            description="Successfully completed"
            icon={HeartPulse}
            variant="success"
          />
          <StatsCard
            title="Critical"
            value={stats.criticalRequests}
            description="Need urgent attention"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="donors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="donors">
              <Users className="mr-2 h-4 w-4" />
              Donors
            </TabsTrigger>
            <TabsTrigger value="requests">
              <Droplet className="mr-2 h-4 w-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="hospitals">
              <Building2 className="mr-2 h-4 w-4" />
              Hospitals
            </TabsTrigger>
          </TabsList>

          {/* Donors Tab */}
          <TabsContent value="donors">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Manage Donors</CardTitle>
                    <CardDescription>
                      View, verify, and manage registered donors
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search donors..."
                      value={donorSearch}
                      onChange={(e) => setDonorSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonors.map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell>
                            <p className="font-medium">{donor.name}</p>
                            <p className="text-sm text-muted-foreground">{donor.email}</p>
                          </TableCell>
                          <TableCell>
                            <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />
                          </TableCell>
                          <TableCell>{donor.city}</TableCell>
                          <TableCell>
                            <Badge variant={donor.isAvailable ? "default" : "secondary"}>
                              {donor.isAvailable ? 'Available' : 'Unavailable'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {donor.isVerified ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {!donor.isVerified && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyDonor(donor.id)}
                              >
                                <ShieldCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteDonor(donor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredDonors.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    No donors found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab remains same as yours */}
          {/* (No logic changes needed here) */}
          {/* Requests Tab */}
<TabsContent value="requests">
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Manage Blood Requests</CardTitle>
          <CardDescription>
            View and update blood requests
          </CardDescription>
        </div>

        <Select
          value={requestFilter}
          onValueChange={(value) => setRequestFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardHeader>

    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.patientName}</TableCell>
              <TableCell>
                <BloodGroupBadge bloodGroup={request.bloodGroup} size="sm" />
              </TableCell>
              <TableCell>{request.hospitalName}</TableCell>
              <TableCell>
                <UrgencyBadge urgency={request.urgency} />
              </TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell>
                {format(new Date(request.createdAt), 'dd MMM yyyy')}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleUpdateRequestStatus(request.id, 'approved')
                  }
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteRequest(request.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredRequests.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No requests found
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>
<TabsContent value="hospitals">
  <Card>
    <CardHeader>
      <CardTitle>Register New Hospital</CardTitle>
      <CardDescription>
        Add hospitals that can create blood requests
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">
      <Input
        placeholder="Hospital Name"
        value={hospitalName}
        onChange={(e) => setHospitalName(e.target.value)}
      />
      <Select
  value={hospitalType}
  onValueChange={(value) => setHospitalType(value)}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Hospital Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Government">Government</SelectItem>
    <SelectItem value="Private">Private</SelectItem>
    <SelectItem value="Blood Bank">Blood Bank</SelectItem>
    <SelectItem value="Clinic">Clinic</SelectItem>
  </SelectContent>
</Select>
      <Input
  placeholder="License / Registration Number"
  value={licenseNumber}
  onChange={(e) => setLicenseNumber(e.target.value)}
/>
<Input
         placeholder="Hospital Branch"
         value={hospitalBranch}
         onChange={(e) => setHospitalBranch(e.target.value)}
        />
      <Input
        placeholder="Hospital Email"
        type="email"
        value={hospitalEmail}
        onChange={(e) => setHospitalEmail(e.target.value)}
      />

      <Input
        placeholder="Hospital Phone Number"
        value={hospitalPhone}
        onChange={(e) => setHospitalPhone(e.target.value)}
      />
      <Input
  type="url"
  placeholder="Hospital Website (Optional)"
  value={websiteUrl}
  onChange={(e) => setWebsiteUrl(e.target.value)}
/>
<Input
  type="url"
  placeholder="Hospital Map Route (Optional)"
  value={mapRouteUrl}
  onChange={(e) => setMapRouteUrl(e.target.value)}
/>
      <Input
  placeholder="Contact Person Name"
  value={contactPersonName}
  onChange={(e) => setContactPersonName(e.target.value)}
/>
<Input
  placeholder="Contact Person Phone Number"
  value={contactPersonPhone}
  onChange={(e) => setContactPersonPhone(e.target.value)}
/>
 <Input
        placeholder="Address"
        value={hospitalAddress}
        onChange={(e) => setHospitalAddress(e.target.value)}
      />
      <Input
        placeholder="City"
        value={hospitalCity}
        onChange={(e) => setHospitalCity(e.target.value)}
      />
       
        <Input
  placeholder="Pincode / Zip Code"
  value={pincode}
  onChange={(e) => setPincode(e.target.value)}
/>

     

      <Button onClick={handleAddHospital}>
        Register Hospital
      </Button>
    </CardContent>
  </Card>

  <Card className="mt-6">
    <CardHeader>
      <CardTitle>Registered Hospitals</CardTitle>
    </CardHeader>

    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>License</TableHead>
             <TableHead>Branch</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Map Route</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Contact Person Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Pincode</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospitals.map((hospital) => (
            <TableRow key={hospital.id}>
              <TableCell>{hospital.name}</TableCell>
              <TableCell>{hospital.hospital_type}</TableCell>
              <TableCell>{hospital.license_number}</TableCell>
                <TableCell>{hospital.branch}</TableCell>
              <TableCell>{hospital.email}</TableCell>
              <TableCell>{hospital.phone}</TableCell>
              <TableCell>
  {hospital.website_url ? (
    <a
      href={hospital.website_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      Visit
    </a>
  ) : (
    '—'
  )}
</TableCell>
              <TableCell>
  {hospital.map_route_url ? (
    <a
      href={hospital.map_route_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      View Map
    </a>
  ) : (
    '—'
  )}
</TableCell>
              <TableCell>{hospital.contact_person_name}</TableCell>
              <TableCell>{hospital.contact_person_phone}</TableCell>
              <TableCell>{hospital.city}</TableCell>
              <TableCell>{hospital.address}</TableCell>
              <TableCell>{hospital.pincode}</TableCell>
              <TableCell>
                {hospital.created_at
                  ? format(new Date(hospital.created_at), 'dd MMM yyyy')
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteHospital(hospital.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {hospitals.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No hospitals registered
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;