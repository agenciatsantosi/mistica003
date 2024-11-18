export interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  rating?: number;
  reviews?: number;
  images: string[];
  status: 'active' | 'pending' | 'inactive';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  features?: {
    accessibility?: boolean;
    parking?: boolean;
    wifi?: boolean;
    airConditioning?: boolean;
    events?: boolean;
    [key: string]: boolean | undefined;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
}
