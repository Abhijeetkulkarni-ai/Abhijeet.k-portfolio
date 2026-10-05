"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import countryCodeEmoji from "country-code-emoji";
import { stackTestimonials as testimonials } from "./testimonials-data";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;


    const ctx = gsap.context(() => {
      const heading = section.querySelector<HTMLElement>(
        ".testimonials-heading",
      );

      const cards = gsap.utils.toArray<HTMLElement>(
        ".testimonial-stack-card",
      );

      if (!heading || cards.length === 0) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set([heading, ...cards], {
          clearProps: "all",
          autoAlpha: 1,
        });
        return;
      }

      gsap.set(cards, {
        xPercent: 0,
        y: () => window.innerHeight * 0.9,
        autoAlpha: 0,
        scale: 0.96,
        transformOrigin: "50% 50%",
        force3D: true,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${window.innerHeight * (cards.length + 0.5)}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: "labelsDirectional",
            duration: { min: 0.18, max: 0.45 },
            delay: 0.03,
            ease: "power1.inOut",
          },
        },
      });

      timeline.fromTo(
        heading,
        { y: 18, autoAlpha: 0.35 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0,
      );

      cards.forEach((card, index) => {
        const position = 0.3 + index * 1.1;

        timeline.addLabel(`card-${index}`, position);

        // Keep earlier cards visible behind the active card.
        if (index > 0) {
          timeline.to(
            cards[index - 1],
            {
              y: -14,
              scale: 0.96,
              autoAlpha: 0.72,
              duration: 0.35,
              ease: "power2.out",
            },
            position,
          );
        }

        timeline.to(
          card,
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.72,
            ease: "power3.out",
          },
          position + 0.04,
        );
      });
    }, section);

    return () => ctx.revert();


  }, []);

  return (<section
    ref={sectionRef}
    aria-labelledby="testimonials-title"
    className="relative isolate w-full overflow-hidden bg-white text-black"
  > <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-12 md:px-10"> <div className="testimonials-heading pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center text-center uppercase leading-[0.78] tracking-[-0.075em]"> <h2
    id="testimonials-title"
    className="text-[clamp(3.5rem,13.5vw,12.5rem)] font-semibold"
  >
    Ideas </h2> <span className="mt-2 text-[clamp(3.5rem,13.5vw,12.5rem)] font-semibold">
      Into </span> <span className="mt-2 text-[clamp(3.5rem,13.5vw,12.5rem)] font-semibold">
      Impact </span> </div>

      <div className="relative z-10 mt-[8vh] grid w-full max-w-[590px] md:mt-[10vh]">
        {testimonials.map((item, index) => (
          <article
            key={`${item.name}-${index}`}
            className="testimonial-stack-card col-start-1 row-start-1 flex flex-col border border-neutral-200 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.08)] sm:p-7 md:p-9"
            style={{
              zIndex: index + 1,
              opacity: 1,
              visibility: "visible",
            }}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(2, "0")}
              </span>

              <span
                aria-hidden="true"
                className="text-4xl leading-none text-neutral-400"
              >
                “
              </span>
            </div>

            <blockquote className="max-w-[31ch] text-xl font-normal leading-snug tracking-[-0.035em] sm:text-2xl md:text-[1.75rem]">
              “{item.quote}”
            </blockquote>

            <div className="mt-auto pt-6">
              <div className="mb-4 h-px w-full bg-neutral-200" />

              <p className="text-sm font-semibold tracking-tight">{item.name}</p>

              <p className="mt-1 text-xs text-neutral-600">{item.business}</p>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                <span>{item.role}</span>
                <span aria-hidden="true">·</span>
                <span aria-label={`${item.country} flag`} title={item.country}>
                  {countryCodeEmoji(item.country)}
                </span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>


  );
}
