import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Droplet,
  HeartPulse,
  ShieldCheck,
  Info as InfoIcon,
  Activity,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  BarChart3,
} from "lucide-react";

const Info = () => {
  return (
    <Layout>
      <div className="container max-w-5xl py-10 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <InfoIcon className="mx-auto h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">Blood Donation Information Center</h1>
          <p className="text-muted-foreground">
            Learn about blood types, donation benefits, safety guidelines and important medical facts.
          </p>
        </div>

        {/* What is Blood */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              What is Blood?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Blood is a vital fluid that circulates through the human body, delivering oxygen
              and nutrients to cells and removing waste products.
            </p>
            <p>
              It is made up of:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Red Blood Cells (RBCs)</strong> – Carry oxygen.</li>
              <li><strong>White Blood Cells (WBCs)</strong> – Fight infections.</li>
              <li><strong>Platelets</strong> – Help blood clot.</li>
              <li><strong>Plasma</strong> – Liquid component transporting nutrients.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Blood Groups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              Blood Groups & Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              There are 8 main blood groups: O-, O+, A-, A+, B-, B+, AB-, AB+.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>O-</strong> → Universal Donor</li>
              <li><strong>AB+</strong> → Universal Recipient</li>
              <li>Rh factor (+ or -) is important for compatibility.</li>
              <li>Receiving incompatible blood can cause serious reactions.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Donation Facts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Important Donation Facts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <ul className="list-disc pl-5 space-y-2">
              <li>One donation can save up to 3 lives.</li>
              <li>Average donation time: 8–10 minutes.</li>
              <li>Body replaces donated plasma within 24 hours.</li>
              <li>Red blood cells are replaced within 4–6 weeks.</li>
              <li>You can donate whole blood every 3 months.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Eligibility Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Who Can Donate Blood?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <ul className="list-disc pl-5 space-y-2">
              <li>Age between 18 – 65 years.</li>
              <li>Minimum weight: 50 kg.</li>
              <li>Hemoglobin level within healthy range.</li>
              <li>No active infections or major illnesses.</li>
              <li>Not pregnant at the time of donation.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Benefits of Donating Blood
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <ul className="list-disc pl-5 space-y-2">
              <li>Helps save lives during emergencies and surgeries.</li>
              <li>Improves heart health.</li>
              <li>Stimulates new blood cell production.</li>
              <li>Provides free mini health check-up before donation.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Myths vs Facts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Common Myths vs Facts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Myth:</strong> Donating blood is painful. <br/> <strong>Fact:</strong> Only mild discomfort for a few seconds.</li>
              <li><strong>Myth:</strong> You may become weak permanently. <br/> <strong>Fact:</strong> Body quickly replenishes lost blood.</li>
              <li><strong>Myth:</strong> Only rare blood types are needed. <br/> <strong>Fact:</strong> All blood types are equally important.</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
};

export default Info;