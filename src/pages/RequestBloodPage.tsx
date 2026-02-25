import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BLOOD_GROUPS, CITIES, BloodGroup, RequestUrgency } from '@/types/blood-donation';
import { useToast } from '@/hooks/use-toast';
import { Droplet, Building2, User, Phone, AlertTriangle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const requestSchema = z.object({
  patientName: z.string().trim().min(2).max(100),
  contactPhone: z.string().trim().min(10).max(15),
  contactEmail: z.string().trim().email(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  unitsRequired: z.number().min(1).max(10),
  hospitalName: z.string().trim().min(2).max(200),
  hospitalAddress: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2),
  urgency: z.enum(['normal', 'urgent', 'critical']),
  reason: z.string().trim().min(5).max(500),
  requiredByDate: z.string().min(1),
});

const RequestBloodPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hospitalId, setHospitalId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientName: '',
    contactPhone: '',
    contactEmail: '',
    bloodGroup: '' as BloodGroup | '',
    unitsRequired: 1,
    hospitalName: '',
    hospitalAddress: '',
    city: '',
    urgency: 'normal' as RequestUrgency,
    reason: '',
    requiredByDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Fetch Hospital Info on Mount to auto-fill the form
  useEffect(() => {
    const fetchHospitalProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/hospital-login');
        return;
      }

      setHospitalId(user.id);

      const { data: profile } = await supabase
        .from('hospitals')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          hospitalName: profile.name,
          hospitalAddress: profile.address,
          city: profile.city,
          contactPhone: profile.phone,
          contactEmail: profile.email
        }));
      }
      setLoadingProfile(false);
    };

    fetchHospitalProfile();
  }, [navigate]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = requestSchema.parse({
        ...formData,
        unitsRequired: Number(formData.unitsRequired),
      });

      const { error } = await supabase.from('blood_requests').insert([
        {
          patient_name: validated.patientName,
          contact_phone: validated.contactPhone,
          contact_email: validated.contactEmail,
          blood_group: validated.bloodGroup,
          units_required: validated.unitsRequired,
          hospital_name: validated.hospitalName,
          hospital_address: validated.hospitalAddress,
          city: validated.city,
          location: validated.city,
          urgency_level: validated.urgency,
          reason: validated.reason,
          required_by_date: validated.requiredByDate,
          status: 'pending',
          hospital_id: hospitalId, // Important: Links request to the hospital dashboard
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Blood Request Submitted',
        description: 'Your request is now live on the dashboard.',
      });

      navigate('/hospital-dashboard');
    } catch (error: any) {
      if (error?.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (loadingProfile) return <div className="flex h-screen items-center justify-center">Loading Profile...</div>;

  return (
    <Layout>
      <section className="bg-gradient-hero py-12">
        <div className="container">
           <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate('/hospital-dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Request Blood</h1>
            <p className="text-muted-foreground">Submit a blood requirement for your hospital</p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Blood Request Form
            </CardTitle>
            <CardDescription>Enter patient and urgency details</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Info */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                  <User className="h-4 w-4 text-primary" /> Patient Information
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Patient Full Name</Label>
                    <Input
                      placeholder="Enter full name of the patient"
                      value={formData.patientName}
                      onChange={(e) => handleChange('patientName', e.target.value)}
                    />
                    {errors.patientName && <p className="text-xs text-destructive">{errors.patientName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Blood Group Required</Label>
                    <Select value={formData.bloodGroup} onValueChange={(v) => handleChange('bloodGroup', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Units Required</Label>
                    <Select value={formData.unitsRequired.toString()} onValueChange={(v) => handleChange('unitsRequired', parseInt(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n} Unit{n>1?'s':''}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Needed By Date</Label>
                    <Input type="date" min={minDate} value={formData.requiredByDate} onChange={(e) => handleChange('requiredByDate', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Hospital - Read Only or Pre-filled */}
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" /> Verifying Hospital Details
                </h3>
                <div className="grid grid-cols-2 text-sm gap-y-2">
                  <span className="text-muted-foreground">Facility:</span>
                  <span className="font-medium">{formData.hospitalName}</span>
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium">{formData.city}</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">These details are synced with your hospital account profile.</p>
              </div>

              {/* Urgency */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-primary font-bold">
                  <AlertTriangle className="h-4 w-4" /> Urgency Level
                </Label>
                <RadioGroup value={formData.urgency} onValueChange={(v) => handleChange('urgency', v)} className="flex gap-4 p-2 border rounded-md">
                  {['normal','urgent','critical'].map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={level} />
                      <Label htmlFor={level} className="capitalize cursor-pointer">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Medical Reason / Notes</Label>
                <Textarea 
                  placeholder="Explain why the blood is needed (e.g., Surgery, Anemia)" 
                  value={formData.reason} 
                  onChange={(e) => handleChange('reason', e.target.value)}
                />
                {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
              </div>

              <Button type="submit" className="w-full text-lg h-12" disabled={isSubmitting}>
                {isSubmitting ? 'Processing Request...' : 'Confirm & Post Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RequestBloodPage;