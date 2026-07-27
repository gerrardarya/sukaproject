import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim();
  return Boolean(url && key);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Product = {
  id?: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_active: boolean;
  created_at?: string;
};

export type Category = {
  id: number;
  name: string;
  created_at?: string;
};

export type Testimonial = {
  id: number;
  client_name: string;
  company: string | null;
  result_image_url: string | null;
  quote: string;
  result_text: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
};
