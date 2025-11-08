import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { products } from "@/data/products";
import { SkinProfile, calculateProductMatch, analyzeIngredientSuitability } from "@/lib/fuzzyLogic";
import { MatchScore } from "@/components/MatchScore";
import { ShoppingCart, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("skinProfile");
    if (saved) {
      setSkinProfile(JSON.parse(saved));
    }
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Button asChild className="mt-4">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const match = skinProfile ? calculateProductMatch(skinProfile, product) : null;
  const ingredientAnalysis = skinProfile
    ? analyzeIngredientSuitability(product.ingredients, skinProfile)
    : null;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-soft shadow-elevated">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-xl text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center justify-between py-6 border-y border-border">
              <span className="text-4xl font-bold text-foreground">${product.price}</span>
              <Button size="lg" className="bg-gradient-botanical px-8">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {match && (
              <Card className="p-6 bg-secondary/50">
                <h3 className="font-semibold text-lg mb-4 text-foreground">
                  Your Personalized Match Score
                </h3>
                <MatchScore score={match.matchScore} size="lg" />
                
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-sm text-foreground">Match Factors:</h4>
                  {Object.entries(match.factors).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="font-medium text-foreground">
                          {Math.round(value * 100)}%
                        </span>
                      </div>
                      <Progress value={value * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div>
              <h3 className="font-semibold text-lg mb-3 text-foreground">Key Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Ingredient Analysis */}
        {ingredientAnalysis && (
          <Card className="mt-12 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Ingredient Suitability Analysis
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on your skin profile, here's how suitable each ingredient is for you
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {ingredientAnalysis.map(({ ingredient, suitability, reason }) => (
                <Card key={ingredient} className="p-4 border-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {suitability >= 0.7 ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                      <h4 className="font-medium text-foreground">{ingredient}</h4>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {Math.round(suitability * 100)}%
                    </span>
                  </div>
                  <Progress value={suitability * 100} className="h-1.5 mb-2" />
                  <p className="text-xs text-muted-foreground">{reason}</p>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
