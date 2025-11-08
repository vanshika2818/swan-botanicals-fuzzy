import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Leaf, Heart, Brain } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-botanical opacity-10" />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                <Brain className="h-4 w-4" />
                Powered by Fuzzy Logic AI
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Skincare That
                <span className="block text-primary">Understands You</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Experience intelligent, personalized skincare recommendations powered by advanced fuzzy logic. 
                Get products that truly match your unique skin profile.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-gradient-botanical text-lg px-8">
                  <Link to="/quiz">Take Skin Quiz</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Match Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Natural</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Natural botanical skincare"
                className="rounded-3xl shadow-elevated w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-elevated border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-botanical flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">AI Confidence</div>
                    <div className="text-2xl font-bold text-primary">92%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our fuzzy logic engine analyzes your unique skin characteristics to provide
              personalized recommendations with confidence scores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4 hover:shadow-elevated transition-all duration-300 border-2 hover:border-primary">
              <div className="h-14 w-14 rounded-2xl bg-gradient-botanical flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Fuzzy Skin Analysis</h3>
              <p className="text-muted-foreground">
                Take our interactive quiz using sliders to input your skin characteristics. 
                Our system calculates fuzzy membership functions for dry, oily, sensitive, and acne-prone traits.
              </p>
            </Card>

            <Card className="p-8 space-y-4 hover:shadow-elevated transition-all duration-300 border-2 hover:border-primary">
              <div className="h-14 w-14 rounded-2xl bg-gradient-pink flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Smart Matching</h3>
              <p className="text-muted-foreground">
                Get products ranked by match confidence (0-100%). Our fuzzy inference engine 
                combines multiple factors: hydration needs, oil control, sensitivity, and ingredient safety.
              </p>
            </Card>

            <Card className="p-8 space-y-4 hover:shadow-elevated transition-all duration-300 border-2 hover:border-primary">
              <div className="h-14 w-14 rounded-2xl bg-gradient-botanical flex items-center justify-center">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Personalized Routine</h3>
              <p className="text-muted-foreground">
                Receive a complete skincare routine with suitability scores for each step. 
                See usage recommendations: daily (0.9+), regularly (0.7-0.85), or occasionally (0.5-0.7).
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-botanical text-white">
        <div className="container mx-auto px-4 text-center">
          <Leaf className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who've discovered their ideal skincare routine through intelligent personalization
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-12">
            <Link to="/quiz">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
