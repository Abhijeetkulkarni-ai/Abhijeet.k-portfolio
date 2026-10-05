"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const NAME = "abhijeet.k";
const SPLIT = 8; // index where the video slot sits inside the name

const GREY = "#cacaca2d";
const BLACK = "#000000";
const CARET = "2px 0 0 0 currentColor";

const HOLD_SECONDS = 2; // how long the big centered video stays on screen
const IN_VIEW_THRESHOLD = 0.35; // how much of the hero must be visible to start

const SUBTITLE_LINES = [
  "Software developer and AI builder",
  "creating digital products and",
  "[ business automation ]",
];
const SUBTITLE_FULL = SUBTITLE_LINES.join(" ");

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const wrappersRef = useRef<HTMLSpanElement[]>([]); // outer (mask) spans
  const lettersRef = useRef<HTMLSpanElement[]>([]); // inner (animated) spans
  const slotRef = useRef<HTMLSpanElement>(null); // the video's place inside the name
  const videoRef = useRef<HTMLSpanElement>(null); // the part that moves and scales
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const subtitleCharsRef = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const wrappers = wrappersRef.current;
    const letters = lettersRef.current;
    const slot = slotRef.current;
    const video = videoRef.current;
    const videoElement = videoElementRef.current;
    const overlay = overlayRef.current;
    const chars = subtitleCharsRef.current;

    if (!hero || !letters.length || !slot || !video || !videoElement || !overlay || !chars.length) return;

    let removeListeners: (() => void) | undefined;
    let cleanupStart: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;

    // Block scrolling while the intro plays, without changing page layout.
    // Only turned on when the intro actually starts (hero in view).
    let scrollLocked = false;
    const preventScroll = (e: Event) => {
      if (scrollLocked) e.preventDefault();
    };
    const preventScrollKeys = (e: KeyboardEvent) => {
      if (!scrollLocked) return;
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Where the video should sit (and how big) while it is centered on screen.
      const centerState = () => {
        const r = slot.getBoundingClientRect();
        const aspect = r.width / r.height;
        const targetW = Math.min(
          window.innerWidth * 0.82,
          window.innerHeight * 0.72 * aspect,
          1100
        );
        return {
          x: window.innerWidth / 2 - (r.left + r.width / 2),
          y: window.innerHeight / 2 - (r.top + r.height / 2),
          scale: targetW / r.width,
        };
      };

      // ---------- Initial state ----------
      gsap.set(letters, {
        yPercent: reducedMotion ? 0 : 115,
        color: reducedMotion ? BLACK : GREY,
      });
      gsap.set(video, {
        opacity: reducedMotion ? 1 : 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(overlay, { opacity: 0 });
      chars.forEach((c) => (c.style.boxShadow = "none"));
      gsap.set(chars, { opacity: reducedMotion ? 1 : 0 });

      if (reducedMotion) {
        // Final state, no motion. The video only plays while the hero is in view.
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) videoElement.play().catch(() => {});
            else videoElement.pause();
          },
          { threshold: 0.2 }
        );
        observer.observe(hero);
        return;
      }

      // ---------- Cursor proximity on the letters (enabled after the intro) ----------
      let interactive = false;
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const onMove = (e: PointerEvent) => {
        if (!interactive) return;
        wrappers.forEach((el) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const d = Math.hypot(e.clientX - cx, e.clientY - cy);
          const p = gsap.utils.clamp(0, 1, 1 - d / 220);
          gsap.to(el, {
            y: -p * 18,
            scale: 1 + p * 0.22,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };

      const onLeave = () => {
        gsap.to(wrappers, {
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      if (canHover) {
        hero.addEventListener("pointermove", onMove);
        hero.addEventListener("pointerleave", onLeave);
        removeListeners = () => {
          hero.removeEventListener("pointermove", onMove);
          hero.removeEventListener("pointerleave", onLeave);
        };
      }

      // ---------- Timeline ----------
      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      });

      // 1. Video drops in from above the screen, small, to the center.
      timeline.call(() => {
        videoElement.play().catch(() => {
          // Muted autoplay can still be restricted by some browsers.
        });
      });
      timeline.addLabel("drop");
      timeline.fromTo(
        video,
        {
          opacity: 1,
          x: () => centerState().x,
          y: () => -(slot.getBoundingClientRect().top + slot.offsetHeight) - 60,
          scale: 1,
        },
        {
          y: () => centerState().y,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
        },
        "drop"
      );

      // 2. The page fades to black while the video grows big (cinematic).
      timeline.to(
        overlay,
        { opacity: 1, duration: 1.4, ease: "power2.inOut" },
        "drop+=0.3"
      );
      timeline.to(
        video,
        {
          scale: () => centerState().scale,
          duration: 1,
          ease: "power3.inOut",
        },
        "drop+=0.9"
      );

      // 3. Hold, then fly into its place in the name while the page returns to white.
      timeline.addLabel("hold", "drop+=1.9");
      timeline.to(
        video,
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power4.inOut",
          onComplete: () => {
            scrollLocked = false;
          },
        },
        `hold+=${HOLD_SECONDS}`
      );
      timeline.to(
        overlay,
        { opacity: 0, duration: 1, ease: "power2.inOut" },
        `hold+=${HOLD_SECONDS + 0.1}`
      );

      // 4. The name reveals around the video (mask slide-up).
      timeline.to(
        letters,
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.045,
          ease: "power4.out",
        },
        "-=0.5"
      );

      // 5. Grey to black sweep, left to right.
      timeline.addLabel("sweep", "-=0.4");
      timeline.to(
        letters,
        {
          color: BLACK,
          duration: 1.1,
          stagger: 0.09,
          ease: "power1.inOut",
        },
        "sweep"
      );

      // 6. Subtitle "writes" itself, character by character, with a caret.
      const typer = { v: 0 };
      let shown = 0;
      timeline.to(
        typer,
        {
          v: chars.length,
          duration: chars.length * 0.03,
          ease: "none",
          onUpdate: () => {
            // Clamp so a rewind, restart or overshoot can never go out of range.
            const n = Math.min(chars.length, Math.max(0, Math.floor(typer.v)));
            if (n === shown) return;

            // Set every character from the current count, so it works
            // both going forward and backward.
            for (let i = 0; i < chars.length; i++) {
              const el = chars[i];
              if (!el) continue;
              el.style.opacity = i < n ? "1" : "0";
              el.style.boxShadow = i === n - 1 ? CARET : "none";
            }
            shown = n;
          },
          onComplete: () => {
            // Leave the caret for a moment, then remove it.
            gsap.delayedCall(0.9, () => {
              const last = chars[chars.length - 1];
              if (last) last.style.boxShadow = "none";
            });
          },
        },
        "sweep+=0.6"
      );

      // 7. Enable letter proximity once the intro is done.
      timeline.call(() => {
        interactive = true;
      });

      // ---------- Start only when the hero is in the viewport ----------
      // The intro waits for BOTH: the video can play (no black frame) AND
      // the hero is visible. It plays once; the video pauses when off-screen.
      let started = false;
      let ready = false;
      let inView = false;

      const tryStart = () => {
        if (started || !ready || !inView) return;
        started = true;
        scrollLocked = true;
        timeline.play();
      };

      const markReady = () => {
        ready = true;
        tryStart();
      };

      const fallback = window.setTimeout(markReady, 1500);
      if (videoElement.readyState >= 3) {
        markReady();
      } else {
        videoElement.addEventListener("canplay", markReady, { once: true });
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;

          if (inView) {
            tryStart();
            if (started) videoElement.play().catch(() => {});
          } else if (started) {
            videoElement.pause();
          }
        },
        { threshold: IN_VIEW_THRESHOLD }
      );
      observer.observe(hero);

      cleanupStart = () => {
        window.clearTimeout(fallback);
        videoElement.removeEventListener("canplay", markReady);
      };
    }, hero);

    return () => {
      scrollLocked = false;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
      observer?.disconnect();
      cleanupStart?.();
      removeListeners?.();
      context.revert();
    };
  }, []);

  const renderLetter = (letter: string, index: number) => (
    <span
      key={`${letter}-${index}`}
      ref={(element) => {
        if (element) wrappersRef.current[index] = element;
      }}
      className="inline-block overflow-hidden py-[0.12em] -my-[0.12em]"
      aria-hidden="true"
    >
      <span
        ref={(element) => {
          if (element) lettersRef.current[index] = element;
        }}
        className="inline-block will-change-transform"
      >
        {letter}
      </span>
    </span>
  );

  // Splits text into words (kept unbroken) made of per-character spans.
  let typedIndex = 0;
  const renderTyped = (text: string) =>
    text.split(" ").map((word, wi, arr) => (
      <Fragment key={`${word}-${wi}`}>
        <span className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => {
            const i = typedIndex++;
            return (
              <span
                key={ci}
                ref={(element) => {
                  if (element) subtitleCharsRef.current[i] = element;
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
        {wi < arr.length - 1 && " "}
      </Fragment>
    ));

  return (
    <section
      ref={heroRef}
      className="flex min-h-screen flex-col overflow-x-clip bg-white px-5 text-neutral-900 sm:px-8 lg:px-10"
    >
      {/* Black backdrop for the cinematic video moment */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] bg-black opacity-0"
      />

      <div className="flex flex-1 flex-col items-center justify-center py-12 sm:py-16">
        <h1
          aria-label={NAME}
          className="flex w-full max-w-full items-center justify-center whitespace-nowrap font-sans text-[clamp(1.8rem,min(15vw,18vh),14rem)] font-bold leading-[0.85] tracking-[-0.045em]"
        >
          {NAME.slice(0, SPLIT)
            .split("")
            .map((letter, index) => renderLetter(letter, index))}

          {/* Slot keeps the video's place in the name; the inner span flies in from the center. */}
          <span
            ref={slotRef}
            className="relative mx-[0.1em] inline-block aspect-square h-[0.8em] w-[1em] shrink-0 sm:h-[1em] sm:w-[1.2em]"
            aria-hidden="true"
          >
            <span
              ref={videoRef}
              className="absolute inset-0 z-[100] overflow-hidden rounded-[2px] will-change-transform"
            >
              <video
                ref={videoElementRef}
                src="/hero.mp4"
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </span>
          </span>

          {NAME.slice(SPLIT)
            .split("")
            .map((letter, index) => renderLetter(letter, SPLIT + index))}
        </h1>

        <p className="mt-8 text-center font-sans text-[clamp(1rem,2.2vw,2rem)] font-normal leading-[1.2] tracking-[-0.04em] sm:mt-9">
          <span className="sr-only">{SUBTITLE_FULL}</span>
          <span aria-hidden="true">
            {renderTyped(SUBTITLE_LINES[0])}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            {renderTyped(SUBTITLE_LINES[1])}
            <br />
            <span className="text-neutral-500">
              {renderTyped(SUBTITLE_LINES[2])}
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}