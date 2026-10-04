
"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    number: "01",
    title: "Where it started",
    description:
      "My journey began with computer engineering, curiosity, and a desire to understand how technology works.",
    image: "/images/journey/starting-out.jpg",
    alt: "The beginning of my coding journey",
  },
  {
    number: "02",
    title: "Learning by building",
    description:
      "I started turning what I learned into real projects, exploring web development, design, and problem-solving.",
    image: "/images/journey/learning.jpg",
    alt: "Learning and building software projects",
  },
  {
    number: "03",
    title: "Building Creonox",
    description:
      "I founded Creonox Technologies to help businesses turn ideas into useful digital products and solutions.",
    image: "/images/journey/creonox.jpg",
    alt: "Building Creonox Technologies",
  },
  {
    number: "04",
    title: "Beyond websites",
    description:
      "My focus expanded to business software, ERP systems, automation, and AI-powered products.",
    image: "/images/journey/products.jpg",
    alt: "Software products and business applications",
  },
  {
    number: "05",
    title: "Still building",
    description:
      "Today, I continue building products, exploring new ideas, and learning through every iteration.",
    image: "/images/journey/today.jpg",
    alt: "My current workspace and projects",
  },
];

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(
        ".journey-slide",
      );
      const images = gsap.utils.toArray<HTMLElement>(
        ".journey-image",
      );
      const heading = section.querySelector(".journey-heading");

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set([...slides, ...images], {
          autoAlpha: 0,
          y: 30,
        });

        gsap.set([slides[0], images[0]], {
          autoAlpha: 1,
          y: 0,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () =>
              `+=${window.innerHeight * (milestones.length - 1)}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          heading,
          {
            autoAlpha: 0,
            y: -15,
            duration: 0.4,
          },
          0,
        );

        milestones.forEach((_, index) => {
          if (index === 0) return;

          const previous = index - 1;
          const at = previous;

          timeline
            .to(
              [slides[previous], images[previous]],
              {
                autoAlpha: 0,
                y: -30,
                duration: 0.5,
              },
              at,
            )
            .fromTo(
              [slides[index], images[index]],
              {
                autoAlpha: 0,
                y: 30,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
              },
              at + 0.15,
            );
        });

        return () => timeline.kill();
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set([...slides, ...images], {
          clearProps: "all",
        });
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background text-foreground"
    >
      {/* Desktop scroll gallery */}
      <div className="relative hidden h-svh overflow-hidden px-6 md:block">
        <div className="journey-heading absolute inset-x-0 top-[12%] z-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            My Journey
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Every step builds the next.
          </p>
        </div>

        <div className="mx-auto grid h-full max-w-6xl grid-cols-2 items-center gap-12">
          {/* Changing image */}
          <div className="relative h-[360px] overflow-hidden rounded-xl lg:h-[420px]">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.number}
                className="journey-image absolute inset-0"
              >
                <Image
                  src={milestone.image}
                  alt={milestone.alt}
                  fill
                  sizes="(min-width: 1280px) 560px, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Changing text */}
          <div className="relative flex min-h-[300px] items-center">
            {milestones.map((milestone) => (
              <article
                key={milestone.number}
                className="journey-slide absolute inset-x-0"
              >
                <span className="text-sm text-muted-foreground">
                  {milestone.number} /{" "}
                  {String(milestones.length).padStart(2, "0")}
                </span>

                <h2 className="mt-6 max-w-xl text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
                  {milestone.title}
                </h2>

                <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  {milestone.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: natural scrolling */}
      <div className="space-y-16 px-6 py-24 md:hidden">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            My Journey
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight">
            Every step builds the next.
          </h2>
        </header>

        {milestones.map((milestone) => (
          <article key={milestone.number}>
            <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={milestone.image}
                alt={milestone.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <span className="text-sm text-muted-foreground">
              {milestone.number} /{" "}
              {String(milestones.length).padStart(2, "0")}
            </span>

            <h3 className="mt-4 text-3xl font-medium tracking-tight">
              {milestone.title}
            </h3>

            <p className="mt-4 leading-7 text-muted-foreground">
              {milestone.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

