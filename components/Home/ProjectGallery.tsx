"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    src: "/projects/ai.png",
    alt: "AI project",
    x: 36.1,
    y: 3.7,
    width: 11,
  },
  {
    src: "/projects/digital.png",
    alt: "Digital project",
    x: 2.4,
    y: 32.9,
    width: 10.7,
  },
  {
    src: "/projects/automation.png",
    alt: "Automation project",
    x: 61.5,
    y: 19.8,
    width: 10.5,
  },
  {
    src: "/projects/gae.png",
    alt: "GlobalAtlas Exim",
    x: 84.4,
    y: 22.5,
    width: 10,
  },
  {
    src: "/projects/products.png",
    alt: "Product project",
    x: 26,
    y: 60.5,
    width: 10.5,
  },
  {
    src: "/projects/creative.jpg",
    alt: "Creative project",
    x: 14.3,
    y: 81.8,
    width: 10.2,
  },
  {
    src: "/projects/web.png",
    alt: "Web development project",
    x: 63,
    y: 80.8,
    width: 10.5,
  },
  {
    src: "/projects/design.png",
    alt: "Design project",
    x: 84.2,
    y: 81.8,
    width: 10,
  },
];

const mobilePositions = [
  { x: 32, y: 9, w: 27 },
  { x: 1, y: 34, w: 28 },
  { x: 59, y: 23, w: 28 },
  { x: 74, y: 38, w: 24 },
  { x: 22, y: 57, w: 27 },
  { x: 5, y: 79, w: 26 },
  { x: 48, y: 82, w: 27 },
  { x: 74, y: 79, w: 25 },
];


const featuredProjects = [
  {
    number: "01",
    category: "AI PRODUCT · IN DEVELOPMENT",
    title: "Yukti",
    description: "AI brand intelligence, built around your business.",
    subDescription:
      "A workspace for brand knowledge, audience insights, market context, and AI-assisted content workflows.",
    src: "/projects/ai.png",
    alt: "Yukti AI brand intelligence product",
    href: "mailto:abhijeet@globalatlas.in?subject=Yukti%20Product%20Preview",
    linkLabel: "Request a preview",
  },
  {
    number: "02",
    category: "SAAS · RESTAURANT OPERATIONS",
    title: "Bombay Desk",
    description: "A connected POS experience for restaurant teams.",
    subDescription:
      "Designed around tables, orders, kitchen tickets, billing, payments, and reliable local printing.",
    src: "/projects/automation.png",
    alt: "Bombay Desk restaurant operations software",
    href: "mailto:abhijeet@globalatlas.in?subject=Bombay%20Desk%20Product%20Preview",
    linkLabel: "Request a demo",
  },
  {
    number: "03",
    category: "WEB PLATFORM · GLOBAL TRADE",
    title: "GlobalAtlas Exim",
    description: "Connecting businesses across borders.",
    subDescription:
      "A digital presence for export brokerage, product sourcing, and connecting global buyers with suppliers.",
    src: "/projects/gae.png",
    alt: "GlobalAtlas Exim export and sourcing platform",
    href: "https://globalatlas.in",
    linkLabel: "Visit website",
  },
];

export default function ProjectGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const selectedWorkRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const gallery = galleryRef.current;

    if (!section || !stage || !gallery) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      gallery.querySelectorAll(".project-card")
    );

    const title = section.querySelector<HTMLElement>(".gallery-title");
    const labels = section.querySelectorAll<HTMLElement>(".gallery-label");
    const introLines = section.querySelectorAll<HTMLElement>(".intro-line");
    const introChars = section.querySelectorAll<HTMLElement>(".intro-char");

    if (!title) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let context: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;
    let played = false;
    let outroStarted = false;
    let scrollLocked = false;

    // Lock page scrolling only while the automatic entrance animation runs.
    const preventScroll = (event: Event) => {
      if (scrollLocked) event.preventDefault();
    };

    const preventScrollKeys = (event: KeyboardEvent) => {
      if (!scrollLocked) return;
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          event.key
        )
      ) {
        event.preventDefault();
      }
    };

    const lockScroll = () => {
      scrollLocked = true;
    };

    const unlockScroll = () => {
      scrollLocked = false;
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);

    context = gsap.context(() => {
      const mobile = window.matchMedia("(max-width: 640px)").matches;

      // Preserve the existing image positions.
      cards.forEach((card, index) => {
        const project = projects[index];
        const position = mobile
          ? mobilePositions[index]
          : {
              x: project.x,
              y: project.y,
              w: project.width,
            };

        card.dataset.finalX = String(position.x);
        card.dataset.finalY = String(position.y);
        card.dataset.finalWidth = String(position.w);
      });

      // Initial stacked state for the autoplay image reveal.
      gsap.set(cards, {
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        scale: reducedMotion ? 1 : 0.72,
        rotation: (index) => (index % 2 ? 5 : -5),
        opacity: reducedMotion ? 1 : 0,
        transformOrigin: "center center",
        force3D: true,
      });

      gsap.set(title, {
        opacity: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : 14,
        filter: reducedMotion ? "none" : "blur(6px)",
      });

      gsap.set(labels, {
        opacity: reducedMotion ? 1 : 0,
      });

      // These lines stay hidden until the gallery's scroll transition ends.
      gsap.set(introLines, {
        opacity: 1,
      });

      gsap.set(introChars, {
        opacity: 0,
        color: "#a3a3a3",
        y: 12,
        rotateX: -35,
        transformOrigin: "50% 100%",
      });

      // Respect users who prefer reduced motion.
      if (reducedMotion) {
        cards.forEach((card) => {
          gsap.set(card, {
            left: `${card.dataset.finalX}%`,
            top: `${card.dataset.finalY}%`,
            width: `${card.dataset.finalWidth}%`,
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
          });
        });
        gsap.set(introChars, {
          opacity: 1,
          color: "#111111",
          y: 0,
          rotateX: 0,
        });

        return;
      }

      // Entrance plays automatically. After it finishes, the user controls
      // the exit transition with their next scroll.
      const createScrollOutro = () => {
        outroStarted = true;
        gsap.set(cards, { x: 0, y: 0 });

        const outro = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        // First, tilt and lift the full collage out of the viewport.
        outro.to(gallery, {
          rotateX: 14,
          rotateY: -3,
          scale: 0.84,
          z: -120,
          transformPerspective: 1200,
          transformOrigin: "50% 0%",
          duration: 0.35,
        });

        outro.to(gallery, {
          yPercent: -125,
          duration: 0.65,
          ease: "power2.in",
        });

        // The name fades only after the images have moved out.
        outro.to(title, {
          opacity: 0,
          y: 0,
          filter: "blur(3px)",
          duration: 0.18,
        });

        // Then the introduction replaces the name, driven by scrolling.
        outro.to(introChars, {
          opacity: 1,
          color: "#111111",
          y: 0,
          rotateX: 0,
          duration: 0.3,
          stagger: { each: 0.012, from: "start" },
          ease: "power2.out",
        });

        ScrollTrigger.refresh();
      };

      // The gallery reveal autoplays when it enters view. Scrolling is unlocked
      // once the reveal finishes; the exit transition is then scroll-controlled.
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || played) return;

          played = true;
          observer?.disconnect();
          lockScroll();

          context?.add(() => {
            const entrance = gsap.timeline({
              defaults: { ease: "power3.out" },
              onComplete: () => {
                unlockScroll();
                createScrollOutro();
              },
            });

            entrance.to(labels, {
              opacity: 1,
              duration: 0.7,
              stagger: 0.12,
            });

            entrance.to(
              title,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1,
                ease: "power4.out",
              },
              "-=0.25"
            );

            entrance.to({}, { duration: 0.2 });

            entrance.to(cards, {
              left: (index) => `${cards[index].dataset.finalX}%`,
              top: (index) => `${cards[index].dataset.finalY}%`,
              width: (index) => `${cards[index].dataset.finalWidth}%`,
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              duration: 0.75,
              stagger: {
                each: 0.1,
                from: "center",
              },
              ease: "power4.inOut",
            });

            entrance.from(
              cards,
              {
                y: 5,
                duration: 0.45,
                stagger: 0.035,
                ease: "power2.out",
              },
              "-=0.3"
            );
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(section);
    }, section);

    // Reduced-motion users get the complete static composition without scroll locking.
    if (reducedMotion) {
      return () => {
        unlockScroll();
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);
        window.removeEventListener("keydown", preventScrollKeys);
        context?.revert();
      };
    }

    // Subtle cursor parallax remains separate from the 3D scroll effect.
    const handlePointerMove = (event: PointerEvent) => {
      if (!played || outroStarted || reducedMotion) return;

      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card, index) => {
        const depth = index % 2 === 0 ? 5 : 8;

        gsap.to(card, {
          x: px * depth,
          y: py * depth,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    const handlePointerLeave = () => {
      if (outroStarted) return;
      cards.forEach((card) => {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      unlockScroll();
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
      observer?.disconnect();
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      context?.revert();
    };
  }, []);

  // Reveal the selected-work heading first, then each project card in sequence.
  useLayoutEffect(() => {
    const selectedWork = selectedWorkRef.current;
    if (!selectedWork) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const heading = selectedWork.querySelector<HTMLElement>(
      ".featured-work-heading"
    );
    const projectCards = gsap.utils.toArray<HTMLElement>(
      selectedWork.querySelectorAll(".featured-project-card")
    );

    if (projectCards.length === 0) return;

    const context = gsap.context(() => {
      if (heading) {
        gsap.set(heading, { autoAlpha: 0, y: 24, filter: "blur(6px)" });
      }

      gsap.set(projectCards, {
        autoAlpha: 0,
        y: 48,
        filter: "blur(8px)",
      });

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: selectedWork,
          start: "top 72%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      if (heading) {
        reveal.to(heading, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.65,
        });
      }

      reveal.to(
        projectCards,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.24,
          clearProps: "filter",
        },
        heading ? "-=0.08" : 0
      );
    }, selectedWork);

    return () => context.revert();
  }, []);

  return (
    <main className="w-full max-w-full overflow-x-clip bg-white text-black">
      {/* Sticky gallery stage; the full intro animation completes before scrolling resumes. */}
      <section
        ref={sectionRef}
        className="relative w-full max-w-full overflow-x-clip min-h-[250svh] motion-reduce:min-h-screen"
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-[100svh] min-h-[480px] w-full max-w-full overflow-hidden bg-white sm:min-h-[560px]"
          aria-label="Selected projects and introduction"
          style={{ perspective: "1200px" }}
        >
        
          {/* Original scattered image composition. */}
          <div
            ref={galleryRef}
            id="projects"
            className="absolute inset-0 z-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projects.map((project) => (
              <article
                key={project.src}
                className="project-card absolute overflow-hidden bg-neutral-100"
                style={{
                  width: `${project.width}vw`,
                  aspectRatio: "3 / 4",
                  willChange: "transform, opacity, left, top, width",
                }}
              >
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  priority={projects.length <= 4}
                  sizes="(max-width: 640px) 30vw, 18vw"
                  draggable={false}
                  className="select-none object-cover"
                />
              </article>
            ))}
          </div>

          {/* Headline stays centered and fades out in place during scroll. */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-3 sm:px-4">
            <h1 className="gallery-title max-w-full whitespace-normal text-center text-[clamp(1.35rem,5vw,1.875rem)] font-normal leading-tight tracking-[-0.045em] text-neutral-900">
              Ideas, Engineered.
            </h1>
          </div>

          {/* Introduction replaces the name in the same position. */}
          <div className="gallery-intro pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-3xl space-y-3 text-center sm:space-y-4 md:space-y-5">
              <p className="intro-line text-base font-normal leading-snug tracking-tight sm:text-xl md:text-3xl">
                {"Building premium websites and powerful SaaS products.".split("").map((char, index) => (
                  <span className="intro-char inline-block" key={`line-1-${index}`}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </p>
              <p className="intro-line text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-5xl">
                {"Creating intelligent business systems.".split("").map((char, index) => (
                  <span className="intro-char inline-block" key={`line-2-${index}`}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </p>
              <p className="intro-line text-xs leading-relaxed tracking-wide text-neutral-500 sm:text-sm md:text-base">
                {"Turning complex ideas into seamless digital experiences.".split("").map((char, index) => (
                  <span className="intro-char inline-block" key={`line-3-${index}`}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* This section appears after the intro has fully resolved and the gallery scrolls away. */}
      <section
        ref={selectedWorkRef}
        id="selected-work"
        className="relative bg-white px-4 py-16 text-neutral-950 min-[400px]:px-5 sm:px-8 sm:py-28 md:px-[7vw] md:py-36"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="featured-work-heading mb-10 flex flex-col justify-between gap-5 border-b border-neutral-200 pb-7 sm:mb-14 sm:flex-row sm:items-end md:mb-16">
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                Selected work / 2024—2026
              </p>
              <h2 className="max-w-3xl text-[clamp(1.8rem,7vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.055em] sm:text-4xl md:text-6xl">
                A few things I’ve brought to life.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-neutral-500 sm:text-right">
              Digital experiences, products, and systems built to solve real business problems.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-10 sm:gap-y-12 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8 xl:gap-y-16">
            {featuredProjects.map((project) => (
              <article key={project.number} className="featured-project-card group min-w-0 will-change-transform">
                <a
                  href={project.href}
                  target={project.href.startsWith("https://") ? "_blank" : undefined}
                  rel={project.href.startsWith("https://") ? "noreferrer" : undefined}
                  aria-label={`${project.linkLabel}: ${project.title}`}
                  className="block overflow-hidden bg-neutral-100"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={project.src}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />
                    <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-700 backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                </a>

                <div className="pt-5 sm:pt-6">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <p className="text-[10px] font-medium tracking-[0.12em] text-neutral-400">
                      {project.number} / 03
                    </p>
                    <p className="text-xs text-neutral-500">{project.category.split(" · ")[0]}</p>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.045em] sm:text-[1.75rem]">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-base font-medium leading-6 text-neutral-800">
                    {project.description}
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-500">
                    {project.subDescription}
                  </p>
                  <a
                    href={project.href}
                    target={project.href.startsWith("https://") ? "_blank" : undefined}
                    rel={project.href.startsWith("https://") ? "noreferrer" : undefined}
                    className="mt-5 inline-flex items-center gap-2 border-b border-neutral-300 pb-1.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-950"
                  >
                    {project.linkLabel}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
