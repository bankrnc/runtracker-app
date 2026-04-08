import { apiClient } from "../lib/apiClient";
import type { PostCard, PostDetail } from "../schemas/blog.schema";

export const blogApi = {
  getAll: async (): Promise<PostCard[]> => {
    const res = await apiClient.get<{ posts: PostCard[] }>("/posts");
    return res.data.posts;
  },

  getAllAdmin: async (): Promise<PostCard[]> => {
    const res = await apiClient.get<{ posts: PostCard[] }>("/posts/all");
    return res.data.posts;
  },

  getBySlug: async (slug: string): Promise<PostDetail> => {
    const res = await apiClient.get<{ post: PostDetail }>(`/posts/slug/${slug}`);
    return res.data.post;
  },

  create: async (form: FormData): Promise<PostDetail> => {
    const res = await apiClient.post<{ post: PostDetail }>("/posts", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.post;
  },

  update: async (id: number, form: FormData): Promise<PostDetail> => {
    const res = await apiClient.put<{ post: PostDetail }>(`/posts/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.post;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },
};
