export type ArticleStatus = "published" | "draft" | "pending";
export type UserRole = "admin" | "editor";

export interface Category {
  id: number;
  slug: string;
  name_ar: string;
  color: string;
  icon: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  avatar: string | null;
  is_active: number;
  created_at: string;
}

export type PublicUser = Omit<User, "password_hash">;

export interface Article {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string;
  category_id: number;
  status: ArticleStatus;
  is_breaking: number;
  is_featured: number;
  cover_image: string | null;
  image_caption: string | null;
  tags: string;
  author_id: number;
  views: number;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ArticleWithRefs extends Article {
  category_name: string;
  category_slug: string;
  category_color: string;
  author_name: string;
  author_avatar: string | null;
}
