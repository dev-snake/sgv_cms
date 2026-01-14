export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  desc?: string; // Legacy field for frontend compatibility
  content?: string;
  published_at?: string;
  date?: string; // Legacy field for frontend compatibility
  readTime?: string; // Legacy field for frontend compatibility
  image: string;
  category_id: string;
  category?: string;
  author_id: string;
  author?: string;
  status: "draft" | "published";
  featured?: boolean; // For highlighted news on site
}

export interface Product {
  id: string;
  name: string;
  category_id: string;
  category?: string;
  status: "active" | "inactive";
  price: string;
  stock: string;
  image: string;
  sku: string;
}

export interface Project {
  id: string;
  name: string;
  client_name?: string;
  start_date?: string;
  end_date?: string;
  category_id: string;
  category?: string;
  image: string;
  status: "ongoing" | "completed";
}
