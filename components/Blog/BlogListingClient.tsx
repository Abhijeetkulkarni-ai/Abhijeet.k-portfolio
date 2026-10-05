"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { BlogPost } from "@/lib/blog";

gsap.registerPlugin(ScrollTrigger);

type Props = {
    posts: BlogPost[];
    categories: string[];
};

const editorialImages = [
    "photo-1498050108023-c5249f4df085",
    "photo-1516321318423-f06f85e504b3",
    "photo-1460925895917-afdab827c52f",
    "photo-1558655146-d09347e92766",
    "photo-1519389950473-47ba0277781c",
    "photo-1516321497487-e288fb19713f",
    "photo-1507238691740-187a5b1d37b8",
    "photo-1559028012-481c04fa702d",
    "photo-1522542550221-31fd19575a2d",
    "photo-1518770660439-4636190af475",
];

function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).toUpperCase();
}

export default function BlogListingClient({
    posts,
    categories,
}: Props) {
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const pageRef = useRef<HTMLElement>(null);

    const filteredPosts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();


        return posts.filter((post) => {
            const matchesCategory =
                activeCategory === "All" ||
                post.category === activeCategory;

            const matchesQuery =
                !normalizedQuery ||
                post.title.toLowerCase().includes(normalizedQuery) ||
                post.description.toLowerCase().includes(normalizedQuery) ||
                post.tags?.some((tag) =>
                    tag.toLowerCase().includes(normalizedQuery),
                );

            return matchesCategory && matchesQuery;
        });


    }, [posts, query, activeCategory]);

    useEffect(() => {
        const root = pageRef.current;
        if (!root) return;


        const ctx = gsap.context(() => {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            if (reduceMotion) return;

            gsap.fromTo(
                ".blog-heading",
                { y: 35, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                },
            );

            gsap.fromTo(
                ".blog-toolbar",
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    delay: 0.2,
                    ease: "power2.out",
                },
            );

            gsap.fromTo(
                ".blog-card",
                { y: 28, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    stagger: 0.07,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".blog-grid",
                        start: "top 88%",
                        once: true,
                    },
                },
            );

            gsap.fromTo(
                ".blog-newsletter",
                { y: 35, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".blog-newsletter",
                        start: "top 88%",
                        once: true,
                    },
                },
            );
        }, root);

        return () => ctx.revert();


    }, [filteredPosts]);

    return (<main
        ref={pageRef}
        className="min-h-screen overflow-hidden bg-white text-black" > 
    <section className="mx-auto max-w-[1440px] px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:px-12"> <div className="blog-heading flex flex-col justify-between gap-5 border-b border-black/20 pb-7 md:flex-row md:items-end"> <div> <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-black/50">
        Notes, ideas & experiments </p>


        <h1 className="font-serif text-6xl font-normal tracking-[-0.065em] sm:text-7xl lg:text-[100px] lg:leading-[0.95]">
            The Journal<span className="text-black/30">.</span>
        </h1>
    </div>

        <p className="max-w-sm text-sm leading-6 text-black/55">
            Thoughts on web development, software engineering, AI,
            and the process of building digital products.
        </p>
    </div>

            <div className="blog-toolbar flex flex-col gap-5 border-b border-black/15 py-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-x-5 gap-y-3">
                    {["All", ...categories.filter((c) => c !== "All")].map(
                        (category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`text-xs transition-colors duration-300 ${activeCategory === category
                                        ? "text-black underline underline-offset-4"
                                        : "text-black/45 hover:text-black"
                                    }`}
                            >
                                {category}
                            </button>
                        ),
                    )}
                </div>

                <label className="flex w-full items-center gap-3 border-b border-black/25 pb-2 transition-colors focus-within:border-black md:max-w-[220px]">
                    <span className="text-sm text-black/50">Search</span>
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Articles..."
                        aria-label="Search articles"
                        className="w-full bg-transparent text-xs text-black outline-none placeholder:text-black/40"
                    />
                </label>
            </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-12">
            {filteredPosts.length ? (
                <div className="blog-grid grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredPosts.map((post, index) => (
                        <article
                            key={post.slug}
                            className="blog-card group min-w-0"
                        >
                            <Link
                                href={`/blog/${post.slug}`}
                                className="block"
                                aria-label={`Read ${post.title}`}
                            >
                                <div className="relative mb-4 aspect-[1.05/1] overflow-hidden bg-neutral-100">
                                    <img
                                        src={`https://images.unsplash.com/${editorialImages[index % editorialImages.length]}?auto=format&fit=crop&w=900&q=85`}
                                        alt=""
                                        loading={index < 5 ? "eager" : "lazy"}
                                        className="h-full w-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                                    />
                                </div>

                                <p className="mb-2 text-[10px] tracking-[0.08em] text-black/45">
                                    {formatDate(post.date)}
                                </p>

                                <h2 className="text-[14px] font-semibold leading-[1.45] tracking-[-0.025em] transition-opacity duration-300 group-hover:opacity-60">
                                    {post.title}
                                </h2>

                                <p className="mt-2 line-clamp-3 text-[13px] leading-[1.55] text-black/55">
                                    {post.description}
                                </p>
                            </Link>

                            <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-black/40">
                                {post.category}
                            </p>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <p className="font-serif text-3xl">No articles found.</p>
                    <p className="mt-3 text-sm text-black/50">
                        Try another search term or category.
                    </p>
                    <button
                        onClick={() => {
                            setQuery("");
                            setActiveCategory("All");
                        }}
                        className="mt-5 border-b border-black pb-1 text-xs transition-opacity hover:opacity-50"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </section>

        <section className="border-t border-black/60">
            <div className="blog-newsletter mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
                <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-black/45">
                    Stay curious
                </p>

                <h2 className="max-w-4xl font-serif text-5xl font-normal leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-[82px]">
                    Ideas worth thinking about.{" "}
                    <span className="text-black/35">
                        Projects worth building.
                    </span>
                </h2>

                <div className="mt-10 flex flex-col justify-between gap-6 border-t border-black/15 pt-6 sm:flex-row sm:items-center">
                    <p className="max-w-md text-sm leading-6 text-black/55">
                        Follow along as I explore software engineering, AI,
                        and the process of turning ideas into products.
                    </p>

                    <Link
                        href="https://www.linkedin.com/in/abhijeet-kulkarni-2a0892321/"
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit border-b border-black pb-2 text-sm transition-opacity duration-300 hover:opacity-50"
                    >
                        Connect with me
                    </Link>
                </div>
            </div>
        </section>

        <footer className="border-t border-black/15 px-5 py-5 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 text-[10px] uppercase tracking-[0.12em] text-black/45 sm:flex-row">
                <span>© {new Date().getFullYear()} Abhijeet Kulkarni</span>
                <span>Built with curiosity.</span>
            </div>
        </footer>
    </main>


    );
}
