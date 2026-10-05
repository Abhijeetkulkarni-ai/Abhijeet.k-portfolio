"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { marqueeTestimonials as testimonials } from "./testimonials-data";
import countryCodeEmoji from "country-code-emoji";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 400, suffix: "+", label: "Mobile Applications" },
  { value: 200, suffix: "+", label: "Websites" },
  { value: 30, suffix: "+", label: "Custom Software" },
  { value: 4, suffix: "+ ", label: "years of Experience" },
];

const EDGE_FADE =
  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)";

export default function TestimonialMarquee() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobileQuery = window.matchMedia("(max-width: 640px)");

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const group = section.querySelector<HTMLElement>(".stats-group");
      const nums = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".stat-num"));
      const labels = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".stat-label"));
      const counters = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".stat-count"));
      const heading = section.querySelector<HTMLElement>(".stats-heading");
      const rows = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".testimonial-row"));
      const note = section.querySelector<HTMLElement>(".stats-note");
      const rightTrack = section.querySelector<HTMLElement>(".marquee-right");
      const leftTrack = section.querySelector<HTMLElement>(".marquee-left");

      if (!group || !heading || !note || rows.length !== 2) return;

      // ---------- Reduced motion: final state, no pin, no movement ----------
      if (reducedMotion) {
        counters.forEach((el) => {
          el.textContent = String(Number(el.dataset.target));
        });
        return;
      }

      // ---------- Pinned intro (all transforms, nothing that re-layouts) ----------
      // The stats sit in normal layout at the top of the content. They start
      // centered on screen, scaled up, then glide up into place while the
      // heading and testimonial rows appear underneath, so nothing overlaps.
      const centerY = () =>
        section.clientHeight / 2 - (group.offsetTop + group.offsetHeight / 2);

      const centerScale = () => {
        const ratio = (section.clientWidth * 0.9) / group.offsetWidth;
        return Math.max(1, Math.min(1.5, ratio));
      };

      const counterValues = counters.map((element) => ({
        element,
        target: Number(element.dataset.target),
        state: { value: 0 },
      }));

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (mobileQuery.matches ? 2.6 : 3)}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Numbers rise out of a mask, labels follow.
      timeline.fromTo(
        nums,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" },
        0
      );
      timeline.fromTo(
        labels,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 },
        0.25
      );

      // 2. Count up.
      counterValues.forEach(({ element, target, state }, index) => {
        timeline.to(
          state,
          {
            value: target,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
              element.textContent = String(Math.round(state.value));
            },
          },
          0.12 + index * 0.05
        );
      });

      // 3. Stats group glides from the screen center up into its place.
      timeline.fromTo(
        group,
        { y: centerY, scale: centerScale, transformOrigin: "50% 50%" },
        { y: 0, scale: 1, duration: 0.8, ease: "power3.inOut" },
        1.15
      );

      // 4. Heading.
      timeline.fromTo(
        heading,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.4 },
        1.7
      );

      // 5. Testimonial rows.
      timeline.fromTo(
        rows,
        { autoAlpha: 0, y: () => (mobileQuery.matches ? 40 : 80) },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.14, ease: "power3.out" },
        1.9
      );

      // 6. Footer note, then a short hold before the section unpins.
      timeline.fromTo(note, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 2.4);
      timeline.to({}, { duration: 0.6 });

      // ---------- Continuous marquee ----------
      // True endless loop (each row is duplicated). Rows ease to a stop on
      // hover/touch, and both speed up while the page is being scrolled.
      const states: { tween: gsap.core.Tween; factor: number; target: number }[] = [];

      const addMarquee = (
        track: HTMLElement | null,
        direction: "left" | "right",
        duration: number
      ) => {
        if (!track) return;

        const tween = gsap.fromTo(
          track,
          { xPercent: direction === "right" ? -50 : 0 },
          { xPercent: direction === "right" ? 0 : -50, duration, ease: "none", repeat: -1 }
        );
        const state = { tween, factor: 1, target: 1 };
        states.push(state);

        const slow = () => (state.target = 0);
        const go = () => (state.target = 1);

        track.addEventListener("mouseenter", slow);
        track.addEventListener("mouseleave", go);
        track.addEventListener("focusin", slow);
        track.addEventListener("focusout", go);
        track.addEventListener("touchstart", slow, { passive: true });
        track.addEventListener("touchend", go, { passive: true });
        track.addEventListener("touchcancel", go, { passive: true });

        cleanups.push(() => {
          track.removeEventListener("mouseenter", slow);
          track.removeEventListener("mouseleave", go);
          track.removeEventListener("focusin", slow);
          track.removeEventListener("focusout", go);
          track.removeEventListener("touchstart", slow);
          track.removeEventListener("touchend", go);
          track.removeEventListener("touchcancel", go);
          tween.kill();
        });
      };

      addMarquee(rightTrack, "right", mobileQuery.matches ? 40 : 32);
      addMarquee(leftTrack, "left", mobileQuery.matches ? 36 : 28);

      let lastY = window.scrollY;
      let boost = 0;
      const tick = () => {
        const y = window.scrollY;
        const speed = Math.abs(y - lastY);
        lastY = y;
        boost += (Math.min(3, speed / 18) - boost) * 0.08;

        states.forEach((s) => {
          s.factor += (s.target - s.factor) * 0.1;
          s.tween.timeScale(s.factor * (1 + boost));
        });
      };
      gsap.ticker.add(tick);
      cleanups.push(() => gsap.ticker.remove(tick));
    }, section);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  // Split testimonials into two non-overlapping rows.
  // For 10 testimonials, each row gets 5; for odd counts, the top gets one extra.
  const splitIndex = Math.ceil(testimonials.length / 2);
  const topTestimonials = testimonials.slice(0, splitIndex);
  const bottomTestimonials = testimonials.slice(splitIndex).reverse();

  // Duplicate each row so the marquee loops seamlessly.
  const repeatedTestimonials = [...topTestimonials, ...topTestimonials];
  const repeatedReverseTestimonials = [...bottomTestimonials, ...bottomTestimonials];

  return (
    <section
      ref={sectionRef}
      aria-label="Our work and client testimonials"
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-white px-4 py-6 text-black sm:px-6 sm:py-10 md:px-10"
    >
      {/* Animated statistics (normal layout; moved with transforms only) */}
      <div className="stats-group relative z-20 mx-auto w-full max-w-4xl will-change-transform">
        <div className="grid grid-cols-4 items-start">
          {stats.map((stat) => (
            <div
              key={stat.label}
              role="group"
              aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
              className="flex min-w-0 flex-col items-center px-1 text-center sm:px-4 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-neutral-200"
            >
              <div aria-hidden="true" className="overflow-hidden py-[0.06em]">
                <div className="stat-num text-[clamp(1.5rem,8vw,2.25rem)] font-semibold leading-none tracking-[-0.06em] sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="stat-count tabular-nums" data-target={stat.value}>
                    0
                  </span>
                  {stat.suffix}
                </div>
              </div>

              <p
                aria-hidden="true"
                className="stat-label mt-3 max-w-full text-balance text-[8px] uppercase leading-snug tracking-[0.1em] text-neutral-500 sm:mt-4 sm:text-[10px] sm:tracking-[0.14em] md:mt-5"
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Heading and testimonial cards */}
      <div className="relative z-10 mx-auto mt-8 w-full max-w-7xl sm:mt-12 md:mt-14">
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
        <div
          className="testimonial-row mb-3 overflow-hidden sm:mb-4"
          style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
        >
          <div
            className="marquee-right flex w-max gap-3 pr-3 will-change-transform sm:gap-4 sm:pr-4"
            aria-label="Client testimonials, moving right"
          >
            {repeatedTestimonials.map((item, index) => (
              <article
                key={`right-${index}`}
                aria-hidden={index >= topTestimonials.length}
                className="flex w-[min(78vw,270px)] shrink-0 flex-col border border-neutral-200 bg-neutral-50 p-3.5 transition-colors duration-300 hover:border-neutral-400 sm:w-[320px] sm:p-5"
              >
                <div className="mb-5 hidden items-center justify-between sm:flex">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Testimonial{" "}
                    {String((index % topTestimonials.length) + 1).padStart(2, "0")}
                  </span>

                  <span aria-hidden="true" className="text-3xl text-neutral-400">
                    “
                  </span>
                </div>

                <blockquote className="line-clamp-5 text-[13px] leading-snug tracking-tight sm:line-clamp-none sm:text-base sm:leading-relaxed md:text-lg">
                  “{item.quote}”
                </blockquote>

                <div className="mt-3 border-t border-neutral-200 pt-3 sm:mt-6 sm:pt-4">
                  <p className="text-sm font-semibold">{item.name}</p>

                  <p className="mt-0.5 text-xs text-neutral-600 sm:mt-1">
                    {item.business}
                  </p>

                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 sm:mt-1">
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

        {/* Second marquee */}
        <div
          className="testimonial-row overflow-hidden"
          style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
        >
          <div
            className="marquee-left flex w-max gap-3 pr-3 will-change-transform sm:gap-4 sm:pr-4"
            aria-label="More client testimonials, moving left"
          >
            {repeatedReverseTestimonials.map((item, index) => (
              <article
                key={`left-${index}`}
                aria-hidden={index >= bottomTestimonials.length}
                className="flex w-[min(78vw,270px)] shrink-0 flex-col border border-neutral-200 bg-white p-3.5 transition-colors duration-300 hover:border-neutral-400 sm:w-[320px] sm:p-5"
              >
                <div className="mb-5 hidden items-center justify-between sm:flex">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Client feedback
                  </span>

                  <span aria-hidden="true" className="text-3xl text-neutral-400">
                    “
                  </span>
                </div>

                <blockquote className="line-clamp-5 text-[13px] leading-snug tracking-tight sm:line-clamp-none sm:text-base sm:leading-relaxed md:text-lg">
                  “{item.quote}”
                </blockquote>

                <div className="mt-3 border-t border-neutral-200 pt-3 sm:mt-6 sm:pt-4">
                  <p className="text-sm font-semibold">{item.name}</p>

                  <p className="mt-0.5 text-xs text-neutral-600 sm:mt-1">
                    {item.business}
                  </p>

                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 sm:mt-1">
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

        <p className="stats-note mt-4 text-center text-[8px] uppercase tracking-[0.12em] text-neutral-400 sm:mt-6">
          Built through collaboration
        </p>
      </div>
    </section>
  );
}