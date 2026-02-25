import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, Save, Edit2, Trash2, Loader2, 
  MapPin, Droplet, User, Phone, Calendar 
} from "lucide-react";

const DonorProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // State matching your exact table schemas
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    blood_group: "",
    location: "",
    availability: true,
    age: 0
  });

  useEffect(() => {
  fetchCompleteProfile();
}, []);

async function fetchCompleteProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate("/donor-login");

    // 🔐 Verify role first
    const { data: profileRole, error: roleError } = await supabase
      .from("profiles")
      .select("role, name, phone")
      .eq("id", user.id)
      .single();

    if (roleError || profileRole.role !== "donor") {
      await supabase.auth.signOut();
      return navigate("/donor-login");
    }

    // ✅ Fetch donor data safely
    const { data: donorData } = await supabase
      .from("donors")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setFormData({
      name: profileRole.name || "",
      phone: profileRole.phone || "",
      email: user.email || "",
      blood_group: donorData?.blood_group || "",
      location: donorData?.location || "",
      availability: donorData?.availability ?? true,
      age: donorData?.age || 0
    });

  } catch (error) {
    console.error("Fetch error:", error);
    toast({
      title: "Error",
      description: "Failed to load profile.",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
}

const handleSave = async () => {
  setLoading(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ name: formData.name, phone: formData.phone })
      .eq("id", user.id);

    if (profileError) throw profileError;

    const { error: donorError } = await supabase
      .from("donors")
      .upsert({
        id: user.id,
        blood_group: formData.blood_group,
        location: formData.location,
        age: formData.age,
        availability: formData.availability
      });

    if (donorError) throw donorError;

    toast({
      title: "Success",
      description: "Profile updated successfully."
    });

    setIsEditing(false);
  } catch (error: any) {
    toast({
      title: "Update Failed",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};

 const handleDelete = async () => {
  if (!window.confirm("Delete your account permanently?")) return;

  setLoading(true);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // delete profile (this will cascade delete donor)
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (error) throw error;

    await supabase.auth.signOut();

    toast({
      title: "Profile Deleted",
      description: "Your donor data has been removed."
    });

    navigate("/");
  } catch (error: any) {
    toast({
      title: "Deletion Failed",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};
  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <Layout>
      <div className="container max-w-2xl py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Donor Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : <Edit2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => supabase.auth.signOut().then(() => navigate("/"))}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">General Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input disabled={!isEditing} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" disabled={!isEditing} value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Input disabled={!isEditing} value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" disabled={!isEditing} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>

            {isEditing && (
              <Button className="w-full mt-4" onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-destructive/20">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Permanently remove your donor data.</div>
            <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" /> Delete Profile</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DonorProfile;