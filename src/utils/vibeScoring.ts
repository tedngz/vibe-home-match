
import { UserPreferences, Apartment } from '@/pages/Index';

export interface VibeScore {
  overall: number;
  breakdown: {
    style: number;
    color: number;
    activities: number;
    price: number;
  };
}

export const calculateVibeScore = (apartment: Apartment, preferences: UserPreferences): VibeScore => {
  // Style matching (40% weight)
  const styleScore = calculateStyleMatch(apartment, preferences.styles);
  
  // Color matching (25% weight)
  const colorScore = calculateColorMatch(apartment, preferences.colors);
  
  // Activities matching (25% weight)
  const activityScore = calculateActivityMatch(apartment, preferences.activities);
  
  // Price matching (10% weight)
  const priceScore = calculatePriceMatch(apartment.price, preferences.priceRange);
  
  const overall = Math.round(
    styleScore * 0.4 + 
    colorScore * 0.25 + 
    activityScore * 0.25 + 
    priceScore * 0.1
  );

  return {
    overall,
    breakdown: {
      style: Math.round(styleScore),
      color: Math.round(colorScore),
      activities: Math.round(activityScore),
      price: Math.round(priceScore)
    }
  };
};

const calculateStyleMatch = (apartment: Apartment, userStyles: string[]): number => {
  const apartmentStyleMap: { [key: string]: string[] } = {
    'Modern Minimalist': ['modern', 'minimalist', 'clean', 'sleek'],
    'Urban Sanctuary': ['modern', 'urban', 'sophisticated', 'industrial'],
    'Creative Haven': ['bohemian', 'eclectic', 'artistic', 'creative'],
    'Cozy Traditional': ['cozy', 'traditional', 'warm', 'family'],
    'Industrial Chic': ['industrial', 'modern', 'urban', 'edgy'],
    'Bohemian Eclectic': ['bohemian', 'eclectic', 'colorful', 'artistic'],
    'Zen Retreat': ['minimalist', 'peaceful', 'clean', 'serene']
  };

  const apartmentStyles = apartmentStyleMap[apartment.vibe] || [];
  let matchScore = 0;
  
  // Calculate matches between user preferences and apartment style
  userStyles.forEach(userStyle => {
    if (apartmentStyles.includes(userStyle)) {
      matchScore += 25; // Each match adds 25 points
    }
  });
  
  // Add base score based on vibe compatibility
  if (apartmentStyles.length > 0) {
    matchScore += 30; // Base compatibility score
  }
  
  return Math.min(100, matchScore);
};

const calculateColorMatch = (apartment: Apartment, userColors: string[]): number => {
  const apartmentColorMap: { [key: string]: string[] } = {
    'Modern Minimalist': ['neutral', 'cool', 'white'],
    'Urban Sanctuary': ['neutral', 'cool', 'grey'],
    'Creative Haven': ['warm', 'bold', 'colorful'],
    'Cozy Traditional': ['warm', 'earth', 'brown'],
    'Industrial Chic': ['neutral', 'cool', 'metal'],
    'Bohemian Eclectic': ['warm', 'bold', 'colorful'],
    'Zen Retreat': ['neutral', 'earth', 'natural']
  };

  const apartmentColors = apartmentColorMap[apartment.vibe] || [];
  let matchScore = 0;
  
  userColors.forEach(userColor => {
    if (apartmentColors.includes(userColor)) {
      matchScore += 25; // Each match adds 25 points
    }
  });
  
  // Add base score
  if (apartmentColors.length > 0) {
    matchScore += 25; // Base color compatibility
  }
  
  return Math.min(100, matchScore);
};

const calculateActivityMatch = (apartment: Apartment, userActivities: string[]): number => {
  const apartmentActivityMap: { [key: string]: string[] } = {
    'Modern Minimalist': ['working', 'reading', 'relaxing'],
    'Urban Sanctuary': ['working', 'entertaining', 'exercising'],
    'Creative Haven': ['working', 'creating', 'entertaining'],
    'Cozy Traditional': ['reading', 'relaxing', 'cooking', 'family time'],
    'Industrial Chic': ['working', 'entertaining', 'exercising'],
    'Bohemian Eclectic': ['creating', 'entertaining', 'relaxing'],
    'Zen Retreat': ['relaxing', 'exercising', 'reading', 'meditating']
  };

  const apartmentActivities = apartmentActivityMap[apartment.vibe] || [];
  let matchScore = 0;
  
  userActivities.forEach(userActivity => {
    if (apartmentActivities.includes(userActivity)) {
      matchScore += 25; // Each match adds 25 points
    }
  });
  
  // Add base score
  if (apartmentActivities.length > 0) {
    matchScore += 25; // Base activity compatibility
  }
  
  return Math.min(100, matchScore);
};

const calculatePriceMatch = (apartmentPrice: number, priceRange: [number, number]): number => {
  const [min, max] = priceRange;
  
  if (apartmentPrice >= min && apartmentPrice <= max) {
    return 100; // Perfect match if within range
  } else if (apartmentPrice < min) {
    // If cheaper than preferred, still good but not perfect
    const diff = min - apartmentPrice;
    return Math.max(60, 100 - (diff / min) * 40);
  } else {
    // If more expensive than preferred, penalize more
    const diff = apartmentPrice - max;
    return Math.max(20, 100 - (diff / max) * 80);
  }
};
