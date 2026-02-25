import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  HeartHandshake, 
  Droplet, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  PhoneCall,
  HelpCircle,
  Mail,
  Phone,
  Users
} from "lucide-react";

const Help = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-10 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <HelpCircle className="mx-auto h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">
            Everything you need to know about using our Blood Donation Platform.
          </p>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" />
              How the Platform Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Our platform connects blood donors with patients in need. Donors register,
              provide their blood group and location, and become searchable for emergencies.
            </p>
            <p>
              Hospitals or patients can search donors by blood group and contact them directly.
            </p>
          </CardContent>
        </Card>

        {/* Donor Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              How to Register as a Donor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Create an account using the Donor Registration page.</li>
              <li>Fill in your correct blood group, age, and location.</li>
              <li>Keep your phone number updated so recipients can contact you.</li>
              <li>Update availability if you are temporarily unable to donate.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Finding Donors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              How to Find a Donor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Go to the homepage.</li>
              <li>Select the required blood group.</li>
              <li>Browse available donors in your area.</li>
              <li>Contact the donor directly using the provided phone number.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Safety Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Safety Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure donor meets medical eligibility requirements.</li>
              <li>Always donate at certified hospitals or blood banks.</li>
              <li>Do not share sensitive personal information publicly.</li>
              <li>Report suspicious activity to support immediately.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Managing Your Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>You can edit your donor profile from the dashboard.</li>
              <li>Update blood group or location anytime.</li>
              <li>You may permanently delete your account from your profile page.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Support Section - Updated with Phone and Email */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-primary" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you experience technical issues, account problems, or need assistance,
              please reach out to our support team directly:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="mailto:support@connectx.com" 
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email us at</p>
                  <p className="text-sm font-medium">bloodsync123@gmail.com</p>
                </div>
              </a>
              
              <a 
                href="tel:+1234567890" 
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Call us at</p>
                  <p className="text-sm font-medium">+91 9000000000</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Team Credits Container */}
        <Card className="bg-muted/30 border-none">
          <CardContent className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold uppercase tracking-wider text-foreground">
                Developed by Team ConnectX
              </h2>
              <div className="flex flex-wrap justify-center gap-2 text-sm font-medium text-muted-foreground">
                
                
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
};

export default Help;