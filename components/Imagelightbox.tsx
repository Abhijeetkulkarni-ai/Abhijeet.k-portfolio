"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* -----------------------------------------------------------
   ImageLightbox
   - <LightboxProvider> wraps the page and renders the viewer
   - <LightboxImage> is a clickable thumbnail (fits inside its
     frame, shows a shimmer skeleton until it loads)

   Place at: app/components/ImageLightbox.tsx
------------------------------------------------------------ */

type LightboxItem = { src: string; alt: string };

type LightboxContextValue = {
  images: LightboxItem[];
  open: (index: number, trigger: HTMLElement | null) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("LightboxImage must be inside LightboxProvider");
  return ctx;
}

const css = `
  .lb-skeleton {
    background-color: #f0f0f0;
    background-image: linear-gradient(
      100deg,
      transparent 20%,
      rgba(255, 255, 255, 0.75) 50%,
      transparent 80%
    );
    background-size: 200% 100%;
    background-repeat: no-repeat;
    animation: lb-shimmer 1.4s ease-in-out infinite;
  }
  @keyframes lb-shimmer {
    from { background-position: 150% 0; }
    to   { background-position: -50% 0; }
  }
  @keyframes lb-fade {
    from { opacity: 0; transform: scale(0.98); }
    to   { opacity: 1; transform: scale(1); }
  }
  .lb-fade { animation: lb-fade 0.25s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .lb-skeleton, .lb-fade { animation: none; }
  }
`;

const iconButton =
  "flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/* ---------------------------- Provider --------------------------- */

export function LightboxProvider({
  images,
  children,
}: {
  images: LightboxItem[];
  children: ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = images.length;
  const isOpen = active !== null;

  const open = useCallback((index: number, trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    setActive(index);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
  }, []);

  const go = useCallback(
    (direction: 1 | -1) => {
      setActive((current) =>
        current === null ? current : (current + direction + total) % total,
      );
    },
    [total],
  );

  // Lock page scroll and move focus into the viewer while open
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Keyboard: Esc closes, arrows change image, Tab stays inside
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight" && total > 1) go(1);
      else if (event.key === "ArrowLeft" && total > 1) go(-1);
      else if (event.key === "Tab") {
        const focusable = [prevRef.current, nextRef.current, closeRef.current]
          .filter(Boolean) as HTMLElement[];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, go, total]);

  const current = active !== null ? images[active] : null;

  return (
    <LightboxContext.Provider value={{ images, open }}>
      <style>{css}</style>
      {children}

      {current && active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null || total < 2) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
          }}
        >
          {/* Top bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
            <span className="text-xs font-medium tabular-nums uppercase tracking-[0.14em] text-neutral-300">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>

            <button
              ref={closeRef}
              type="button"
              aria-label="Close image viewer"
              className={iconButton}
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Image, centered and fitted */}
          <div
            className="relative h-[72vh] w-[90vw] max-w-6xl sm:h-[78vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={active}
              src={current.src}
              alt={current.alt}
              fill
              quality={90}
              sizes="100vw"
              className="lb-fade object-contain"
            />
          </div>

          {/* Change buttons */}
          {total > 1 && (
            <>
              <button
                ref={prevRef}
                type="button"
                aria-label="Previous image"
                className={`${iconButton} absolute left-3 top-1/2 -translate-y-1/2 sm:left-6`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>

              <button
                ref={nextRef}
                type="button"
                aria-label="Next image"
                className={`${iconButton} absolute right-3 top-1/2 -translate-y-1/2 sm:right-6`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}

/* ---------------------------- Thumbnail -------------------------- */

export function LightboxImage({
  index,
  sizes,
  eager = false,
  className = "",
}: {
  index: number;
  sizes: string;
  /** Use for the above-the-fold image (LCP) */
  eager?: boolean;
  /** Frame classes, e.g. "aspect-[16/9]" */
  className?: string;
}) {
  const { images, open } = useLightbox();
  const item = images[index];
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handles images that finish loading before hydration
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <button
      type="button"
      aria-label={`View larger: ${item.alt}`}
      onClick={(e) => open(index, e.currentTarget)}
      className={`group relative block w-full cursor-zoom-in overflow-hidden bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 ${
        loaded ? "" : "lb-skeleton"
      } ${className}`}
    >
      <Image
        ref={imgRef}
        src={item.src}
        alt={item.alt}
        fill
        sizes={sizes}
        {...(eager
          ? { loading: "eager" as const, fetchPriority: "high" as const }
          : { loading: "lazy" as const })}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`object-contain transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Expand hint */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </span>
    </button>
  );
}