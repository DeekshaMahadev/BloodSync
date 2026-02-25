import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DonorCard } from '@/components/donors/DonorCard';
import { RequestCard } from '@/components/requests/RequestCard';
import { BloodGroupBadge } from '@/components/blood/BloodGroupBadge';
import { useBloodDonation } from '@/contexts/BloodDonationContext';
import { BLOOD_GROUPS } from '@/types/blood-donation';
import { 
  Droplet, 
  Users, 
  HeartPulse, 
  Clock, 
  ArrowRight, 
  Search,
  UserPlus,
  Building2,
  AlertTriangle
} from 'lucide-react';

const Index = () => {
  const { donors, requests, getStats, isLoading } = useBloodDonation();
  const stats = getStats();

  // Featured donors
 const featuredDonors = donors
  .filter(d => d.isAvailable)
  .slice(0, 3);

  // ✅ FIXED: Using urgency_level instead of urgency
 const urgentRequests = requests
  .filter(
    r =>
      r.status === 'pending' &&
      (r.urgency === 'critical' || r.urgency === 'urgent')
  )
  .slice(0, 3);

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <HeartPulse className="h-4 w-4" />
              Every Drop Saves a Life
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connect. Donate.{' '}
              <span className="text-gradient">Save Lives.</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              BloodSync connects blood donors with patients in need. 
              blood is one of the most  important components of the human body .
              it carries oxygen and nutries to all parts of the body and removes waste materials. it also helps fight infections and promotes healing.
              blood is essential foe life and health,and donating blood can save lives.
              without blood ,human life is not possible. Join our community of life-savers and make a difference today.
            </p>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl font-bold">"Your blood is someone's hope".</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full shadow-primary sm:w-auto" asChild>
                <Link to="/register">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Register as Donor
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/donors">
                  <Search className="mr-2 h-5 w-5" />
                  Find Blood Donors
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-card py-12">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-8 lg:grid-cols-4">
            <StatsCard
              title="Total Donors"
              value={stats.totalDonors}
              description="Registered donors"
              icon={Users}
              variant="primary"
            />
            <StatsCard
              title="Available Now"
              value={stats.availableDonors}
              description="Ready to donate"
              icon={HeartPulse}
              variant="success"
            />
            <StatsCard
              title="Blood Requests"
              value={stats.pendingRequests}
              description="Awaiting donors"
              icon={Clock}
              variant="warning"
            />
           
          </div>
        </div>
      </section>

      {/* Urgent Requests Section */}
      {urgentRequests.length > 0 && (
        <section className="bg-destructive/5 py-12">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold">Urgent Blood Requests</h2>
                <p className="text-muted-foreground">
                  These patients need blood urgently
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {urgentRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Donors */}
      <section className="py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Featured Donors</h2>
              <p className="text-muted-foreground">Verified donors ready to help</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/donors">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
            Your blood donation can save up to 3 lives. Join our community
            of donors and become a lifesaver today.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                <Droplet className="mr-2 h-5 w-5" />
                Become a Donor
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;