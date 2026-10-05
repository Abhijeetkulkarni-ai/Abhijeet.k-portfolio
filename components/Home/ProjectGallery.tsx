"use client";

import Image from "next/image";
import { Fragment, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, lockScroll, unlockScroll } from "../../lib/Smoothscroll";

gsap.registerPlugin(ScrollTrigger);

const LOCK_ID = "gallery-entrance";

const projects = [
  { src: "/projects/ai.png", alt: "AI project", x: 36.1, y: 3.7, width: 11 },
  { src: "/projects/digital.png", alt: "Digital project", x: 2.4, y: 32.9, width: 10.7 },
  { src: "/projects/automation.png", alt: "Automation project", x: 61.5, y: 19.8, width: 10.5 },
  { src: "/projects/gae.png", alt: "GlobalAtlas Exim", x: 84.4, y: 22.5, width: 10 },
  { src: "/projects/products.png", alt: "Product project", x: 26, y: 60.5, width: 10.5 },
  { src: "/projects/creative.jpg", alt: "Creative project", x: 14.3, y: 81.8, width: 10.2 },
  { src: "/projects/web.png", alt: "Web development project", x: 63, y: 80.8, width: 10.5 },
  { src: "/projects/design.png", alt: "Design project", x: 84.2, y: 81.8, width: 10 },
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

function SplitWords({ text, id }: { text: string; id: string }) {
  const words = text.split(" ");

  return (
    <>
      {/* Screen readers get the sentence once, not letter by letter */}
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={`${id}-${w}`}>
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((char, c) => (
                <span className="intro-char inline-block" key={`${id}-${w}-${c}`}>
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </>
  );
}

const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

export default function ProjectGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const gallery = galleryRef.current;

    if (!section || !stage || !gallery) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      gallery.querySelectorAll(".project-card")
    );

    const title = section.querySelector<HTMLElement>(".gallery-title");
    const introChars = section.querySelectorAll<HTMLElement>(".intro-char");

    if (!title) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let context: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;
    let played = false;
    let outroStarted = false;
    let entranceDone = false;

    // ---------- Layout ----------
    // Final position/size of every card (fits the screen, clears the floating
    // nav), plus the offset that stacks it on the stage center for the entrance.
    // Cards are laid out ONCE at their final spot and animated with transforms
    // only (x, y, scale, rotation), which keeps the entrance on the GPU.
    const computeLayout = () => {
      const mobile = window.matchMedia("(max-width: 640px)").matches;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const safeTop = 24;
      const safeBottom = 96; // room for the floating nav
      const usable = Math.max(200, H - safeTop - safeBottom);

      const positions = cards.map((_, index) => {
        const project = projects[index];
        return mobile
          ? mobilePositions[index]
          : { x: project.x, y: project.y, w: project.width };
      });

      const heights = positions.map((p) => ((p.w / 100) * W * 4) / 3);
      const k = Math.min(1, (usable * 0.3) / Math.max(...heights));
      const ys = positions.map((p) => p.y);
      const yMin = Math.min(...ys);
      const yMax = Math.max(...ys);

      cards.forEach((card, index) => {
        const p = positions[index];
        const w = p.w * k;
        const wPx = (w / 100) * W;
        const hPx = (wPx * 4) / 3;
        const t = (p.y - yMin) / (yMax - yMin || 1);
        const top = safeTop + t * (usable - hPx);
        const leftPx = (p.x / 100) * W;

        card.dataset.left = String(p.x);
        card.dataset.top = String(top);
        card.dataset.width = String(w);
        card.dataset.stackX = String(W / 2 - (leftPx + wPx / 2));
        card.dataset.stackY = String(H / 2 - (top + hPx / 2));
      });
    };

    const applyPlacement = () => {
      gsap.set(cards, {
        left: (i) => `${cards[i].dataset.left}%`,
        top: (i) => `${cards[i].dataset.top}px`,
        width: (i) => `${cards[i].dataset.width}%`,
      });
    };

    const applyStack = () => {
      gsap.set(cards, {
        x: (i) => Number(cards[i].dataset.stackX),
        y: (i) => Number(cards[i].dataset.stackY),
        scale: 0.7,
        rotation: (i) => (i % 2 ? 6 : -6),
        opacity: 0,
        transformOrigin: "50% 50%",
        force3D: true,
      });
    };

    // ---------- Snap the stage to fill the screen before it plays ----------
    const snapToSection = (done: () => void) => {
      const target = section.getBoundingClientRect().top + window.scrollY;
      const distance = Math.abs(target - window.scrollY);
      if (distance < 2) {
        done();
        return;
      }

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, {
          duration: Math.min(1.2, 0.5 + distance / 2500),
          easing: easeInOutQuart,
          lock: true, // ignore user input while snapping
          onComplete: done,
        });
        return;
      }

      const proxy = { y: window.scrollY };
      gsap.to(proxy, {
        y: target,
        duration: Math.min(0.9, 0.35 + distance / 2000),
        ease: "power2.inOut",
        onUpdate: () =>
          window.scrollTo({ top: proxy.y, behavior: "instant" as ScrollBehavior }),
        onComplete: done,
      });
    };

    const onResize = () => {
      computeLayout();
      applyPlacement();
      if (!played) applyStack();
    };
    window.addEventListener("resize", onResize);

    context = gsap.context(() => {
      computeLayout();

      gsap.set(cards, { position: "absolute" });
      applyPlacement();

      gsap.set(title, {
        opacity: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : 14,
        filter: reducedMotion ? "none" : "blur(6px)",
      });

      gsap.set(introChars, {
        opacity: 0,
        color: "#a3a3a3",
        y: 12,
        rotateX: -35,
        transformOrigin: "50% 100%",
      });

      // Respect users who prefer reduced motion: static composition, no locking.
      if (reducedMotion) {
        gsap.set(cards, { opacity: 1 });
        gsap.set(introChars, { opacity: 1, color: "#111111", y: 0, rotateX: 0 });
        return;
      }

      applyStack();

      // ---------- Scroll-driven exit ----------
      const createScrollOutro = () => {
        outroStarted = true;
        gsap.killTweensOf(cards, "x,y");
        gsap.set(cards, { x: 0, y: 0 });

        const outro = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            // Lenis already smooths the scroll, so scrub tightly with it.
            scrub: getLenis() ? true : 1,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        // Cards drift at slightly different speeds for depth (parallax).
        outro.to(
          cards,
          {
            y: (i) => -(40 + (i % 4) * 26),
            rotation: (i) => (i % 2 ? 2 : -2),
            duration: 1,
          },
          0
        );

        // Tilt and lift the whole collage out of the viewport.
        outro.to(
          gallery,
          {
            rotateX: 14,
            rotateY: -3,
            scale: 0.84,
            z: -120,
            transformPerspective: 1200,
            transformOrigin: "50% 0%",
            duration: 0.35,
          },
          0
        );

        outro.to(
          gallery,
          { yPercent: -125, duration: 0.65, ease: "power2.in" },
          0.35
        );

        // The name fades only after the images have moved out.
        outro.to(
          title,
          { opacity: 0, y: 0, filter: "blur(3px)", duration: 0.18 },
          1
        );

        // Then the introduction replaces the name, driven by scrolling.
        outro.to(
          introChars,
          {
            opacity: 1,
            color: "#111111",
            y: 0,
            rotateX: 0,
            duration: 0.3,
            stagger: { each: 0.012, from: "start" },
            ease: "power2.out",
          },
          1.1
        );

        ScrollTrigger.refresh();
      };

      // ---------- Autoplay entrance ----------
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || played) return;

          played = true;
          observer?.disconnect();

          // Bring the stage fully on screen first, then lock scroll and play.
          snapToSection(() => {
            lockScroll(LOCK_ID);

            context?.add(() => {
              const entrance = gsap.timeline({
                defaults: { ease: "power3.out" },
                onComplete: () => {
                  entranceDone = true;
                  unlockScroll(LOCK_ID);
                  createScrollOutro();
                },
              });

              entrance.to(title, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1,
                ease: "power4.out",
              });

              // Cards fly from the center to their spots with transforms only.
              entrance.to(
                cards,
                {
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  duration: 1,
                  ease: "power4.inOut",
                  stagger: { each: 0.08, from: "center" },
                },
                "-=0.35"
              );
              entrance.to(
                cards,
                {
                  opacity: 1,
                  duration: 0.5,
                  ease: "power1.out",
                  stagger: { each: 0.08, from: "center" },
                },
                "<"
              );
            });
          });
        },
        { rootMargin: "0px 0px -20% 0px", threshold: 0 }
      );

      observer.observe(section);
    }, section);

    // ---------- Cursor parallax (after the entrance, before the exit) ----------
    const handlePointerMove = (event: PointerEvent) => {
      if (!entranceDone || outroStarted || reducedMotion) return;

      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card, index) => {
        const depth = index % 2 === 0 ? 8 : 14;

        gsap.to(card, {
          x: px * depth,
          y: py * depth,
          duration: 1.2,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    const handlePointerLeave = () => {
      if (outroStarted) return;
      gsap.to(cards, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      unlockScroll(LOCK_ID);
      window.removeEventListener("resize", onResize);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      observer?.disconnect();
      context?.revert();
    };
  }, []);

  return (
    <main className="w-full max-w-full overflow-x-clip bg-white text-black">
      {/* Sticky gallery stage; the entrance completes before scrolling resumes. */}
      <section
        ref={sectionRef}
        className="relative w-full max-w-full overflow-x-clip min-h-[250svh] motion-reduce:min-h-screen"
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-[100svh] min-h-[min(600px,100svh)] w-full max-w-full overflow-hidden bg-white"
          aria-label="Selected projects and introduction"
          style={{ perspective: "1200px" }}
        >
          {/* Scattered image composition. */}
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
                  willChange: "transform, opacity",
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
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
            <h1 className="gallery-title whitespace-nowrap text-center text-[clamp(25px,1.8vw,30px)] font-normal leading-none tracking-[-0.045em] text-neutral-900">
              Ideas, Engineered.
            </h1>
          </div>

          {/* Introduction replaces the headline in the same position. */}
          <div className="gallery-intro pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-3xl space-y-3 text-center [text-wrap:balance] sm:space-y-4 md:space-y-5">
              <p className="intro-line text-base font-normal leading-snug tracking-tight sm:text-xl md:text-2xl lg:text-3xl">
                <SplitWords id="line-1" text="Building premium websites and powerful SaaS products." />
              </p>

              <p className="intro-line text-[1.75rem] font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <SplitWords id="line-2" text="Creating intelligent business systems." />
              </p>

              <p className="intro-line text-xs leading-relaxed tracking-wide text-neutral-500 sm:text-sm md:text-base lg:text-lg">
                <SplitWords id="line-3" text="Turning complex ideas into seamless digital experiences." />
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}