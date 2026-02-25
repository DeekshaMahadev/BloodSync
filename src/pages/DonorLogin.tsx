import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft, UserCircle } from "lucide-react";

const DonorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ Auto redirect if already logged in as a donor
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile?.role === "donor") {
          navigate("/donor-dashboard", { replace: true });
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // ✅ Verify Role from Profiles Table
      const { data: profile, error: roleError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (roleError || profile?.role !== "donor") {
        // Sign out if they are an admin or other role trying to use the donor portal
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "This portal is for Donors only. Please use the Admin portal.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome Back!",
        description: "Successfully logged into your donor dashboard.",
      });

      navigate("/donor-dashboard", { replace: true });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again." 
          : error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-50/50 px-4">
        
        <Button 
          variant="ghost" 
          className="absolute top-8 left-8 text-muted-foreground hover:text-primary"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-4 ring-1 ring-red-100">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Donor Login
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to manage your profile
            </p>
          </div>

          <Card className="border-border shadow-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Sign In
              </CardTitle>
              <CardDescription>
                Access your donation history and status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nayana@gmail.com"
                      className="pl-10 h-12 border-input focus:ring-primary focus:border-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 border-input focus:ring-primary focus:border-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold shadow-sm bg-primary hover:bg-primary/90" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Login to Dashboard"
                  )}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Don't have an account?</span>
                  </div>
                </div>

                {/* 🔹 FIXED: Navigate to the actual registration page route */}
                <Button 
                  variant="outline" 
                  type="button"
                  className="w-full h-12" 
                  onClick={() => navigate('/register-donor')}
                >
                  Create Donor Account
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
             <p>© 2026 BloodSync Community</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonorLogin;