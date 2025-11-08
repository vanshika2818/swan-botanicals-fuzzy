import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Product } from "@/lib/fuzzyLogic";
import { MatchScore } from "./MatchScore";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  matchScore?: number;
}

export const ProductCard = ({ product, matchScore }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 group">
      <div className="aspect-square bg-gradient-soft relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {product.category}
        </Badge>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {matchScore !== undefined && (
          <MatchScore score={matchScore} size="sm" />
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-foreground">
            ${product.price}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/product/${product.id}`}>Details</Link>
            </Button>
            <Button size="sm" className="bg-gradient-botanical">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
