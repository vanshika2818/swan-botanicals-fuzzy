import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkinProfile, calculateFuzzyMembership } from "@/lib/fuzzyLogic";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { AlertCircle, Droplets, Sparkles, Heart, Zap } from "lucide-react";

const Dashboard = () => {
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("skinProfile");
    if (saved) {
      setSkinProfile(JSON.parse(saved));
    }
  }, []);

  if (!skinProfile) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">No Skin Profile Found</h2>
            <p className="text-muted-foreground mb-6">
              Take our skin quiz to see your personalized dashboard
            </p>
            <Button asChild className="bg-gradient-botanical">
              <Link to="/quiz">Take Skin Quiz</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const membership = calculateFuzzyMembership(skinProfile);

  const radarData = [
    { characteristic: "Hydration", value: skinProfile.hydration },
    { characteristic: "Oiliness", value: skinProfile.oiliness },
    { characteristic: "Sensitivity", value: skinProfile.sensitivity },
    { characteristic: "Acne Level", value: skinProfile.acneLevel },
  ];

  const fuzzyData = [
    { name: "Dry", value: Math.round(membership.dry * 100) },
    { name: "Normal", value: Math.round(membership.normal * 100) },
    { name: "Oily", value: Math.round(membership.oily * 100) },
    { name: "Sensitive", value: Math.round(membership.sensitive * 100) },
    { name: "Acne-Prone", value: Math.round(membership.acneProne * 100) },
  ];

  const metrics = [
    {
      icon: Droplets,
      label: "Hydration",
      value: skinProfile.hydration,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Sparkles,
      label: "Oiliness",
      value: skinProfile.oiliness,
      color: "text-accent-foreground",
      bgColor: "bg-accent/30",
    },
    {
      icon: Heart,
      label: "Sensitivity",
      value: skinProfile.sensitivity,
      color: "text-secondary-foreground",
      bgColor: "bg-secondary",
    },
    {
      icon: Zap,
      label: "Acne Level",
      value: skinProfile.acneLevel,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">My Skin Profile</h1>
          <p className="text-lg text-muted-foreground">
            Your personalized skin analysis powered by fuzzy logic
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map(({ icon: Icon, label, value, color, bgColor }) => (
            <Card key={label} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${bgColor}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <span className={`text-3xl font-bold ${color}`}>{value}</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">{label}</div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Skin Characteristic Radar
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="characteristic" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Your Skin"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Fuzzy Membership Degrees
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fuzzyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Analysis Summary */}
        <Card className="p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            Your Fuzzy Skin Analysis
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Primary Characteristics</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Your skin is <strong className="text-foreground">{Math.round(membership.dry * 100)}% dry</strong></li>
                <li>• Your skin is <strong className="text-foreground">{Math.round(membership.oily * 100)}% oily</strong></li>
                <li>• Your skin is <strong className="text-foreground">{Math.round(membership.sensitive * 100)}% sensitive</strong></li>
                <li>• Your skin is <strong className="text-foreground">{Math.round(membership.acneProne * 100)}% acne-prone</strong></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Recommendations</h4>
              <ul className="space-y-2 text-muted-foreground">
                {membership.dry > 0.6 && <li>✓ Focus on hydrating products</li>}
                {membership.oily > 0.6 && <li>✓ Look for oil-control formulas</li>}
                {membership.sensitive > 0.6 && <li>✓ Choose fragrance-free options</li>}
                {membership.acneProne > 0.6 && <li>✓ Consider acne-fighting ingredients</li>}
                {membership.dry <= 0.6 && membership.oily <= 0.6 && (
                  <li>✓ Your skin is balanced - maintain with gentle products</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex gap-4">
            <Button asChild className="bg-gradient-botanical">
              <Link to="/products">View Recommended Products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/routine">Generate My Routine</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/quiz">Retake Quiz</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
