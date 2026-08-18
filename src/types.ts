export type Role = 'customer' | 'business';

export type Category = 'HAIR' | 'MAKEUP' | 'NAILS' | 'LASHES & BROWS';

export type Capacity = 'Low' | 'Moderate' | 'Fully Booked';

export type Format = 'Home-Based Salon' | 'Commercial Studio' | 'Mobile Stylist';

export interface Service {
  title: string;
  duration: string;
  price: number; // ZAR
}

export interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface Business {
  id: string;
  name: string;
  owner: string;
  categories: Category[];
  city: string;
  suburb: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  cover: string;
  portfolio: string[];
  bio: string;
  startingPrice: number;
  services: Service[];
  walkInsWelcome: boolean;
  capacity: Capacity;
  powerReady: boolean;
  format: Format;
  depositPct: number;
  cancellationHours: number;
  paymentTerms: string;
  whatsapp: string; // digits only, intl format
  reviews: Review[];
}

export interface User {
  name: string;
  email: string;
  role: Role;
  categories: Category[];
}

export type BusinessView =
  | 'profile'
  | 'ai-studio'
  | 'portfolio'
  | 'availability'
  | 'policies'
  | 'community';

export type CustomerView =
  | 'explore'
  | 'lookbook'
  | 'smartfit'
  | 'favorites'
  | 'bookings'
  | 'community';

export interface Sponsorship {
  id: string;
  recipient_name: string;
  recipient_contact: string | null;
  story: string;
  occasion: string;
  service_category: string;
  suburb: string;
  city: string;
  goal_amount: number;
  status: 'open' | 'funded' | 'closed';
  created_at: string;
  contributions: SponsorshipContribution[];
}

export interface SponsorshipContribution {
  id: string;
  sponsorship_id: string;
  sponsor_name: string;
  amount: number;
  message: string | null;
  anonymous: boolean;
  created_at: string;
}
