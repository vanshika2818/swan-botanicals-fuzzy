import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { SkinProfile, calculateProductMatch } from "@/lib/fuzzyLogic";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, Filter } from "lucide-react";

const Products = () => {
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [sortBy, setSortBy] = useState<"match" | "price" | "name">("match");

  useEffect(() => {
    const saved = localStorage.getItem("skinProfile");
    if (saved) {
      setSkinProfile(JSON.parse(saved));
    }
  }, []);

  const productsWithMatch = skinProfile
    ? products.map(product => ({
        product,
        match: calculateProductMatch(skinProfile, product),
      }))
    : products.map(product => ({ product, match: null }));

  const sortedProducts = [...productsWithMatch].sort((a, b) => {
    if (sortBy === "match" && a.match && b.match) {
      return b.match.matchScore - a.match.matchScore;
    }
    if (sortBy === "price") {
      return a.product.price - b.product.price;
    }
    return a.product.name.localeCompare(b.product.name);
  });

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {skinProfile ? "Your Personalized Matches" : "All Products"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {skinProfile
              ? "Products ranked by fuzzy logic match confidence"
              : "Take the skin quiz to see personalized recommendations"}
          </p>
        </div>

        {!skinProfile && (
          <div className="mb-8 p-6 bg-secondary rounded-xl border border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Get Personalized Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Take our skin quiz to see products ranked by match confidence
                </p>
              </div>
            </div>
            <Button asChild className="bg-gradient-botanical">
              <Link to="/quiz">Take Quiz</Link>
            </Button>
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Sort by:</span>
          <div className="flex gap-2">
            {skinProfile && (
              <Button
                variant={sortBy === "match" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("match")}
                className={sortBy === "match" ? "bg-gradient-botanical" : ""}
              >
                Best Match
              </Button>
            )}
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("price")}
            >
              Price
            </Button>
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("name")}
            >
              Name
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map(({ product, match }) => (
            <ProductCard
              key={product.id}
              product={product}
              matchScore={match?.matchScore}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
