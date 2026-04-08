export interface PostAuthor {
  profile: {
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  } | null;
}

export interface PostCard {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverUrl: string | null;
  tags: string[];
  published?: boolean;
  createdAt: string;
  author: PostAuthor;
}

export interface PostDetail extends PostCard {
  content: string;
}
