"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { projects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const heading = section.querySelector(
        ".projects-heading",
      );

      const cards = gsap.utils.toArray<HTMLElement>(
        ".project-card",
      );

      const images = gsap.utils.toArray<HTMLElement>(
        ".project-image",
      );

      /*
       * Initial states
       */
      gsap.set(heading, {
        opacity: 0,
        y: 40,
      });

      gsap.set(cards, {
        opacity: 0,
        y: 70,
      });

      /*
       * Heading reveal
       */
      gsap.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",

        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      /*
       * Project cards reveal
       */
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",

        scrollTrigger: {
          trigger: section,
          start: "top 68%",
          once: true,
        },
      });

      /*
       * Card hover animations
       */
      cards.forEach((card) => {
        const image = card.querySelector(
          ".project-image",
        );

        const arrow = card.querySelector(
          ".project-arrow",
        );

        const overlay = card.querySelector(
          ".project-overlay",
        );

        if (!image || !arrow || !overlay) return;

        const enter = () => {
          gsap.to(image, {
            scale: 1.06,
            duration: 0.7,
            ease: "power3.out",
          });

          gsap.to(overlay, {
            opacity: 0.18,
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(arrow, {
            x: 5,
            y: -5,
            duration: 0.35,
            ease: "power2.out",
          });
        };

        const leave = () => {
          gsap.to(image, {
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
          });

          gsap.to(overlay, {
            opacity: 0.38,
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(arrow, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);

        return () => {
          card.removeEventListener(
            "mouseenter",
            enter,
          );

          card.removeEventListener(
            "mouseleave",
            leave,
          );
        };
      });

      /*
       * Subtle image parallax
       */
      images.forEach((image) => {
        gsap.fromTo(
          image,
          {
            yPercent: -4,
          },
          {
            yPercent: 4,
            ease: "none",

            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Selected projects"
      className="relative w-full overflow-hidden bg-white px-4 py-24 text-black sm:px-6 sm:py-32 md:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADING
        ====================================================== */}

        <div className="projects-heading mb-12 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Selected Work
            </p>

            <h2 className="max-w-3xl text-4xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-5xl md:text-6xl lg:text-7xl">
              Projects I&apos;ve
              <br />

              <span className="text-neutral-400">
                built.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-neutral-500 md:text-right">
            A selection of digital products, platforms and
            experiences I&apos;ve designed and built.
          </p>
        </div>

        {/* =====================================================
            PROJECT GRID
        ====================================================== */}

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="project-card group block overflow-hidden border border-neutral-200 bg-neutral-50"
            >
              {/* =================================================
                  PROJECT IMAGE
              ================================================== */}

              <div className="project-visual relative aspect-[16/10] overflow-hidden bg-neutral-200">
                <Image
                  src={project.image}
                  alt={`${project.title} project`}
                  fill
                  priority={project.number === "01"}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="project-image object-cover"
                />

                {/* Overlay */}
                <div className="project-overlay absolute inset-0 bg-black opacity-[0.38]" />

                {/* Top information */}
                <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white">
                      {project.number}
                    </span>

                    <span className="h-px w-8 bg-white/50" />

                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/70">
                      {project.year}
                    </span>
                  </div>

                  <span className="project-arrow flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-lg text-white backdrop-blur-sm">
                    ↗
                  </span>
                </div>

                {/* Category */}
                <div className="absolute bottom-5 left-5">
                  <span className="border border-white/30 bg-black/30 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* =================================================
                  PROJECT CONTENT
              ================================================== */}

              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
                      {project.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mt-7 flex flex-wrap gap-2">
                  {project.technologies.map(
                    (technology) => (
                      <span
                        key={technology}
                        className="border border-neutral-200 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-neutral-500"
                      >
                        {technology}
                      </span>
                    ),
                  )}
                </div>

                {/* Footer */}
                <div className="mt-7 flex items-center justify-between border-t border-neutral-200 pt-4">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                    View case study
                  </span>

                  <span className="text-xs text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-5">
          <span className="text-[9px] uppercase tracking-[0.15em] text-neutral-400">
            More work in progress
          </span>

          <span className="text-[9px] uppercase tracking-[0.15em] text-neutral-400">
            2022 — 2026
          </span>
        </div>
      </div>
    </section>
  );
}