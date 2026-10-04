import type { Metadata } from "next";
import BlogListingClient from "@/components/Blog/BlogListingClient";
import {
  getAllCategories,
  getAllPosts,
} from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Abhijeet Kulkarni",
  description:
    "Articles on web development, AI, software engineering, and building digital products by Abhijeet Kulkarni.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <BlogListingClient
      posts={posts}
      categories={categories}
    />
  );
}