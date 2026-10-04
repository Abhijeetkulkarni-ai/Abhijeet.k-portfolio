"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const focusAreas = [
  "Web & product development",
  "AI automation",
  "Business software",
  "SaaS products",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;


    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const eyebrow = section.querySelector(".about-eyebrow");
      const headline = section.querySelector(".about-headline");
      const image = section.querySelector(".about-image");
      const imageInner = section.querySelector(".about-image-inner");
      const caption = section.querySelector(".about-image-caption");
      const copy = gsap.utils.toArray(".about-copy", section);
      const tags = gsap.utils.toArray(".about-tag", section);
      const footer = section.querySelector(".about-footer");

      const elements = [
        eyebrow,
        headline,
        image,
        caption,
        ...copy,
        ...tags,
        footer,
      ].filter(Boolean);

      if (reducedMotion) {
        gsap.set(elements, { autoAlpha: 1, clearProps: "all" });
        if (imageInner) gsap.set(imageInner, { clearProps: "all" });
        return;
      }

      gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
      gsap.set(headline, { autoAlpha: 0, y: 35 });
      gsap.set(copy, { autoAlpha: 0, y: 20 });
      gsap.set(tags, { autoAlpha: 0, y: 12 });
      gsap.set(caption, { autoAlpha: 0, y: 10 });
      gsap.set(footer, { autoAlpha: 0, y: 12 });

      if (image) {
        gsap.set(image, {
          autoAlpha: 0,
          clipPath: "inset(0 0 100% 0)",
          y: 18,
        });
      }

      if (imageInner) {
        gsap.set(imageInner, { scale: 1.1 });
      }

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(
          headline,
          { autoAlpha: 1, y: 0, duration: 0.8 },
          "-=0.2",
        )
        .to(
          image,
          {
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 1,
            ease: "power4.inOut",
          },
          "-=0.5",
        )
        .to(
          imageInner,
          { scale: 1, duration: 1.1, ease: "power2.out" },
          "<",
        )
        .to(
          copy,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
          },
          "-=0.55",
        )
        .to(
          caption,
          { autoAlpha: 1, y: 0, duration: 0.4 },
          "-=0.2",
        )
        .to(
          tags,
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07 },
          "-=0.15",
        )
        .to(
          footer,
          { autoAlpha: 1, y: 0, duration: 0.45 },
          "-=0.1",
        );

      // Subtle portrait movement while scrolling.
      if (imageInner) {
        gsap.to(imageInner, {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, section);

    return () => ctx.revert();


  }, []);

  return (<section
    ref={sectionRef}
    aria-labelledby="about-title"
    className="relative min-h-screen w-full overflow-x-clip bg-white px-5 pb-12 pt-18 text-black sm:px-8 sm:pt-32 lg:px-10 lg:pt-16"
  > <div className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-screen-2xl flex-col">
     


      {/* Main hero */}
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="min-w-0">
          <h1
            id="about-title"
            className="about-headline max-w-[11ch] text-[clamp(3.5rem,8.5vw,8.5rem)] font-medium leading-[0.88] tracking-[-0.085em]"
          >
            I build
            <br />
            digital things
            <br />
            <span className="text-neutral-400">with purpose.</span>
          </h1>

          <div className="mt-8 max-w-xl sm:mt-10">
            <p className="about-copy max-w-[45ch] text-lg leading-relaxed tracking-[-0.035em] text-neutral-800 sm:text-xl">
              I’m Abhijeet Kulkarni — a developer and founder interested in
              turning complex problems into useful digital products.
            </p>

            <p className="about-copy mt-4 max-w-[52ch] text-sm leading-7 text-neutral-600 sm:mt-5 sm:text-base">
              My work brings development, design, and business together.
              From websites and applications to AI-powered workflows and
              custom business software, I enjoy taking ideas from an early
              sketch to something people can actually use.
            </p>

            <p className="about-copy mt-3 max-w-[52ch] text-sm leading-7 text-neutral-600 sm:text-base">
              I’m building products, testing ideas, and refining solutions
              that make everyday work simpler.
            </p>

            {/* Areas of focus */}
            <div className="mt-7 flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="about-tag rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-600 transition-colors duration-300 hover:border-black hover:text-black sm:text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Portrait */}
        <figure className="relative mx-auto w-full max-w-[480px] lg:ml-auto">
          <div className="about-image relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
            <img
              src="/images/abhijeet.png"
              alt="Abhijeet Kulkarni wearing a black T-shirt"
              className="about-image-inner block h-full w-full object-cover object-center"
              fetchPriority="high"
            />
          </div>

          <figcaption className="about-image-caption mt-4 flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <span className="text-sm font-medium">
              Abhijeet Kulkarni
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-500 sm:text-xs">
              Building what’s next ↗
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>


  );
}
