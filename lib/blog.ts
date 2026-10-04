
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  author: string;
  readingTime: string;
  image?: string;
};

type ParsedPost = {
  post: BlogPost;
  content: string;
};

function getMdxFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    throw new Error(`Blog directory not found: ${BLOG_DIR}`);
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"));
}

function parsePost(file: string): ParsedPost {
  const filePath = path.join(BLOG_DIR, file);
  const source = fs.readFileSync(filePath, "utf8");

  // Remove a UTF-8 BOM and whitespace before frontmatter.
  const normalizedSource = source
    .replace(/^\uFEFF/, "")
    .trimStart();

  if (!normalizedSource.startsWith("---")) {
    throw new Error(
      `Missing YAML frontmatter at the beginning of ${filePath}`,
    );
  }

  let data: Record<string, unknown>;
  let content: string;

  try {
    const parsed = matter(normalizedSource);

    data = parsed.data as Record<string, unknown>;
    content = parsed.content;
  } catch (error) {
    throw new Error(
      `Invalid frontmatter in ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`Missing title in ${filePath}`);
  }

  const slug = file.replace(/\.mdx$/, "");
  const stats = readingTime(content);

  const post: BlogPost = {
    slug,
    title: data.title.trim(),
    description:
      typeof data.description === "string"
        ? data.description
        : "",
    date:
      typeof data.date === "string" ||
      typeof data.date === "number"
        ? String(data.date)
        : "",
    category:
      typeof data.category === "string"
        ? data.category
        : "General",
    tags: Array.isArray(data.tags)
      ? data.tags.filter(
          (tag): tag is string => typeof tag === "string",
        )
      : [],
    featured: data.featured === true,
    author:
      typeof data.author === "string"
        ? data.author
        : "Abhijeet Kulkarni",
    readingTime: stats.text,
    image:
      typeof data.image === "string" && data.image.trim()
        ? data.image.trim()
        : undefined,
  };

  return { post, content };
}

export function getAllPosts(): BlogPost[] {
  return getMdxFiles()
    .map((file) => parsePost(file).post)
    .sort((a, b) => {
      const dateA = Date.parse(a.date);
      const dateB = Date.parse(b.date);

      return (
        (Number.isNaN(dateB) ? 0 : dateB) -
        (Number.isNaN(dateA) ? 0 : dateA)
      );
    });
}

export function getPostBySlug(
  slug: string,
): ParsedPost | null {
  // Prevent filesystem paths from being used as slugs.
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return null;
  }

  const file = `${slug}.mdx`;
  const filePath = path.join(BLOG_DIR, file);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parsePost(file);
}

export function getAllCategories(): string[] {
  return [
    ...new Set(getAllPosts().map((post) => post.category)),
  ].sort();
}

export function getFeaturedPost(): BlogPost | undefined {
  return getAllPosts().find((post) => post.featured);
}