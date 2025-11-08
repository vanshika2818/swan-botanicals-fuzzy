// Fuzzy Logic Engine for Swan Botanicals

export interface SkinProfile {
  hydration: number; // 0-100
  oiliness: number; // 0-100
  sensitivity: number; // 0-100
  acneLevel: number; // 0-100
}

export interface FuzzyMembership {
  dry: number;
  normal: number;
  oily: number;
  sensitive: number;
  acneProne: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  ingredients: string[];
  benefits: string[];
  imageUrl: string;
  targetSkinTypes: string[];
}

export interface ProductMatch {
  product: Product;
  matchScore: number;
  factors: {
    hydrationMatch: number;
    oilinessMatch: number;
    sensitivityMatch: number;
    acneMatch: number;
    ingredientSafety: number;
  };
}

// Fuzzy membership functions
export function calculateFuzzyMembership(profile: SkinProfile): FuzzyMembership {
  return {
    dry: trapezoidalMembership(profile.hydration, 0, 0, 30, 50),
    normal: triangularMembership(profile.hydration, 30, 50, 70),
    oily: trapezoidalMembership(profile.hydration, 50, 70, 100, 100),
    sensitive: trapezoidalMembership(profile.sensitivity, 60, 80, 100, 100),
    acneProne: trapezoidalMembership(profile.acneLevel, 50, 70, 100, 100),
  };
}

// Trapezoidal membership function
function trapezoidalMembership(x: number, a: number, b: number, c: number, d: number): number {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

// Triangular membership function
function triangularMembership(x: number, a: number, b: number, c: number): number {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

// Calculate product match score using fuzzy logic
export function calculateProductMatch(
  profile: SkinProfile,
  product: Product,
  pricePreference: number = 50
): ProductMatch {
  const membership = calculateFuzzyMembership(profile);

  // Hydration match
  const needsMoisture = membership.dry;
  const hasHydration = product.benefits.some(b => 
    b.toLowerCase().includes('hydrat') || b.toLowerCase().includes('moistur')
  ) ? 1 : 0.3;
  const hydrationMatch = 1 - Math.abs(needsMoisture - hasHydration);

  // Oiliness match
  const needsOilControl = membership.oily;
  const hasOilControl = product.benefits.some(b => 
    b.toLowerCase().includes('oil') || b.toLowerCase().includes('mattif')
  ) ? 1 : 0.3;
  const oilinessMatch = 1 - Math.abs(needsOilControl - hasOilControl);

  // Sensitivity match - check for harsh ingredients
  const harshIngredients = ['fragrance', 'alcohol', 'sulfate', 'paraben'];
  const hasHarshIngredients = product.ingredients.some(ing =>
    harshIngredients.some(harsh => ing.toLowerCase().includes(harsh))
  );
  const sensitivityMatch = membership.sensitive > 0.6 && hasHarshIngredients ? 0.2 : 0.9;

  // Acne match
  const needsAcneTreatment = membership.acneProne;
  const hasAcneTreatment = product.benefits.some(b => 
    b.toLowerCase().includes('acne') || b.toLowerCase().includes('blemish')
  ) ? 1 : 0.3;
  const acneMatch = 1 - Math.abs(needsAcneTreatment - hasAcneTreatment);

  // Ingredient safety score
  const ingredientSafety = hasHarshIngredients ? 0.5 : 1;

  // Price match (fuzzy preference)
  const priceMatch = 1 - Math.abs(pricePreference - (product.price / 100)) / 100;

  // Weighted fuzzy aggregation
  const matchScore = (
    hydrationMatch * 0.25 +
    oilinessMatch * 0.2 +
    sensitivityMatch * 0.25 +
    acneMatch * 0.15 +
    ingredientSafety * 0.1 +
    priceMatch * 0.05
  );

  return {
    product,
    matchScore: Math.max(0, Math.min(1, matchScore)),
    factors: {
      hydrationMatch,
      oilinessMatch,
      sensitivityMatch,
      acneMatch,
      ingredientSafety,
    },
  };
}

// Generate personalized routine with fuzzy suitability
export function generateRoutine(profile: SkinProfile, products: Product[]): {
  step: string;
  product: Product | null;
  suitability: number;
  frequency: string;
}[] {
  const productMatches = products.map(p => calculateProductMatch(profile, p));
  
  const steps = [
    { step: 'Cleanser', category: 'cleanser', threshold: 0.7 },
    { step: 'Toner', category: 'toner', threshold: 0.6 },
    { step: 'Serum', category: 'serum', threshold: 0.8 },
    { step: 'Moisturizer', category: 'moisturizer', threshold: 0.7 },
    { step: 'Sunscreen', category: 'sunscreen', threshold: 0.9 },
  ];

  return steps.map(({ step, category, threshold }) => {
    const match = productMatches
      .filter(m => m.product.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => b.matchScore - a.matchScore)[0];

    const suitability = match?.matchScore || 0;
    
    let frequency = 'daily';
    if (suitability < 0.5) frequency = 'avoid';
    else if (suitability < 0.7) frequency = 'occasionally';
    else if (suitability < 0.85) frequency = 'regularly';

    return {
      step,
      product: match?.product || null,
      suitability,
      frequency,
    };
  });
}

// Analyze ingredient suitability
export function analyzeIngredientSuitability(
  ingredients: string[],
  profile: SkinProfile
): { ingredient: string; suitability: number; reason: string }[] {
  const membership = calculateFuzzyMembership(profile);

  const ingredientRules: Record<string, (m: FuzzyMembership) => { score: number; reason: string }> = {
    'hyaluronic acid': (m) => ({
      score: m.dry * 0.9 + 0.1,
      reason: m.dry > 0.6 ? 'Excellent for dry skin hydration' : 'Good general hydrator',
    }),
    'salicylic acid': (m) => ({
      score: m.acneProne * 0.8 + (1 - m.sensitive) * 0.2,
      reason: m.acneProne > 0.6 ? 'Great for acne-prone skin' : m.sensitive > 0.6 ? 'May irritate sensitive skin' : 'Mild exfoliant',
    }),
    'niacinamide': (m) => ({
      score: 0.9,
      reason: 'Universal ingredient, suits all skin types',
    }),
    'fragrance': (m) => ({
      score: Math.max(0, 1 - m.sensitive),
      reason: m.sensitive > 0.6 ? 'Not recommended for sensitive skin' : 'Generally safe',
    }),
    'retinol': (m) => ({
      score: (1 - m.sensitive) * 0.8,
      reason: m.sensitive > 0.5 ? 'May cause irritation' : 'Powerful anti-aging ingredient',
    }),
    'vitamin c': (m) => ({
      score: 0.85,
      reason: 'Excellent antioxidant for brightening',
    }),
  };

  return ingredients.map(ingredient => {
    const ingredientLower = ingredient.toLowerCase();
    const rule = Object.entries(ingredientRules).find(([key]) => 
      ingredientLower.includes(key)
    );

    if (rule) {
      const result = rule[1](membership);
      return {
        ingredient,
        suitability: result.score,
        reason: result.reason,
      };
    }

    return {
      ingredient,
      suitability: 0.7,
      reason: 'Common skincare ingredient',
    };
  });
}

// Fuzzy sentiment analysis for reviews
export function analyzeFuzzySentiment(
  review: string,
  skinType: string
): { sentiment: number; confidence: number } {
  const positiveWords = ['love', 'amazing', 'great', 'excellent', 'perfect', 'wonderful', 'best'];
  const negativeWords = ['hate', 'terrible', 'bad', 'worst', 'awful', 'disappointing'];
  
  const reviewLower = review.toLowerCase();
  const positiveCount = positiveWords.filter(w => reviewLower.includes(w)).length;
  const negativeCount = negativeWords.filter(w => reviewLower.includes(w)).length;
  
  const sentimentScore = (positiveCount - negativeCount) / (positiveCount + negativeCount + 1);
  const normalizedSentiment = (sentimentScore + 1) / 2; // 0 to 1
  
  // Confidence based on review length and keyword density
  const wordCount = review.split(' ').length;
  const confidence = Math.min(1, (positiveCount + negativeCount) / 5 + wordCount / 100);
  
  return {
    sentiment: normalizedSentiment,
    confidence: Math.max(0.3, Math.min(1, confidence)),
  };
}
