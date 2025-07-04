
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
      style: styleScore,
      color: colorScore,
      activities: activityScore,
      price: priceScore
    }
  };
};

const calculateStyleMatch = (apartment: Apartment, userStyles: string[]): number => {
  const apartmentStyleMap: { [key: string]: string[] } = {
    'Urban Sanctuary': ['modern', 'industrial', 'minimalist'],
    'Zen Retreat': ['minimalist', 'scandinavian', 'modern'],
    'Creative Haven': ['bohemian', 'eclectic', 'artistic'],
    'Cozy Comfort': ['cozy', 'traditional', 'warm'],
    'Industrial Chic': ['industrial', 'modern', 'urban']
  };

  const apartmentStyles = apartmentStyleMap[apartment.vibe] || [];
  const matches = userStyles.filter(style => apartmentStyles.includes(style)).length;
  
  return Math.min(100, Math.round((matches / Math.max(userStyles.length, 1)) * 100));
};

const calculateColorMatch = (apartment: Apartment, userColors: string[]): number => {
  const apartmentColorMap: { [key: string]: string[] } = {
    'Urban Sanctuary': ['cool', 'neutral'],
    'Zen Retreat': ['neutral', 'cool'],
    'Creative Haven': ['warm', 'bold', 'earth'],
    'Cozy Comfort': ['warm', 'earth'],
    'Industrial Chic': ['neutral', 'cool']
  };

  const apartmentColors = apartmentColorMap[apartment.vibe] || [];
  const matches = userColors.filter(color => apartmentColors.includes(color)).length;
  
  return Math.min(100, Math.round((matches / Math.max(userColors.length, 1)) * 100));
};

const calculateActivityMatch = (apartment: Apartment, userActivities: string[]): number => {
  const apartmentActivityMap: { [key: string]: string[] } = {
    'Urban Sanctuary': ['working', 'entertaining', 'relaxing'],
    'Zen Retreat': ['relaxing', 'exercising', 'reading'],
    'Creative Haven': ['working', 'entertaining', 'cooking'],
    'Cozy Comfort': ['reading', 'relaxing', 'cooking'],
    'Industrial Chic': ['working', 'entertaining', 'exercising']
  };

  const apartmentActivities = apartmentActivityMap[apartment.vibe] || [];
  const matches = userActivities.filter(activity => apartmentActivities.includes(activity)).length;
  
  return Math.min(100, Math.round((matches / Math.max(userActivities.length, 1)) * 100));
};

const calculatePriceMatch = (apartmentPrice: number, priceRange: [number, number]): number => {
  const [min, max] = priceRange;
  
  if (apartmentPrice >= min && apartmentPrice <= max) {
    return 100;
  } else if (apartmentPrice < min) {
    const diff = min - apartmentPrice;
    return Math.max(0, 100 - (diff / min) * 100);
  } else {
    const diff = apartmentPrice - max;
    return Math.max(0, 100 - (diff / max) * 100);
  }
};
