import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { SkinProfile, calculateFuzzyMembership } from "@/lib/fuzzyLogic";
import { useNavigate } from "react-router-dom";
import { Droplets, Sparkles, AlertCircle, Zap } from "lucide-react";

export const SkinQuiz = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SkinProfile>({
    hydration: 50,
    oiliness: 50,
    sensitivity: 50,
    acneLevel: 50,
  });

  const handleSubmit = () => {
    localStorage.setItem("skinProfile", JSON.stringify(profile));
    navigate("/products");
  };

  const updateProfile = (key: keyof SkinProfile, value: number[]) => {
    setProfile(prev => ({ ...prev, [key]: value[0] }));
  };

  const membership = calculateFuzzyMembership(profile);

  const questions = [
    {
      key: "hydration" as keyof SkinProfile,
      label: "How hydrated is your skin?",
      icon: Droplets,
      leftLabel: "Very Dry",
      rightLabel: "Very Hydrated",
      color: "text-primary",
    },
    {
      key: "oiliness" as keyof SkinProfile,
      label: "How oily is your skin?",
      icon: Sparkles,
      leftLabel: "Not Oily",
      rightLabel: "Very Oily",
      color: "text-accent-foreground",
    },
    {
      key: "sensitivity" as keyof SkinProfile,
      label: "How sensitive is your skin?",
      icon: AlertCircle,
      leftLabel: "Not Sensitive",
      rightLabel: "Very Sensitive",
      color: "text-secondary-foreground",
    },
    {
      key: "acneLevel" as keyof SkinProfile,
      label: "How prone to acne/blemishes?",
      icon: Zap,
      leftLabel: "Never",
      rightLabel: "Very Often",
      color: "text-primary",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Discover Your Skin Profile</h1>
        <p className="text-lg text-muted-foreground">
          Answer these questions to get personalized product recommendations powered by fuzzy logic
        </p>
      </div>

      <Card className="p-8 space-y-8 shadow-elevated">
        {questions.map(({ key, label, icon: Icon, leftLabel, rightLabel, color }) => (
          <div key={key} className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 ${color}`} />
              <label className="text-base font-medium text-foreground">{label}</label>
            </div>
            
            <div className="space-y-2">
              <Slider
                value={[profile[key]]}
                onValueChange={(value) => updateProfile(key, value)}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{leftLabel}</span>
                <span className="font-semibold text-foreground">{profile[key]}</span>
                <span>{rightLabel}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Your Fuzzy Skin Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Dry</div>
              <div className="text-2xl font-bold text-primary">
                {Math.round(membership.dry * 100)}%
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Oily</div>
              <div className="text-2xl font-bold text-primary">
                {Math.round(membership.oily * 100)}%
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Sensitive</div>
              <div className="text-2xl font-bold text-primary">
                {Math.round(membership.sensitive * 100)}%
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Acne-Prone</div>
              <div className="text-2xl font-bold text-primary">
                {Math.round(membership.acneProne * 100)}%
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleSubmit}
          className="px-12 bg-gradient-botanical hover:opacity-90 transition-opacity"
        >
          Get My Recommendations
        </Button>
      </div>
    </div>
  );
};
