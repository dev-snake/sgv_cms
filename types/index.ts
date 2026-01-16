export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  desc?: string; // Legacy field for frontend compatibility
  content?: string;
  published_at?: string;
  date?: string; // Legacy field for frontend compatibility
  readTime?: string; // Legacy field for frontend compatibility
  image?: string;
  image_url: string;
  category_id: string;
  category?: string;
  author_id: string;
  author?: string;
  status: "draft" | "published";
  featured?: boolean; // For highlighted news on site
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  category?: string;
  status: "active" | "inactive";
  price: string;
  stock: string;
  image?: string;
  image_url: string;
  sku: string;
  is_featured?: boolean;
  tech_specs?: any;
  features?: any;
  gallery?: string[];
  tech_summary?: string;
  catalog_url?: string;
  warranty?: string;
  origin?: string;
  availability?: string;
  delivery_info?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  client_name?: string;
  start_date?: string;
  end_date?: string;
  category_id: string;
  category?: string;
  image?: string;
  image_url: string;
  status: "ongoing" | "completed";
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  full_name?: string;
  role: string; // Legacy field
  roles?: Role[]; // For list/detail views
  permissions?: string[]; // For checking permissions
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  created_at?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}
