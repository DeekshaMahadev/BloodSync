import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BloodGroupBadge } from '@/components/blood/BloodGroupBadge';
import { StatusBadge } from '@/components/blood/StatusBadge';
import { UrgencyBadge } from '@/components/blood/UrgencyBadge';
import { useToast } from '@/hooks/use-toast';
import { 
  Droplet, 
  LogOut, 
  Trash2, 
  CheckCircle, 
  CheckCircle2, 
  Building2,
  Clock,
  Link
} from 'lucide-react';
import { format } from 'date-fns';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [hospitalInfo, setHospitalInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/hospital-login', { replace: true });
        return;
      }

      // Fetch Hospital Profile Details
      const { data: profile } = await supabase
        .from('hospitals')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      setHospitalInfo(profile);
      fetchRequests(user.id);
    };

    initializeDashboard();
  }, [navigate]);

  const fetchRequests = async (userId: string) => {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('hospital_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error fetching requests", variant: "destructive" });
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('blood_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ title: "Update failed", variant: "destructive" });
    } else {
      toast({ title: `Request marked as ${status}` });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) fetchRequests(user.id);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    const { error } = await supabase
      .from('blood_requests')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    } else {
      toast({ title: "Request deleted", variant: "destructive" });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) fetchRequests(user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/hospital-login', { replace: true });
  };

  if (loading) {
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
      {/* Header Section - Matches Admin UI */}
      <section className="bg-gradient-hero py-8">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
               <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {hospitalInfo?.name || 'Hospital Dashboard'}
              </h1>
              <p className="text-muted-foreground italic">
                {hospitalInfo?.email} • {hospitalInfo?.city}
              </p>
            </div>
          </div>

          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </section>

      <div className="container py-8">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 lg:w-[200px]">
            <TabsTrigger value="requests">
              <Droplet className="mr-2 h-4 w-4" />
              My Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blood Requests</CardTitle>
                    <CardDescription>
                      Manage and track blood requirements for your facility
                    </CardDescription>
                  </div>
                  <Button onClick={() => navigate('/request')}>
                    Create New Request
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((req) => (
                        <TableRow key={req.id} className="hover:bg-muted/20 transition-colors">
                          {/* 🔹 FIX: patient_name (from DB) instead of patientName */}
                          <TableCell className="font-semibold">{req.patient_name || req.patientName}</TableCell>
                          
                          <TableCell>
                            {/* 🔹 FIX: blood_group (from DB) instead of bloodGroup */}
                            <BloodGroupBadge bloodGroup={req.blood_group || req.bloodGroup} size="sm" />
                          </TableCell>
                          
                          <TableCell>
                            {/* 🔹 FIX: Mapping urgency_level and handling fallback */}
                            <UrgencyBadge urgency={req.urgency_level || req.urgency || 'normal'} />
                          </TableCell>
                          
                          <TableCell>
                            <StatusBadge status={req.status} />
                          </TableCell>
                          
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(req.created_at), 'dd MMM yyyy')}
                          </TableCell>
                          
                          <TableCell className="text-right space-x-2">
                            {req.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                onClick={() => updateStatus(req.id, 'approved')}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Confirm
                              </Button>
                            )}
                            {req.status === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => updateStatus(req.id, 'fulfilled')}
                              >
                                <CheckCircle2 className="mr-1 h-4 w-4" />
                                Mark Fulfilled
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteRequest(req.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {requests.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-muted-foreground">No blood requests found for this hospital.</p>
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

export default HospitalDashboard;