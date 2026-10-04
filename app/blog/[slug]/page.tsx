import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import remarkGfm from "remark-gfm";
import { isValidElement, type ReactNode } from "react";

import { getAllPosts, getPostBySlug } from "@/lib/blog";

type PageProps = {
    params: Promise<{ slug: string }>;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(date: string) {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(parsedDate);
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function getText(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(getText).join("");
    if (isValidElement(node)) {
        return getText((node.props as { children?: ReactNode }).children);
    }
    return "";
}

function stripInlineMarkdown(text: string) {
    return text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_`~]/g, "")
        .trim();
}

type TocItem = { level: 2 | 3; text: string; id: string };

/** Pulls ## and ### headings out of the MDX source (ignores code fences). */
function extractHeadings(source: string): TocItem[] {
    const items: TocItem[] = [];
    let inCode = false;

    for (const line of source.split("\n")) {
        if (/^\s*(```|~~~)/.test(line)) {
            inCode = !inCode;
            continue;
        }
        if (inCode) continue;

        const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
        if (!match) continue;

        const text = stripInlineMarkdown(match[2]);
        items.push({
            level: match[1].length as 2 | 3,
            text,
            id: slugify(text),
        });
    }

    return items;
}

/* -------------------------------------------------------------------------- */
/*  MDX building blocks                                                        */
/* -------------------------------------------------------------------------- */

function Figure({
    src,
    alt,
    caption,
    wide = true,
}: {
    src: string;
    alt?: string;
    caption?: string;
    wide?: boolean;
}) {
    if (!src) return null;

    return (
        <figure
            className={[
                "my-10 sm:my-12",
                wide ? "sm:-mx-10" : "",
            ].join(" ")}
        >
            <div className="overflow-hidden bg-neutral-100">
                <Image
                    src={src}
                    alt={alt ?? caption ?? ""}
                    width={1600}
                    height={900}
                    sizes="(max-width: 768px) 100vw, 760px"
                    className="h-auto w-full"
                />
            </div>

            {caption && (
                <figcaption className="mt-3 border-l border-black/25 pl-3 font-sans text-[12.5px] leading-5 text-black/55">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

/** Markdown `![alt](src "caption")` → captioned figure. */
function MarkdownImage({
    src,
    alt,
    title,
}: {
    src?: string | Blob;
    alt?: string;
    title?: string;
}) {
    return (
        <Figure
            src={typeof src === "string" ? src : ""}
            alt={alt}
            caption={title || alt}
        />
    );
}

function Callout({
    title,
    children,
}: {
    title?: string;
    children: ReactNode;
}) {
    return (
        <aside className="my-9 border border-black/15 bg-neutral-50 px-6 py-5 font-sans text-[15px] leading-7 text-black/75">
            {title && (
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">
                    {title}
                </p>
            )}
            <div className="[&>p]:my-0">{children}</div>
        </aside>
    );
}

function AnchorHeading({ id }: { id: string }) {
    return (
        <a
            href={`#${id}`}
            aria-label="Link to this section"
            className="absolute -left-6 top-1/2 hidden -translate-y-1/2 font-sans text-base text-black/25 no-underline opacity-0 transition-opacity hover:text-black group-hover:opacity-100 lg:block"
        >
            #
        </a>
    );
}

const mdxComponents = {
    /* ---- Sections ---- */
    h1: ({ children }: { children?: ReactNode }) => {
        const id = slugify(getText(children));
        return (
            <h2
                id={id}
                className="group relative mb-5 mt-16 scroll-mt-24 border-t border-black/15 pt-8 font-serif text-[30px] font-normal leading-[1.15] tracking-[-0.03em] text-black sm:text-[34px] [counter-increment:section] before:mb-4 before:block before:font-sans before:text-[11px] before:tracking-[0.2em] before:text-black/40 before:content-[counter(section,decimal-leading-zero)]"
            >
                <AnchorHeading id={id} />
                {children}
            </h2>
        );
    },
    h2: ({ children }: { children?: ReactNode }) => {
        const id = slugify(getText(children));
        return (
            <h2
                id={id}
                className="group relative mb-5 mt-16 scroll-mt-24 border-t border-black/15 pt-8 font-serif text-[30px] font-normal leading-[1.15] tracking-[-0.03em] text-black sm:text-[34px] [counter-increment:section] before:mb-4 before:block before:font-sans before:text-[11px] before:tracking-[0.2em] before:text-black/40 before:content-[counter(section,decimal-leading-zero)]"
            >
                <AnchorHeading id={id} />
                {children}
            </h2>
        );
    },
    h3: ({ children }: { children?: ReactNode }) => {
        const id = slugify(getText(children));
        return (
            <h3
                id={id}
                className="group relative mb-3 mt-11 scroll-mt-24 font-serif text-[22px] font-normal leading-[1.25] tracking-[-0.02em] text-black sm:text-[25px]"
            >
                <AnchorHeading id={id} />
                {children}
            </h3>
        );
    },
    h4: ({ children }: { children?: ReactNode }) => (
        <h4 className="mb-2 mt-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-black/55">
            {children}
        </h4>
    ),

    /* ---- Body text ---- */
    p: ({ children }: { children?: ReactNode }) => {
        // A lone markdown image should not be wrapped in <p> (figure inside p is invalid HTML).
        if (isValidElement(children) && children.type === MarkdownImage) {
            return <>{children}</>;
        }

        return (
            <p className="my-6 font-serif text-[18.5px] leading-[1.85] text-black/80 sm:text-[20px] sm:leading-[1.9]">
                {children}
            </p>
        );
    },
    a: ({ href = "", children }: { href?: string; children?: ReactNode }) => {
        const className =
            "text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black";

        if (href.startsWith("/")) {
            return (
                <Link href={href} className={className}>
                    {children}
                </Link>
            );
        }

        if (href.startsWith("#")) {
            return (
                <a href={href} className={className}>
                    {children}
                </a>
            );
        }

        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
            >
                {children}
            </a>
        );
    },
    blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote className="my-10 border-l-2 border-black pl-6 sm:pl-8 [&>p]:my-0 [&>p]:text-[22px] [&>p]:italic [&>p]:leading-[1.5] [&>p]:text-black/80 sm:[&>p]:text-[26px]">
            {children}
        </blockquote>
    ),
    hr: () => (
        <div
            role="separator"
            aria-hidden="true"
            className="my-14 text-center font-serif text-xl tracking-[0.6em] text-black/30"
        >
            · · ·
        </div>
    ),

    /* ---- Media ---- */
    img: MarkdownImage,
    Figure,
    Callout,

    /* ---- Tables ---- */
    table: ({ children }: { children?: ReactNode }) => (
        <div className="my-9 overflow-x-auto sm:-mx-10">
            <table className="w-full min-w-[520px] border-collapse text-left font-sans text-[14.5px] leading-6">
                {children}
            </table>
        </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
        <th className="border-b border-black/40 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-black/60">
            {children}
        </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
        <td className="border-b border-black/10 px-4 py-3 align-top text-black/75">
            {children}
        </td>
    ),
};

/* -------------------------------------------------------------------------- */
/*  Table of contents                                                          */
/* -------------------------------------------------------------------------- */

function TocList({ items }: { items: TocItem[] }) {
    let sectionNumber = 0;

    return (
        <ol className="space-y-3 font-sans text-[13px] leading-5">
            {items.map((item) => {
                if (item.level === 2) sectionNumber += 1;

                return (
                    <li
                        key={`${item.id}-${item.text}`}
                        className={item.level === 3 ? "pl-7" : ""}
                    >
                        <a
                            href={`#${item.id}`}
                            className="group flex gap-3 text-black/55 transition-colors hover:text-black"
                        >
                            {item.level === 2 && (
                                <span className="w-4 shrink-0 text-[11px] tabular-nums text-black/30 group-hover:text-black/60">
                                    {String(sectionNumber).padStart(2, "0")}
                                </span>
                            )}
                            <span>{item.text}</span>
                        </a>
                    </li>
                );
            })}
        </ol>
    );
}

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
    return getAllPosts().map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const result = getPostBySlug(slug);

    if (!result) {
        return {
            title: "Article Not Found | Abhijeet Kulkarni",
        };
    }

    const { post } = result;

    return {
        title: `${post.title} | Abhijeet Kulkarni`,
        description: post.description,
        authors: [{ name: post.author }],
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
        openGraph: {
            type: "article",
            title: post.title,
            description: post.description,
            url: `/blog/${post.slug}`,
            publishedTime: post.date
                ? new Date(post.date).toISOString()
                : undefined,
            authors: [post.author],
            tags: post.tags,
            ...(post.image ? { images: [post.image] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            ...(post.image ? { images: [post.image] } : {}),
        },
    };
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const result = getPostBySlug(slug);

    if (!result) notFound();

    const { post, content } = result;

    const headings = extractHeadings(content);
    const hasToc = headings.filter((h) => h.level === 2).length >= 2;

    const related = getAllPosts()
        .filter((p) => p.slug !== post.slug)
        .slice(0, 2);

    return (
        <main className="min-h-screen overflow-x-clip bg-white text-black">
            <article className="mx-auto max-w-[1120px] px-5 pb-20 pt-5 sm:px-8 sm:pt-7 lg:px-12">
                {/* Back navigation */}
                <Link
                    href="/blog"
                    className="group inline-flex items-center gap-2 text-xs text-black/55 transition-colors duration-300 hover:text-black"
                >
                    <ArrowLeft
                        size={15}
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    Back to journal
                </Link>

                {/* Article heading */}
                <header className="mx-auto mt-8 max-w-[800px] border-b border-black/15 pb-8 sm:mt-12 sm:pb-10">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[11px] text-black/50">
                        <span className="border border-black/15 px-3 py-1.5 uppercase tracking-[0.14em]">
                            {post.category}
                        </span>

                        <span>{formatDate(post.date)}</span>

                        <span aria-hidden="true">·</span>

                        <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={12} />
                            {post.readingTime}
                        </span>
                    </div>

                    <h1 className="mt-6 font-serif text-[40px] font-normal leading-[1.06] tracking-[-0.045em] [text-wrap:balance] sm:text-5xl lg:text-[66px]">
                        {post.title}
                    </h1>

                    <p className="mt-6 max-w-[680px] font-serif text-[19px] italic leading-[1.6] text-black/60 sm:text-[22px]">
                        {post.description}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                        <p className="font-sans text-xs text-black/55">
                            Written by{" "}
                            <span className="font-medium text-black">
                                {post.author}
                            </span>
                        </p>

                        <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-black/40">
                            Article
                        </span>
                    </div>
                </header>

                {/* Featured image */}
                {post.image && (
                    <figure className="mx-auto mt-8 max-w-[1000px] sm:mt-10">
                        <div className="group relative aspect-[16/9] overflow-hidden bg-neutral-100">
                            <Image
                                src={post.image}
                                alt={`Featured image for ${post.title}`}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 1000px"
                                className="object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                            />
                        </div>

                        <figcaption className="mt-3 flex items-center justify-between gap-3 font-sans text-[10px] uppercase tracking-[0.14em] text-black/40">
                            <span>{post.category}</span>
                            <span>{formatDate(post.date)}</span>
                        </figcaption>
                    </figure>
                )}

                {/* Mobile / tablet table of contents */}
                {hasToc && (
                    <details className="mx-auto mt-10 max-w-[680px] border border-black/15 px-5 py-4 xl:hidden">
                        <summary className="cursor-pointer list-none font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-black/60">
                            In this article
                        </summary>
                        <div className="mt-5">
                            <TocList items={headings} />
                        </div>
                    </details>
                )}

                {/* Body, with sticky contents on wide screens */}
                <div
                    className={
                        hasToc
                            ? "mt-10 xl:mt-14 xl:grid xl:grid-cols-[200px_680px] xl:justify-center xl:gap-16"
                            : "mt-10 xl:mt-14"
                    }
                >
                    {hasToc && (
                        <aside className="hidden xl:block">
                            <nav
                                aria-label="Table of contents"
                                className="sticky top-10 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain border-t border-black/15 pb-4 pt-5"
                            >
                                <p className="mb-5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-black/45">
                                    In this article
                                </p>
                                <TocList items={headings} />
                            </nav>
                        </aside>
                    )}

                    <div
                        className={[
                            "prose prose-neutral max-w-none font-serif [counter-reset:section]",
                            hasToc ? "" : "mx-auto max-w-[680px]",
                            // Lists
                            "prose-ul:my-6 prose-ol:my-6",
                            "prose-li:my-2.5 prose-li:font-serif prose-li:text-[18.5px] prose-li:leading-[1.8] prose-li:text-black/80 sm:prose-li:text-[20px]",
                            "prose-li:marker:text-black/40",
                            "prose-strong:font-semibold prose-strong:text-black",
                            // Code
                            "prose-pre:my-8 prose-pre:overflow-x-auto prose-pre:rounded-none prose-pre:border prose-pre:border-black/10 prose-pre:bg-[#f7f7f7] prose-pre:p-5 prose-pre:font-mono prose-pre:text-[13px] prose-pre:leading-6 sm:prose-pre:-mx-10 sm:prose-pre:px-10",
                            "prose-code:font-mono prose-code:text-[0.88em] prose-code:text-black",
                            "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
                            "[&_p_code]:rounded [&_p_code]:bg-black/[0.05] [&_p_code]:px-1.5 [&_p_code]:py-0.5",
                            "[&_li_code]:rounded [&_li_code]:bg-black/[0.05] [&_li_code]:px-1.5 [&_li_code]:py-0.5",
                            "[&_p_code]:before:content-none [&_p_code]:after:content-none",
                            "[&_li_code]:before:content-none [&_li_code]:after:content-none",
                            // Drop cap on the opening paragraph
                            "[&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-3 [&>p:first-child]:first-letter:mt-1.5 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-[4.6rem] [&>p:first-child]:first-letter:leading-[0.78] [&>p:first-child]:first-letter:text-black",
                        ].join(" ")}
                    >
                        <MDXRemote
                            source={content}
                            components={mdxComponents}
                            options={{
                                mdxOptions: {
                                    remarkPlugins: [remarkGfm],
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Topics and article navigation */}
                <footer className="mx-auto mt-16 max-w-[800px] border-t border-black/15 pt-7">
                    {post.tags.length > 0 && (
                        <div>
                            <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.2em] text-black/45">
                                Filed under
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="border border-black/15 px-3 py-2 font-sans text-xs text-black/65 transition-colors duration-200 hover:border-black hover:text-black"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {related.length > 0 && (
                        <div className="mt-12">
                            <p className="mb-5 font-sans text-[10px] uppercase tracking-[0.2em] text-black/45">
                                Keep reading
                            </p>

                            <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">
                                {related.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={`/blog/${item.slug}`}
                                        className="group flex flex-col justify-between gap-6 bg-white p-6 transition-colors hover:bg-neutral-50"
                                    >
                                        <div>
                                            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-black/40">
                                                {item.category}
                                            </p>
                                            <h3 className="mt-3 font-serif text-[22px] leading-[1.2] tracking-[-0.025em]">
                                                {item.title}
                                            </h3>
                                        </div>

                                        <span className="inline-flex items-center gap-1.5 font-sans text-xs text-black/55 transition-colors group-hover:text-black">
                                            Read article
                                            <ArrowUpRight
                                                size={14}
                                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-10 flex flex-col justify-between gap-5 border-t border-black/10 pt-6 sm:flex-row sm:items-center">
                        <div>
                            <p className="font-sans text-xs text-black/45">
                                Enjoyed the article?
                            </p>

                            <p className="mt-1 font-sans text-sm font-medium">
                                Explore more ideas in the journal.
                            </p>
                        </div>

                        <Link
                            href="/blog"
                            className="group inline-flex w-fit items-center gap-2 border-b border-black/40 pb-2 font-sans text-sm transition-colors duration-300 hover:border-black"
                        >
                            <ArrowLeft
                                size={15}
                                className="transition-transform duration-300 group-hover:-translate-x-1"
                            />
                            Explore more articles
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-5 font-sans text-[10px] uppercase tracking-[0.12em] text-black/40">
                        <Link
                            href="/"
                            className="transition-colors hover:text-black"
                        >
                            Abhijeet Kulkarni
                        </Link>

                        <span>Built with curiosity.</span>
                    </div>
                </footer>
            </article>
        </main>
    );
}