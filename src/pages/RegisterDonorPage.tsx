import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BLOOD_GROUPS, BloodGroup } from '@/types/blood-donation';
import { useToast } from '@/hooks/use-toast';
import { Droplet, Heart, AlertCircle, MapPin } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { differenceInMonths, parseISO } from 'date-fns';

/* ---------------- VALIDATION ---------------- */

const donorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  age: z.number().min(18).max(65),
  city: z.string().min(2),
  address: z.string().min(5),
  donorType: z.enum(['first_time', 'previous']),
  lastDonationDate: z.string().nullable(),
  isAvailable: z.boolean(),
});

/* ---------------- COMPONENT ---------------- */

const RegisterDonorPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: '' as BloodGroup | '',
    age: '',
    city: '',
    address: '',
    donorType: 'first_time' as 'first_time' | 'previous',
    lastDonationDate: '',
    isAvailable: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const checkEligibility = (dateString: string) => {
    const lastDate = parseISO(dateString);
    const monthsSinceDonation = differenceInMonths(new Date(), lastDate);
    return monthsSinceDonation >= 6;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = donorSchema.parse({
        ...formData,
        age: Number(formData.age),
        lastDonationDate: formData.lastDonationDate || null,
      });

      let finalAvailability = validated.isAvailable;
      let isFirstTimeDonor = validated.donorType === 'first_time';

      // IF PREVIOUS DONOR → MUST CHECK DATE
      if (!isFirstTimeDonor) {
        if (!validated.lastDonationDate) {
          throw new Error("Please select your last donation date.");
        }

        const eligible = checkEligibility(validated.lastDonationDate);
        if (!eligible) finalAvailability = false;
      }

      /* 1️⃣ CREATE AUTH USER */
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: validated.email,
          password: validated.password,
        });

      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("User creation failed");

      /* 2️⃣ INSERT PROFILE */
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          name: validated.name,
          phone: validated.phone,
          role: "donor",
        });

      if (profileError) throw profileError;

      /* 3️⃣ INSERT DONOR */
      const { error: donorError } = await supabase
        .from("donors")
        .upsert({
          id: userId,
          blood_group: validated.bloodGroup,
          location: `${validated.city}, ${validated.address}`,
          availability: finalAvailability,
          last_donation_date: validated.lastDonationDate,
          age: validated.age,
          is_verified: false,
          is_first_time: isFirstTimeDonor,
        });

      if (donorError) throw donorError;

      toast({
        title: "Registration Successful 🎉",
        description: "Your donor account has been created.",
      });

      navigate("/donor-login");

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEligible =
    formData.donorType === "previous" && formData.lastDonationDate
      ? checkEligibility(formData.lastDonationDate)
      : true;

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <section className="bg-gradient-hero py-12">
        <div className="container text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Heart className="h-4 w-4" /> Become a Hero
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Register as Blood Donor
          </h1>
          <p className="text-muted-foreground mt-2">
            Your contribution can save lives.
          </p>
        </div>
      </section>

      <div className="container py-8">
        <Card className="mx-auto max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" /> Donor Details
            </CardTitle>
            <CardDescription>
              Please provide accurate information.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* BASIC DETAILS */}
              <Input placeholder="Full Name" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
              <Input type="number" placeholder="Age" value={formData.age} onChange={e => handleChange('age', e.target.value)} />

              <Select value={formData.bloodGroup} onValueChange={v => handleChange('bloodGroup', v)}>
                <SelectTrigger><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                </SelectContent>
              </Select>

              <Input placeholder="Phone Number" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
              <Input type="email" placeholder="Email" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
              <Input type="password" placeholder="Password" value={formData.password} onChange={e => handleChange('password', e.target.value)} />
              <Input placeholder="City" value={formData.city} onChange={e => handleChange('city', e.target.value)} />
              <Input placeholder="Full Address" value={formData.address} onChange={e => handleChange('address', e.target.value)} />

              {/* IF / ELSE DONOR TYPE */}
              <div className="space-y-3 border p-4 rounded-lg">
                <Label>Donation History</Label>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.donorType === "first_time" ? "default" : "outline"}
                    onClick={() => handleChange("donorType", "first_time")}
                  >
                    First Time Donor
                  </Button>

                  <Button
                    type="button"
                    variant={formData.donorType === "previous" ? "default" : "outline"}
                    onClick={() => handleChange("donorType", "previous")}
                  >
                    Previously Donated
                  </Button>
                </div>

                {formData.donorType === "previous" && (
                  <Input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.lastDonationDate}
                    onChange={e => handleChange('lastDonationDate', e.target.value)}
                  />
                )}
              </div>

              {!isEligible && (
                <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">
                    You must wait 6 months before donating again.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border p-4 rounded-lg">
                <Label>Show me as Available</Label>
                <Switch
                  checked={formData.isAvailable && isEligible}
                  disabled={!isEligible}
                  onCheckedChange={v => handleChange('isAvailable', v)}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12">
                {isSubmitting ? "Processing..." : "Register as Donor"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterDonorPage;