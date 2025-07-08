
import { Apartment } from '@/pages/Index';

// Sample property database - you can expand this with more properties
export const sampleProperties: Apartment[] = [
  {
    id: 'apt-001',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448076-bb485b4e1ba5?w=800&h=600&fit=crop'
    ],
    title: 'Modern Minimalist Loft',
    location: 'District 1, Ho Chi Minh City',
    price: 2500,
    size: '1200 sq ft',
    vibe: 'Modern Minimalist',
    description: 'A stunning modern loft with floor-to-ceiling windows, hardwood floors, and an open-concept design. Perfect for young professionals who appreciate clean lines and contemporary living.',
    highlights: ['Floor-to-ceiling windows', 'Hardwood floors', 'Open concept', 'Modern kitchen', 'Rooftop access'],
    realtor: {
      id: 'realtor-001',
      name: 'Sarah Chen',
      phone: '+84 90 123 4567',
      email: 'sarah.chen@realty.com'
    }
  },
  {
    id: 'apt-002',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop'
    ],
    title: 'Cozy Garden Apartment',
    location: 'Ba Dinh, Hanoi',
    price: 1800,
    size: '900 sq ft',
    vibe: 'Cozy Traditional',
    description: 'A charming apartment with a private garden view, warm wood accents, and traditional Vietnamese architectural elements. Ideal for those who love a homey atmosphere.',
    highlights: ['Private garden view', 'Traditional design', 'Natural lighting', 'Quiet neighborhood'],
    realtor: {
      id: 'realtor-002',
      name: 'Minh Nguyen',
      phone: '+84 91 234 5678',
      email: 'minh.nguyen@homes.vn'
    }
  },
  {
    id: 'apt-003',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218854-f5132d0a2fef?w=800&h=600&fit=crop'
    ],
    title: 'Beachfront Studio',
    location: 'Hai Chau, Da Nang',
    price: 1200,
    size: '600 sq ft',
    vibe: 'Bohemian Eclectic',
    description: 'A vibrant studio apartment just steps from the beach, featuring colorful decor, artistic touches, and a relaxed coastal vibe perfect for creative souls.',
    highlights: ['Beachfront location', 'Colorful decor', 'Ocean view', 'Creative space', 'Balcony'],
    realtor: {
      id: 'realtor-003',
      name: 'Thao Pham',
      phone: '+84 92 345 6789',
      email: 'thao.pham@coastal.com'
    }
  }
];

// Function to add new properties to the database
export const addProperty = (property: Omit<Apartment, 'id'>) => {
  const newProperty: Apartment = {
    ...property,
    id: `apt-${Date.now()}`
  };
  
  sampleProperties.push(newProperty);
  return newProperty;
};

// Function to get properties by location
export const getPropertiesByLocation = (location: string) => {
  return sampleProperties.filter(property => 
    property.location.toLowerCase().includes(location.toLowerCase())
  );
};

// Function to get properties by price range
export const getPropertiesByPriceRange = (min: number, max: number) => {
  return sampleProperties.filter(property => 
    property.price >= min && property.price <= max
  );
};
