"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const NAME = "abhijeet.k";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const videoRef = useRef<HTMLSpanElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const letters = lettersRef.current;
    const video = videoRef.current;
    const videoElement = videoElementRef.current;
    const subtitle = subtitleRef.current;

    if (!hero || !letters.length || !video || !videoElement || !subtitle) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nameLetters = letters;
      const nameText = nameLetters.slice(0, 8);
      const suffixLetters = nameLetters.slice(8);

      gsap.set(nameLetters, {
        opacity: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : 12,
        color: "#cacaca2d",
      });
      gsap.set(video, {
        opacity: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : -220,
        scale: reducedMotion ? 1 : 0.72,
        rotationX: reducedMotion ? 0 : -35,
        rotationY: reducedMotion ? 0 : -180,
        transformPerspective: 1000,
        transformOrigin: "50% 50%",
      });
      gsap.set(subtitle, {
        opacity: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : 10,
      });

      if (reducedMotion) return;

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.08,
      });

      // Keep the wordmark's initial reveal soft and quick.
      timeline.to(nameLetters, {
        opacity: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.018,
      });

      // Make a little room for the video, without a large movement.
      timeline.to(nameText, { x: -2, duration: 0.2 }, "-=0.08");
      timeline.to(suffixLetters, { x: 2, duration: 0.2 }, "<");

      // Drop the video in from above, give it a clear 3D flip, and bounce on landing.
      timeline.to(video, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.35,
        ease: "bounce.out",
        onComplete: () => {
          videoElement.play().catch(() => {
            // Muted autoplay can still be restricted by some browsers.
          });

          // Transition the wordmark from grey to black, left to right.
          gsap.to(nameLetters, {
            color: "#000000",
            duration: 1.1,
            stagger: 0.09,
            ease: "power1.inOut",
          });
        },
      }, "-=0.02");
      timeline.to(video, {
        rotationX: 0,
        rotationY: 0,
        duration: 1.05,
        ease: "power3.inOut",
      }, "<");

      // Minimal subtitle reveal after the video lands.
      timeline.to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.38,
      }, "-=0.02");
    }, hero);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="flex min-h-screen flex-col overflow-x-clip px-5 text-neutral-900 sm:px-8 lg:px-10"
    >
      <div className="flex flex-1 flex-col items-center justify-center py-12 sm:py-16">
        <h1 className="flex w-full max-w-full items-center justify-center whitespace-nowrap font-sans text-[clamp(1.8rem,min(15vw,18vh),14rem)] font-bold leading-[0.85] tracking-[-0.045em]">
          {NAME.slice(0, 8).split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              ref={(element) => {
                if (element) lettersRef.current[index] = element;
              }}
              className="inline-block"
            >
              {letter}
            </span>
          ))}

          <span
            ref={videoRef}
            className="relative mx-[0.1em] inline-block aspect-square h-[0.8em] w-[1em] shrink-0 overflow-hidden rounded-[2px] sm:h-[1em] sm:w-[1.2em]"
            aria-hidden="true"
          >
            <video
              ref={videoElementRef}
              src="/hero.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Featured digital product animation"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </span>

          {NAME.slice(8).split("").map((letter, index) => (
            <span
              key={`${letter}-suffix-${index}`}
              ref={(element) => {
                if (element) lettersRef.current[8 + index] = element;
              }}
              className="inline-block"
            >
              {letter}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 text-center font-sans text-[clamp(1rem,2.2vw,2rem)] font-normal leading-[1.2] tracking-[-0.04em] sm:mt-9"
        >
          Software developer and AI builder
          <br className="hidden sm:block" />
          creating digital products and
          <br />
          <span className="text-neutral-500">[ business automation ]</span>
        </p>
      </div>
    </section>
  );
}
