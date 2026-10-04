"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "./testimonials-data";

gsap.registerPlugin(ScrollTrigger);

const stats = [
{ value: 400, suffix: "+", label: "Applications" },
{ value: 200, suffix: "+", label: "Websites" },
{ value: 30, suffix: "+", label: "Custom Software" },
{ value: 3, suffix: "+", label: "Experience" },
];

export default function TestimonialMarquee() {
const sectionRef = useRef<HTMLElement>(null);

useLayoutEffect(() => {
const section = sectionRef.current;
if (!section) return;


const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const mobileQuery = window.matchMedia("(max-width: 640px)");

const ctx = gsap.context(() => {
  const statsGroup =
    section.querySelector<HTMLElement>(".stats-group");

  const statItems = gsap.utils.toArray<HTMLElement>(
    section.querySelectorAll(".stat-item"),
  );

  const counters =
    section.querySelectorAll<HTMLElement>(".stat-count");

  const heading =
    section.querySelector<HTMLElement>(".stats-heading");

  const rows = gsap.utils.toArray<HTMLElement>(
    section.querySelectorAll(".testimonial-row"),
  );

  const rightTrack =
    section.querySelector<HTMLElement>(".marquee-right");

  const leftTrack =
    section.querySelector<HTMLElement>(".marquee-left");

  if (!statsGroup || !heading || rows.length !== 2) return;

  if (reducedMotion) {
    counters.forEach((element) => {
      element.textContent = String(
        Number(element.dataset.target),
      );
    });

    gsap.set([statsGroup, heading, ...rows, ...statItems], {
      clearProps: "all",
      autoAlpha: 1,
    });
  } else {
    gsap.set(statsGroup, {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: mobileQuery.matches ? 0.95 : 1.35,
      transformOrigin: "50% 50%",
    });

    gsap.set(heading, {
      autoAlpha: 0,
      y: 24,
    });

    gsap.set(rows, {
      autoAlpha: 0,
      y: mobileQuery.matches ? 45 : 90,
    });

    gsap.set(statItems, {
      autoAlpha: 0,
      y: 24,
    });

    const counterValues = Array.from(counters).map(
      (element) => ({
        element,
        target: Number(element.dataset.target),
        value: 0,
      }),
    );

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () =>
          `+=${window.innerHeight * (mobileQuery.matches ? 2.4 : 2.8)}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 1. Reveal the counters in the center.
    timeline.to(
      statItems,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.08,
        ease: "power2.out",
      },
      0,
    );

    // 2. Animate the numbers.
    counterValues.forEach(({ element, target, value }, index) => {
      const counter = { value };

      timeline.to(
        counter,
        {
          value: target,
          duration: 0.9,
          ease: "power2.out",
          snap: { value: 1 },
          onUpdate: () => {
            element.textContent = String(
              Math.round(counter.value),
            );
          },
        },
        0.12 + index * 0.035,
      );
    });

    // 3. Move stats toward the top.
    timeline.to(
      statsGroup,
      {
        top: () => (mobileQuery.matches ? "7%" : "12%"),
        yPercent: 0,
        scale: () => (mobileQuery.matches ? 0.78 : 0.72),
        duration: 0.65,
        ease: "power3.inOut",
      },
      1.0,
    );

    // 4. Reveal the heading.
    timeline.to(
      heading,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      1.48,
    );

    // 5. Reveal both testimonial rows.
    timeline.to(
      rows,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.14,
        ease: "power3.out",
      },
      1.72,
    );
  }

  // Move testimonial rows in opposite directions.
  const animateMarquee = (
    track: HTMLElement | null,
    direction: "left" | "right",
    duration: number,
  ) => {
    if (!track || reducedMotion) return;

    const animation = gsap.fromTo(
      track,
      {
        xPercent: direction === "right" ? -50 : 0,
      },
      {
        xPercent: direction === "right" ? 0 : -50,
        duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
    );

    const pause = () => animation.pause();
    const resume = () => animation.resume();

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", resume);
    track.addEventListener("touchstart", pause, {
      passive: true,
    });
    track.addEventListener("touchend", resume, {
      passive: true,
    });
    track.addEventListener("touchcancel", resume, {
      passive: true,
    });

    return () => {
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
      track.removeEventListener("focusin", pause);
      track.removeEventListener("focusout", resume);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("touchend", resume);
      track.removeEventListener("touchcancel", resume);

      animation.kill();
    };
  };

  const cleanupRight = animateMarquee(
    rightTrack,
    "right",
    mobileQuery.matches ? 36 : 28,
  );

  const cleanupLeft = animateMarquee(
    leftTrack,
    "left",
    mobileQuery.matches ? 32 : 24,
  );

  return () => {
    cleanupRight?.();
    cleanupLeft?.();
  };
}, section);

return () => ctx.revert();


}, []);

const repeatedTestimonials = Array.from(
{ length: 4 },
() => testimonials,
).flat();

const repeatedReverseTestimonials = Array.from(
{ length: 4 },
() => [...testimonials].reverse(),
).flat();

return ( <section
   ref={sectionRef}
   aria-label="Our work and client testimonials"
   className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-white px-3 py-6 text-black sm:px-6 sm:py-8 md:px-10"
 >
{/* Animated statistics */} <div className="stats-group z-20 mx-auto w-full max-w-5xl"> <div className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-4 text-center sm:grid-cols-4 sm:gap-x-6 sm:gap-y-5 md:gap-x-10">
{stats.map((stat) => ( <div
           key={stat.label}
           className="stat-item flex min-w-0 flex-col items-center gap-1.5 text-center sm:gap-2"
         > <div className="text-4xl font-semibold tracking-[-0.07em] sm:text-5xl md:text-7xl"> <span
               className="stat-count tabular-nums"
               data-target={stat.value}
             >
0 </span>
{stat.suffix} </div>


          <p className="max-w-full text-[8px] uppercase leading-relaxed tracking-[0.1em] text-neutral-500 sm:text-[10px] sm:tracking-[0.14em]">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </div>

  {/* Heading and testimonial cards */}
  <div className="relative z-10 mx-auto mt-[24svh] w-full max-w-7xl sm:mt-[18svh]">
    <div className="stats-heading mb-4 flex items-end justify-between gap-3 sm:mb-7 sm:gap-4">
      <h2 className="text-lg font-medium leading-tight tracking-tight sm:text-2xl md:text-3xl">
        Words from the people
        <br />
        behind the projects.
      </h2>

      <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.12em] text-neutral-500 sm:block">
        Client testimonials ↗
      </span>
    </div>

    {/* First marquee */}
    <div className="testimonial-row mb-3 overflow-hidden sm:mb-4">
      <div
        className="marquee-right flex w-max gap-3 sm:gap-4"
        aria-label="Client testimonials, moving right"
      >
        {repeatedTestimonials.map((item, index) => (
          <article
            key={`right-${index}`}
            aria-hidden={index >= testimonials.length}
            className="flex w-[min(82vw,280px)] shrink-0 flex-col border border-neutral-200 bg-neutral-50 p-4 sm:w-[320px] sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                Testimonial{" "}
                {String(
                  (index % testimonials.length) + 1,
                ).padStart(2, "0")}
              </span>

              <span
                aria-hidden="true"
                className="text-3xl text-neutral-400"
              >
                “
              </span>
            </div>

            <blockquote className="text-sm leading-relaxed tracking-tight sm:text-base md:text-lg">
              “{item.quote}”
            </blockquote>

            <div className="mt-5 border-t border-neutral-200 pt-4 sm:mt-6">
              <p className="text-sm font-semibold">
                {item.name}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {item.role}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>

    {/* Second marquee */}
    <div className="testimonial-row overflow-hidden">
      <div
        className="marquee-left flex w-max gap-3 sm:gap-4"
        aria-label="More client testimonials, moving left"
      >
        {repeatedReverseTestimonials.map((item, index) => (
          <article
            key={`left-${index}`}
            aria-hidden={index >= testimonials.length}
            className="flex w-[min(82vw,280px)] shrink-0 flex-col border border-neutral-200 bg-white p-4 sm:w-[320px] sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                Client feedback
              </span>

              <span
                aria-hidden="true"
                className="text-3xl text-neutral-400"
              >
                “
              </span>
            </div>

            <blockquote className="text-sm leading-relaxed tracking-tight sm:text-base md:text-lg">
              “{item.quote}”
            </blockquote>

            <div className="mt-5 border-t border-neutral-200 pt-4 sm:mt-6">
              <p className="text-sm font-semibold">
                {item.name}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {item.role}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>

    <p className="mt-4 text-center text-[8px] uppercase tracking-[0.12em] text-neutral-400 sm:mt-5">
      Built through collaboration
    </p>
  </div>
</section>

);
}
