
import { Apartment } from '@/pages/Index';

// Expanded property database with 50 diverse apartments
export const sampleProperties: Apartment[] = [
  // HO CHI MINH CITY - DISTRICT 1 (Business/Modern)
  {
    id: 'apt-001',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448076-bb485b4e1ba5?w=800&h=600&fit=crop'
    ],
    title: 'Luxury Business Loft',
    location: 'District 1, Ho Chi Minh City',
    price: 25000000,
    size: '120 sqm',
    vibe: 'Modern Minimalist',
    description: 'A stunning modern loft with floor-to-ceiling windows, hardwood floors, and an open-concept design. Perfect for young professionals who appreciate clean lines and contemporary living in the heart of the business district.',
    highlights: ['Floor-to-ceiling windows', 'Hardwood floors', 'Open concept', 'Modern kitchen', 'Rooftop access', 'Business district location'],
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
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492552-938632515f1b?w=800&h=600&fit=crop'
    ],
    title: 'Executive Studio Downtown',
    location: 'District 1, Ho Chi Minh City',
    price: 18000000,
    size: '80 sqm',
    vibe: 'Urban Sanctuary',
    description: 'Sleek studio apartment designed for busy executives. Features industrial elements with modern comfort, perfect for those who work hard and appreciate sophisticated urban living.',
    highlights: ['Executive workspace', 'Industrial design', 'High-speed internet', 'Gym access', '24/7 security'],
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
    title: 'Minimalist City Penthouse',
    location: 'District 1, Ho Chi Minh City',
    price: 45000000,
    size: '200 sqm',
    vibe: 'Modern Minimalist',
    description: 'Ultra-modern penthouse with breathtaking city views. Clean lines, neutral colors, and premium finishes create the perfect minimalist sanctuary above the bustling city.',
    highlights: ['City skyline views', 'Premium finishes', 'Smart home system', 'Private elevator', 'Rooftop terrace'],
    realtor: {
      id: 'realtor-003',
      name: 'Thao Pham',
      phone: '+84 92 345 6789',
      email: 'thao.pham@coastal.com'
    }
  },

  // HO CHI MINH CITY - DISTRICT 3 (Creative/Artistic)
  {
    id: 'apt-004',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop'
    ],
    title: 'Artist Loft with Gallery Space',
    location: 'District 3, Ho Chi Minh City',
    price: 22000000,
    size: '150 sqm',
    vibe: 'Creative Haven',
    description: 'Spacious loft perfect for artists and creatives. High ceilings, exposed brick walls, and abundant natural light create an inspiring workspace and living area.',
    highlights: ['High ceilings', 'Exposed brick', 'Natural light', 'Gallery space', 'Creative community'],
    realtor: {
      id: 'realtor-004',
      name: 'Van Le',
      phone: '+84 93 456 7890',
      email: 'van.le@creative.vn'
    }
  },
  {
    id: 'apt-005',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
    ],
    title: 'Bohemian Studio Haven',
    location: 'District 3, Ho Chi Minh City',
    price: 15000000,
    size: '75 sqm',
    vibe: 'Bohemian Eclectic',
    description: 'Colorful and eclectic studio filled with character. Perfect for free spirits who love bold colors, vintage furniture, and artistic expression.',
    highlights: ['Colorful decor', 'Vintage furniture', 'Art studio space', 'Balcony garden', 'Artistic neighborhood'],
    realtor: {
      id: 'realtor-005',
      name: 'Linh Tran',
      phone: '+84 94 567 8901',
      email: 'linh.tran@artliving.com'
    }
  },

  // HO CHI MINH CITY - DISTRICT 7 (Modern/Family)
  {
    id: 'apt-006',
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    title: 'Modern Family Apartment',
    location: 'District 7, Ho Chi Minh City',
    price: 28000000,
    size: '180 sqm',
    vibe: 'Cozy Traditional',
    description: 'Spacious family apartment with modern amenities and traditional touches. Perfect for families who want comfort, space, and a sense of home.',
    highlights: ['Family-friendly', 'Modern kitchen', 'Play area', 'Garden view', 'International school nearby'],
    realtor: {
      id: 'realtor-006',
      name: 'Duc Pham',
      phone: '+84 95 678 9012',
      email: 'duc.pham@family.vn'
    }
  },
  {
    id: 'apt-007',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
    ],
    title: 'Luxury Riverside Condo',
    location: 'District 7, Ho Chi Minh City',
    price: 38000000,
    size: '220 sqm',
    vibe: 'Urban Sanctuary',
    description: 'Premium riverside condominium with stunning river views. Modern luxury meets tranquil living in this sophisticated urban retreat.',
    highlights: ['River views', 'Premium finishes', 'Swimming pool', 'Concierge service', 'Riverside walking path'],
    realtor: {
      id: 'realtor-007',
      name: 'Mai Vo',
      phone: '+84 96 789 0123',
      email: 'mai.vo@luxury.com'
    }
  },

  // HANOI - BA DINH (Traditional/Government)
  {
    id: 'apt-008',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505692952-eb321d6e1178?w=800&h=600&fit=crop'
    ],
    title: 'Traditional Vietnamese Villa',
    location: 'Ba Dinh, Hanoi',
    price: 32000000,
    size: '250 sqm',
    vibe: 'Cozy Traditional',
    description: 'Beautiful traditional Vietnamese architecture with modern comforts. Perfect for those who appreciate cultural heritage and timeless design.',
    highlights: ['Traditional architecture', 'Private garden', 'Wooden details', 'Cultural area', 'Government district'],
    realtor: {
      id: 'realtor-008',
      name: 'Hien Nguyen',
      phone: '+84 97 890 1234',
      email: 'hien.nguyen@heritage.vn'
    }
  },
  {
    id: 'apt-009',
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567767202311-cfd0e8b23cf9?w=800&h=600&fit=crop'
    ],
    title: 'Government Quarter Apartment',
    location: 'Ba Dinh, Hanoi',
    price: 20000000,
    size: '120 sqm',
    vibe: 'Zen Retreat',
    description: 'Peaceful apartment in the government quarter. Clean, organized, and serene - perfect for those who value order and tranquility.',
    highlights: ['Peaceful location', 'Government area', 'Clean design', 'Good transport', 'Safe neighborhood'],
    realtor: {
      id: 'realtor-009',
      name: 'Quan Do',
      phone: '+84 98 901 2345',
      email: 'quan.do@capital.vn'
    }
  },

  // HANOI - HOAN KIEM (Historic/Central)
  {
    id: 'apt-010',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'
    ],
    title: 'Historic Old Quarter Loft',
    location: 'Hoan Kiem, Hanoi',
    price: 24000000,
    size: '100 sqm',
    vibe: 'Creative Haven',
    description: 'Charming loft in the heart of Hanoi\'s Old Quarter. Blend of historic character with modern amenities, perfect for those who love culture and history.',
    highlights: ['Historic location', 'Cultural sites nearby', 'Traditional markets', 'Tourist attractions', 'Authentic Hanoi experience'],
    realtor: {
      id: 'realtor-010',
      name: 'Lan Hoang',
      phone: '+84 99 012 3456',
      email: 'lan.hoang@oldquarter.vn'
    }
  },

  // HANOI - DONG DA (Academic/Intellectual)
  {
    id: 'apt-011',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ],
    title: 'University Area Study Apartment',
    location: 'Dong Da, Hanoi',
    price: 16000000,
    size: '85 sqm',
    vibe: 'Zen Retreat',
    description: 'Perfect for students and academics. Quiet, well-organized space with dedicated study areas and close to major universities.',
    highlights: ['Study-friendly', 'University nearby', 'Quiet environment', 'Good lighting', 'Academic community'],
    realtor: {
      id: 'realtor-011',
      name: 'Thu Pham',
      phone: '+84 90 123 4567',
      email: 'thu.pham@academic.vn'
    }
  },
  {
    id: 'apt-012',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop'
    ],
    title: 'Intellectual\'s Sanctuary',
    location: 'Dong Da, Hanoi',
    price: 19000000,
    size: '95 sqm',
    vibe: 'Modern Minimalist',
    description: 'Clean, minimalist design perfect for focused thinking and intellectual pursuits. Surrounded by universities and cultural institutions.',
    highlights: ['Minimalist design', 'Home library', 'Quiet study nooks', 'Cultural institutions nearby', 'Intellectual community'],
    realtor: {
      id: 'realtor-012',
      name: 'Hoa Le',
      phone: '+84 91 234 5678',
      email: 'hoa.le@intellectual.vn'
    }
  },

  // DA NANG - HAI CHAU (Beach/Central)
  {
    id: 'apt-013',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    title: 'Beachfront Paradise',
    location: 'Hai Chau, Da Nang',
    price: 26000000,
    size: '140 sqm',
    vibe: 'Bohemian Eclectic',
    description: 'Wake up to ocean views every day in this vibrant beachfront apartment. Colorful, relaxed atmosphere perfect for beach lovers and free spirits.',
    highlights: ['Ocean views', 'Beach access', 'Colorful decor', 'Surfboard storage', 'Beach lifestyle'],
    realtor: {
      id: 'realtor-013',
      name: 'Nam Tran',
      phone: '+84 92 345 6789',
      email: 'nam.tran@beachlife.vn'
    }
  },
  {
    id: 'apt-014',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&h=600&fit=crop'
    ],
    title: 'Modern Coastal Living',
    location: 'Hai Chau, Da Nang',
    price: 21000000,
    size: '110 sqm',
    vibe: 'Urban Sanctuary',
    description: 'Contemporary apartment with coastal influences. Perfect blend of modern comfort and beachside relaxation in the heart of Da Nang.',
    highlights: ['Modern design', 'Coastal views', 'Beach nearby', 'City center', 'Restaurants walking distance'],
    realtor: {
      id: 'realtor-014',
      name: 'Vy Nguyen',
      phone: '+84 93 456 7890',
      email: 'vy.nguyen@coastal.com'
    }
  },

  // DA NANG - SON TRA (Nature/Luxury)
  {
    id: 'apt-015',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop'
    ],
    title: 'Mountain View Retreat',
    location: 'Son Tra, Da Nang',
    price: 29000000,
    size: '160 sqm',
    vibe: 'Zen Retreat',
    description: 'Serene apartment nestled in the mountains with breathtaking views. Perfect for those seeking peace, nature, and spiritual tranquility.',
    highlights: ['Mountain views', 'Nature trails', 'Peaceful setting', 'Fresh air', 'Spiritual retreats nearby'],
    realtor: {
      id: 'realtor-015',
      name: 'Phong Vo',
      phone: '+84 94 567 8901',
      email: 'phong.vo@mountain.vn'
    }
  },
  {
    id: 'apt-016',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218854-f5132d0a2fef?w=800&h=600&fit=crop'
    ],
    title: 'Luxury Peninsula Villa',
    location: 'Son Tra, Da Nang',
    price: 42000000,
    size: '280 sqm',
    vibe: 'Modern Minimalist',
    description: 'Exclusive villa on the Son Tra Peninsula. Ultra-modern design with panoramic ocean and mountain views for the most discerning residents.',
    highlights: ['Peninsula location', 'Panoramic views', 'Luxury finishes', 'Private pool', 'Exclusive community'],
    realtor: {
      id: 'realtor-016',
      name: 'Khanh Dang',
      phone: '+84 95 678 9012',
      email: 'khanh.dang@luxury.vn'
    }
  },

  // DA NANG - NGU HANH SON (Spiritual/Cultural)
  {
    id: 'apt-017',
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567767202311-cfd0e8b23cf9?w=800&h=600&fit=crop'
    ],
    title: 'Marble Mountains Sanctuary',
    location: 'Ngu Hanh Son, Da Nang',
    price: 23000000,
    size: '130 sqm',
    vibe: 'Zen Retreat',
    description: 'Peaceful apartment near the famous Marble Mountains. Perfect for meditation, spiritual practice, and those seeking inner peace.',
    highlights: ['Marble Mountains nearby', 'Meditation spaces', 'Spiritual community', 'Traditional architecture', 'Cultural sites'],
    realtor: {
      id: 'realtor-017',
      name: 'An Pham',
      phone: '+84 96 789 0123',
      email: 'an.pham@spiritual.vn'
    }
  },

  // Additional apartments across all cities to reach 50
  {
    id: 'apt-018',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop'
    ],
    title: 'Industrial Chic Loft',
    location: 'District 1, Ho Chi Minh City',
    price: 27000000,
    size: '135 sqm',
    vibe: 'Industrial Chic',
    description: 'Raw industrial elements meet modern comfort. Exposed pipes, concrete floors, and steel beams create an urban aesthetic perfect for modern professionals.',
    highlights: ['Industrial design', 'Exposed elements', 'Modern amenities', 'Urban location', 'Professional community'],
    realtor: {
      id: 'realtor-018',
      name: 'Hai Tran',
      phone: '+84 97 890 1234',
      email: 'hai.tran@industrial.vn'
    }
  },
  {
    id: 'apt-019',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    ],
    title: 'Creative Studio Space',
    location: 'District 3, Ho Chi Minh City',
    price: 17000000,
    size: '90 sqm',
    vibe: 'Creative Haven',
    description: 'Bright, inspiring space perfect for artists, designers, and creative professionals. High ceilings and abundant natural light fuel creativity.',
    highlights: ['Creative workspace', 'High ceilings', 'Natural light', 'Artist community', 'Gallery nearby'],
    realtor: {
      id: 'realtor-019',
      name: 'Thuy Vo',
      phone: '+84 98 901 2345',
      email: 'thuy.vo@creative.com'
    }
  },
  {
    id: 'apt-020',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
    ],
    title: 'Family Garden Apartment',
    location: 'District 7, Ho Chi Minh City',
    price: 30000000,
    size: '200 sqm',
    vibe: 'Cozy Traditional',
    description: 'Spacious family home with private garden. Traditional Vietnamese elements create a warm, welcoming environment for families.',
    highlights: ['Private garden', 'Family-friendly', 'Traditional design', 'Safe neighborhood', 'Schools nearby'],
    realtor: {
      id: 'realtor-020',
      name: 'Long Nguyen',
      phone: '+84 99 012 3456',
      email: 'long.nguyen@family.vn'
    }
  },

  // Continue with more apartments...
  {
    id: 'apt-021',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop'
    ],
    title: 'Heritage Courtyard House',
    location: 'Ba Dinh, Hanoi',
    price: 35000000,
    size: '180 sqm',
    vibe: 'Cozy Traditional',
    description: 'Traditional Vietnamese courtyard house lovingly restored. Perfect for those who appreciate cultural heritage and authentic living.',
    highlights: ['Traditional courtyard', 'Heritage building', 'Cultural significance', 'Authentic design', 'Historic neighborhood'],
    realtor: {
      id: 'realtor-021',
      name: 'Binh Le',
      phone: '+84 90 123 4567',
      email: 'binh.le@heritage.vn'
    }
  },
  {
    id: 'apt-022',
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=600&fit=crop'
    ],
    title: 'Minimalist Lake View',
    location: 'Hoan Kiem, Hanoi',
    price: 26000000,
    size: '110 sqm',
    vibe: 'Modern Minimalist',
    description: 'Clean, minimalist apartment overlooking Hoan Kiem Lake. Perfect for those who appreciate simplicity and iconic city views.',
    highlights: ['Lake views', 'Minimalist design', 'City center', 'Historic area', 'Cultural attractions'],
    realtor: {
      id: 'realtor-022',
      name: 'Tam Hoang',
      phone: '+84 91 234 5678',
      email: 'tam.hoang@lakeside.vn'
    }
  },
  {
    id: 'apt-023',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'
    ],
    title: 'Student Friendly Apartment',
    location: 'Dong Da, Hanoi',
    price: 12000000,
    size: '60 sqm',
    vibe: 'Zen Retreat',
    description: 'Affordable, well-designed space perfect for students. Clean, organized, and conducive to study and personal growth.',
    highlights: ['Student-friendly', 'Affordable', 'Study areas', 'University nearby', 'Good transport'],
    realtor: {
      id: 'realtor-023',
      name: 'Dung Pham',
      phone: '+84 92 345 6789',
      email: 'dung.pham@student.vn'
    }
  },
  {
    id: 'apt-024',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    title: 'Beachside Bohemian Bungalow',
    location: 'Hai Chau, Da Nang',
    price: 19000000,
    size: '95 sqm',
    vibe: 'Bohemian Eclectic',
    description: 'Colorful beachside living with artistic flair. Perfect for free spirits who love the ocean, art, and unconventional living.',
    highlights: ['Beach access', 'Artistic decor', 'Bohemian style', 'Ocean breeze', 'Surf culture'],
    realtor: {
      id: 'realtor-024',
      name: 'Duc Tran',
      phone: '+84 93 456 7890',
      email: 'duc.tran@beach.vn'
    }
  },
  {
    id: 'apt-025',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    title: 'Mountain Zen Hideaway',
    location: 'Son Tra, Da Nang',
    price: 24000000,
    size: '120 sqm',
    vibe: 'Zen Retreat',
    description: 'Peaceful mountain retreat designed for meditation and inner reflection. Surrounded by nature and tranquility.',
    highlights: ['Mountain setting', 'Meditation space', 'Nature views', 'Peaceful environment', 'Spiritual community'],
    realtor: {
      id: 'realtor-025',
      name: 'Linh Vo',
      phone: '+84 94 567 8901',
      email: 'linh.vo@zen.vn'
    }
  },

  // More budget-friendly options
  {
    id: 'apt-026',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
    ],
    title: 'Affordable Modern Studio',
    location: 'District 3, Ho Chi Minh City',
    price: 11000000,
    size: '45 sqm',
    vibe: 'Modern Minimalist',
    description: 'Compact but well-designed studio perfect for young professionals starting their career. Modern amenities at an affordable price.',
    highlights: ['Affordable', 'Modern design', 'Efficient layout', 'Young professional area', 'Good transport'],
    realtor: {
      id: 'realtor-026',
      name: 'Ha Nguyen',
      phone: '+84 95 678 9012',
      email: 'ha.nguyen@affordable.vn'
    }
  },
  {
    id: 'apt-027',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop'
    ],
    title: 'Cozy Budget Apartment',
    location: 'Dong Da, Hanoi',
    price: 10000000,
    size: '50 sqm',
    vibe: 'Cozy Traditional',
    description: 'Small but cozy apartment perfect for students or young professionals. Traditional touches make it feel like home.',
    highlights: ['Budget-friendly', 'Cozy atmosphere', 'Student area', 'Traditional elements', 'Community feel'],
    realtor: {
      id: 'realtor-027',
      name: 'Tuan Le',
      phone: '+84 96 789 0123',
      email: 'tuan.le@budget.vn'
    }
  },
  {
    id: 'apt-028',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    title: 'Beach Budget Studio',
    location: 'Hai Chau, Da Nang',
    price: 13000000,
    size: '55 sqm',
    vibe: 'Bohemian Eclectic',
    description: 'Affordable beachside living with character. Perfect for beach lovers on a budget who still want style and proximity to the ocean.',
    highlights: ['Beach nearby', 'Affordable', 'Character-filled', 'Artistic touches', 'Beach lifestyle'],
    realtor: {
      id: 'realtor-028',
      name: 'Huy Pham',
      phone: '+84 97 890 1234',
      email: 'huy.pham@beachbudget.vn'
    }
  },

  // High-end luxury options
  {
    id: 'apt-029',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    ],
    title: 'Luxury Skyline Penthouse',
    location: 'District 1, Ho Chi Minh City',
    price: 55000000,
    size: '300 sqm',
    vibe: 'Urban Sanctuary',
    description: 'Ultimate luxury penthouse with 360-degree city views. Premium finishes and world-class amenities for the most discerning residents.',
    highlights: ['360-degree views', 'Luxury finishes', 'Premium amenities', 'Concierge service', 'Private elevator'],
    realtor: {
      id: 'realtor-029',
      name: 'Khang Vo',
      phone: '+84 98 901 2345',
      email: 'khang.vo@ultralux.vn'
    }
  },
  {
    id: 'apt-030',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop'
    ],
    title: 'Presidential Villa',
    location: 'Ba Dinh, Hanoi',
    price: 60000000,
    size: '400 sqm',
    vibe: 'Cozy Traditional',
    description: 'Magnificent traditional villa fit for dignitaries. Combines historical significance with modern luxury in the heart of the capital.',
    highlights: ['Presidential area', 'Historical significance', 'Luxury amenities', 'Private grounds', 'Traditional architecture'],
    realtor: {
      id: 'realtor-030',
      name: 'Minh Hoang',
      phone: '+84 99 012 3456',
      email: 'minh.hoang@presidential.vn'
    }
  },

  // Continue with 20 more diverse apartments...
  {
    id: 'apt-031',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    title: 'Tech Professional Hub',
    location: 'District 7, Ho Chi Minh City',
    price: 33000000,
    size: '140 sqm',
    vibe: 'Modern Minimalist',
    description: 'State-of-the-art apartment designed for tech professionals. Smart home features and modern workspace integration.',
    highlights: ['Smart home tech', 'Home office', 'High-speed internet', 'Tech community', 'Modern amenities'],
    realtor: {
      id: 'realtor-031',
      name: 'Dat Nguyen',
      phone: '+84 90 123 4567',
      email: 'dat.nguyen@tech.vn'
    }
  },
  {
    id: 'apt-032',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    ],
    title: 'Artist Colony Loft',
    location: 'District 3, Ho Chi Minh City',
    price: 20000000,
    size: '115 sqm',
    vibe: 'Creative Haven',
    description: 'Part of a vibrant artist colony. High ceilings, studio space, and creative community make this perfect for artistic pursuits.',
    highlights: ['Artist colony', 'Studio space', 'Creative community', 'High ceilings', 'Gallery exhibitions'],
    realtor: {
      id: 'realtor-032',
      name: 'Phuong Le',
      phone: '+84 91 234 5678',
      email: 'phuong.le@artistcolony.vn'
    }
  },
  {
    id: 'apt-033',
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=600&fit=crop'
    ],
    title: 'Embassy Quarter Residence',
    location: 'Ba Dinh, Hanoi',
    price: 28000000,
    size: '150 sqm',
    vibe: 'Zen Retreat',
    description: 'Prestigious location near embassies. Quiet, secure, and refined living for diplomats and international professionals.',
    highlights: ['Embassy quarter', 'High security', 'International community', 'Prestigious location', 'Diplomatic services'],
    realtor: {
      id: 'realtor-033',
      name: 'Hung Dang',
      phone: '+84 92 345 6789',
      email: 'hung.dang@embassy.vn'
    }
  },
  {
    id: 'apt-034',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'
    ],
    title: 'Old Quarter Boutique',
    location: 'Hoan Kiem, Hanoi',
    price: 22000000,
    size: '80 sqm',
    vibe: 'Creative Haven',
    description: 'Boutique apartment in a restored colonial building. Perfect blend of history and modern comfort in the heart of old Hanoi.',
    highlights: ['Colonial building', 'Historic charm', 'Boutique design', 'Old Quarter location', 'Cultural immersion'],
    realtor: {
      id: 'realtor-034',
      name: 'Thao Le',
      phone: '+84 93 456 7890',
      email: 'thao.le@boutique.vn'
    }
  },
  {
    id: 'apt-035',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'
    ],
    title: 'Graduate Student Haven',
    location: 'Dong Da, Hanoi',
    price: 14000000,
    size: '70 sqm',
    vibe: 'Zen Retreat',
    description: 'Perfect for graduate students and researchers. Quiet study environment with all necessary amenities for academic success.',
    highlights: ['Graduate-friendly', 'Study environment', 'Library nearby', 'Research facilities', 'Academic community'],
    realtor: {
      id: 'realtor-035',
      name: 'Vy Tran',
      phone: '+84 94 567 8901',
      email: 'vy.tran@graduate.vn'
    }
  },
  {
    id: 'apt-036',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    title: 'Surfer\'s Paradise',
    location: 'Hai Chau, Da Nang',
    price: 17000000,
    size: '85 sqm',
    vibe: 'Bohemian Eclectic',
    description: 'Perfect for surf enthusiasts. Steps from the beach with board storage and a laid-back vibe that embodies the surf culture.',
    highlights: ['Beach access', 'Surfboard storage', 'Surf culture', 'Ocean views', 'Beach lifestyle'],
    realtor: {
      id: 'realtor-036',
      name: 'Tung Vo',
      phone: '+84 95 678 9012',
      email: 'tung.vo@surf.vn'
    }
  },
  {
    id: 'apt-037',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    title: 'Nature Lover\'s Retreat',
    location: 'Son Tra, Da Nang',
    price: 25000000,
    size: '130 sqm',
    vibe: 'Zen Retreat',
    description: 'Surrounded by pristine nature on the Son Tra Peninsula. Perfect for those seeking peace, tranquility, and connection with nature.',
    highlights: ['Nature setting', 'Hiking trails', 'Wildlife viewing', 'Peaceful environment', 'Eco-friendly'],
    realtor: {
      id: 'realtor-037',
      name: 'Huong Pham',
      phone: '+84 96 789 0123',
      email: 'huong.pham@nature.vn'
    }
  },
  {
    id: 'apt-038',
    images: [
      'https://images.unsplash.com/photo-1567767202311-cfd0e8b23cf9?w=800&h=600&fit=crop'
    ],
    title: 'Spiritual Sanctuary',
    location: 'Ngu Hanh Son, Da Nang',
    price: 21000000,
    size: '105 sqm',
    vibe: 'Zen Retreat',
    description: 'Near sacred pagodas and marble caves. Perfect for meditation, spiritual practice, and those seeking enlightenment.',
    highlights: ['Pagodas nearby', 'Meditation spaces', 'Spiritual community', 'Sacred sites', 'Inner peace'],
    realtor: {
      id: 'realtor-038',
      name: 'Duc Le',
      phone: '+84 97 890 1234',
      email: 'duc.le@spiritual.vn'
    }
  },

  // More mid-range options
  {
    id: 'apt-039',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
    ],
    title: 'Young Professional Condo',
    location: 'District 1, Ho Chi Minh City',
    price: 23000000,
    size: '95 sqm',
    vibe: 'Urban Sanctuary',
    description: 'Modern condo perfect for young professionals. Great amenities, central location, and professional community.',
    highlights: ['Professional community', 'Modern amenities', 'Central location', 'Gym access', 'Networking opportunities'],
    realtor: {
      id: 'realtor-039',
      name: 'Quan Hoang',
      phone: '+84 98 901 2345',
      email: 'quan.hoang@youngpro.vn'
    }
  },
  {
    id: 'apt-040',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop'
    ],
    title: 'Freelancer\'s Dream Space',
    location: 'District 3, Ho Chi Minh City',
    price: 18000000,
    size: '100 sqm',
    vibe: 'Creative Haven',
    description: 'Perfect for freelancers and remote workers. Inspiring space with dedicated work areas and creative community.',
    highlights: ['Work-friendly', 'Creative space', 'Freelancer community', 'Good internet', 'Inspiring environment'],
    realtor: {
      id: 'realtor-040',
      name: 'Linh Nguyen',
      phone: '+84 99 012 3456',
      email: 'linh.nguyen@freelance.vn'
    }
  },

  // Additional family-friendly options
  {
    id: 'apt-041',
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop'
    ],
    title: 'International Family Home',
    location: 'District 7, Ho Chi Minh City',
    price: 35000000,
    size: '220 sqm',
    vibe: 'Cozy Traditional',
    description: 'Spacious home perfect for international families. Close to international schools and expat community.',
    highlights: ['International schools', 'Expat community', 'Family amenities', 'Safe neighborhood', 'Cultural diversity'],
    realtor: {
      id: 'realtor-041',
      name: 'Mai Tran',
      phone: '+84 90 123 4567',
      email: 'mai.tran@international.vn'
    }
  },
  {
    id: 'apt-042',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop'
    ],
    title: 'Traditional Family Compound',
    location: 'Ba Dinh, Hanoi',
    price: 40000000,
    size: '250 sqm',
    vibe: 'Cozy Traditional',
    description: 'Large traditional compound perfect for multi-generation families. Authentic Vietnamese architecture with modern conveniences.',
    highlights: ['Multi-generation friendly', 'Traditional architecture', 'Large space', 'Family compound', 'Cultural heritage'],
    realtor: {
      id: 'realtor-042',
      name: 'Bao Vo',
      phone: '+84 91 234 5678',
      email: 'bao.vo@traditional.vn'
    }
  },

  // More unique options
  {
    id: 'apt-043',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'
    ],
    title: 'French Colonial Apartment',
    location: 'Hoan Kiem, Hanoi',
    price: 27000000,
    size: '125 sqm',
    vibe: 'Creative Haven',
    description: 'Beautiful French colonial architecture lovingly preserved. High ceilings, original details, and historical charm.',
    highlights: ['French colonial', 'Historical charm', 'High ceilings', 'Original details', 'Architectural significance'],
    realtor: {
      id: 'realtor-043',
      name: 'Thu Pham',
      phone: '+84 92 345 6789',
      email: 'thu.pham@colonial.vn'
    }
  },
  {
    id: 'apt-044',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'
    ],
    title: 'Academic\'s Study Retreat',
    location: 'Dong Da, Hanoi',
    price: 17000000,
    size: '90 sqm',
    vibe: 'Zen Retreat',
    description: 'Quiet, scholarly environment perfect for academic work. Surrounded by universities and intellectual community.',
    highlights: ['Academic environment', 'Quiet study spaces', 'University access', 'Scholarly community', 'Research facilities'],
    realtor: {
      id: 'realtor-044',
      name: 'Hoa Dang',
      phone: '+84 93 456 7890',
      email: 'hoa.dang@academic.vn'
    }
  },
  {
    id: 'apt-045',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    title: 'Digital Nomad Beach Base',
    location: 'Hai Chau, Da Nang',
    price: 20000000,
    size: '100 sqm',
    vibe: 'Bohemian Eclectic',
    description: 'Perfect for digital nomads. Fast internet, workspace, and beach lifestyle combine for the ultimate remote work experience.',
    highlights: ['Digital nomad friendly', 'Fast internet', 'Beach access', 'Coworking nearby', 'International community'],
    realtor: {
      id: 'realtor-045',
      name: 'An Le',
      phone: '+84 94 567 8901',
      email: 'an.le@nomad.vn'
    }
  },
  {
    id: 'apt-046',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    title: 'Wellness Retreat Home',
    location: 'Son Tra, Da Nang',
    price: 31000000,
    size: '170 sqm',
    vibe: 'Zen Retreat',
    description: 'Designed for wellness and healthy living. Yoga space, meditation areas, and natural surroundings promote wellbeing.',
    highlights: ['Wellness focus', 'Yoga space', 'Meditation areas', 'Healthy living', 'Natural environment'],
    realtor: {
      id: 'realtor-046',
      name: 'Tram Vo',
      phone: '+84 95 678 9012',
      email: 'tram.vo@wellness.vn'
    }
  },
  {
    id: 'apt-047',
    images: [
      'https://images.unsplash.com/photo-1567767202311-cfd0e8b23cf9?w=800&h=600&fit=crop'
    ],
    title: 'Cultural Heritage Home',
    location: 'Ngu Hanh Son, Da Nang',
    price: 26000000,
    size: '140 sqm',
    vibe: 'Cozy Traditional',
    description: 'Rich in cultural heritage near ancient temples. Perfect for those who appreciate history, tradition, and spiritual significance.',
    highlights: ['Cultural heritage', 'Ancient temples', 'Traditional design', 'Historical significance', 'Spiritual atmosphere'],
    realtor: {
      id: 'realtor-047',
      name: 'Son Pham',
      phone: '+84 96 789 0123',
      email: 'son.pham@heritage.vn'
    }
  },

  // Final 3 apartments to reach 50
  {
    id: 'apt-048',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    title: 'Executive Business Suite',
    location: 'District 1, Ho Chi Minh City',
    price: 41000000,
    size: '160 sqm',
    vibe: 'Urban Sanctuary',
    description: 'Premium executive suite in the financial district. Perfect for business leaders who demand luxury and convenience.',
    highlights: ['Executive level', 'Financial district', 'Premium amenities', 'Business services', 'Luxury finishes'],
    realtor: {
      id: 'realtor-048',
      name: 'Khanh Nguyen',
      phone: '+84 97 890 1234',
      email: 'khanh.nguyen@executive.vn'
    }
  },
  {
    id: 'apt-049',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    ],
    title: 'Artistic Warehouse Conversion',
    location: 'District 3, Ho Chi Minh City',
    price: 24000000,
    size: '180 sqm',
    vibe: 'Industrial Chic',
    description: 'Converted warehouse space perfect for artists and creatives. Raw industrial beauty meets artistic functionality.',
    highlights: ['Warehouse conversion', 'Industrial aesthetic', 'Large space', 'Artist community', 'Creative potential'],
    realtor: {
      id: 'realtor-049',
      name: 'Hoang Tran',
      phone: '+84 98 901 2345',
      email: 'hoang.tran@warehouse.vn'
    }
  },
  {
    id: 'apt-050',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    title: 'Oceanfront Luxury Villa',
    location: 'Hai Chau, Da Nang',
    price: 48000000,
    size: '320 sqm',
    vibe: 'Urban Sanctuary',
    description: 'Ultimate oceanfront luxury villa with private beach access. The pinnacle of coastal living with world-class amenities.',
    highlights: ['Oceanfront location', 'Private beach', 'Luxury amenities', 'World-class design', 'Ultimate coastal living'],
    realtor: {
      id: 'realtor-050',
      name: 'Viet Le',
      phone: '+84 99 012 3456',
      email: 'viet.le@oceanfront.vn'
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

export const getPropertiesByLocation = (location: string) => {
  return sampleProperties.filter(property => 
    property.location.toLowerCase().includes(location.toLowerCase())
  );
};

export const getPropertiesByPriceRange = (min: number, max: number) => {
  return sampleProperties.filter(property => 
    property.price >= min && property.price <= max
  );
};
