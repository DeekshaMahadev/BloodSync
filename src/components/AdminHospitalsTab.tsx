import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminHospitalsTab = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: ""
  });

  const handleCreateHospital = async () => {
    // 1️⃣ Create Auth User
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    // 2️⃣ Insert hospital
    await supabase.from("hospitals").insert({
      id: userId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      is_verified: true
    });

    // 3️⃣ Insert profile role
    await supabase.from("profiles").insert({
      id: userId,
      email: form.email,
      role: "hospital"
    });

    alert("Hospital created successfully");
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Hospital Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input placeholder="Password" type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Input placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <Input placeholder="City"
        onChange={(e) => setForm({ ...form, city: e.target.value })} />

      <Button onClick={handleCreateHospital}>
        Create Hospital
      </Button>
    </div>
  );
};

export default AdminHospitalsTab;