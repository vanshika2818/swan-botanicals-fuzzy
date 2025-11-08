import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkinProfile, generateRoutine } from "@/lib/fuzzyLogic";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

const Routine = () => {
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
              Take our skin quiz to generate your personalized routine
            </p>
            <Button asChild className="bg-gradient-botanical">
              <Link to="/quiz">Take Skin Quiz</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const routine = generateRoutine(skinProfile, products);

  const getFrequencyBadge = (frequency: string) => {
    const variants: Record<string, { color: string; text: string }> = {
      daily: { color: "bg-primary text-primary-foreground", text: "Daily (0.9+)" },
      regularly: { color: "bg-accent text-accent-foreground", text: "Regularly (0.7-0.85)" },
      occasionally: { color: "bg-secondary text-secondary-foreground", text: "Occasionally (0.5-0.7)" },
      avoid: { color: "bg-destructive/20 text-destructive", text: "Not Recommended" },
    };
    return variants[frequency] || variants.avoid;
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Personalized Routine</h1>
          <p className="text-lg text-muted-foreground">
            AI-generated skincare routine with fuzzy suitability scores for each step
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {routine.map(({ step, product, suitability, frequency }, index) => {
            const frequencyInfo = getFrequencyBadge(frequency);
            
            return (
              <Card key={step} className="p-6 hover:shadow-elevated transition-all duration-300">
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-botanical flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{step}</h3>
                        <Badge className={frequencyInfo.color}>{frequencyInfo.text}</Badge>
                      </div>
                      
                      {product ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-20 h-20 rounded-lg object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                            <div className="flex-grow">
                              <Link 
                                to={`/product/${product.id}`}
                                className="font-medium text-foreground hover:text-primary transition-colors"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                              <div className="mt-1 text-lg font-bold text-foreground">
                                ${product.price}
                              </div>
                            </div>
                          </div>

                          {/* Suitability Score */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-muted-foreground">
                                Suitability Score
                              </span>
                              <span className="text-sm font-bold text-primary">
                                {Math.round(suitability * 100)}%
                              </span>
                            </div>
                            <Progress value={suitability * 100} className="h-2" />
                          </div>

                          {/* Usage Instructions */}
                          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                            <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-muted-foreground">
                              {frequency === "daily" && "Use every morning and evening for best results"}
                              {frequency === "regularly" && "Use 3-5 times per week"}
                              {frequency === "occasionally" && "Use 1-2 times per week or as needed"}
                              {frequency === "avoid" && "This product may not be suitable for your skin type"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <AlertCircle className="h-5 w-5" />
                          <span>No suitable product found for this step</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <Card className="mt-12 p-8 max-w-4xl mx-auto bg-gradient-pink">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Your Routine is Ready!
              </h3>
              <p className="text-muted-foreground mb-4">
                Follow this personalized routine based on your unique skin profile. 
                Consistency is key - give products 4-6 weeks to show results.
              </p>
              <div className="flex gap-3">
                <Button asChild className="bg-gradient-botanical">
                  <Link to="/products">Shop All Products</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/dashboard">View My Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Routine;
