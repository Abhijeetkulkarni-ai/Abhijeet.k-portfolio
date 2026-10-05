"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Testimonial = {
    quote: string;
    name: string;
    business: string;
    role: string;
    country: string;
};

// Replace these examples with genuine, client-approved testimonials and details
// before publishing. Do not present placeholder feedback as real client reviews.
const testimonials: Testimonial[] = [
    {
        quote:
            "Replace this with genuine feedback about the project, collaboration, and outcome.",
        name: "Bhavik kulkarni",
        business: "Client Company",
        role: "Founder",
        country: "India",
    },
    {
        quote:
            "Add approved client feedback highlighting the solution and its business impact.",
        name: "Client Name",
        business: "Client Company",
        role: "CEO",
        country: "United States",
    },
    {
        quote:
            "Add genuine feedback describing the client's experience working with you.",
        name: "Client Name",
        business: "Client Company",
        role: "Business Owner",
        country: "United Kingdom",
    },
];

const stats = [
    { value: 400, suffix: "+", label: "Applications" },
    { value: 200, suffix: "+", label: "Projects" },
    { value: 30, suffix: "+", label: "Custom Software" },
];

function ClientAttribution({ item }: { item: Testimonial }) {
    return (
        <div>
            <p className="text-sm font-semibold tracking-tight">{item.name}</p>
            <p className="mt-1 text-xs text-neutral-600">{item.business}</p>
            <p className="mt-1 text-xs text-neutral-500">
                {item.role} <span aria-hidden="true">·</span> {item.country}
            </p>
        </div>
    );
}

export default function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);
    const statsSectionRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            const heading = section.querySelector<HTMLElement>(
                ".testimonials-heading"
            );
            const cards = gsap.utils.toArray<HTMLElement>(
                section.querySelectorAll(".testimonial-stack-card")
            );

            if (!heading || cards.length === 0) return;

            // Keep the content readable without scroll-driven animation when the
            // visitor has requested reduced motion.
            if (reducedMotion) {
                gsap.set([heading, ...cards], { clearProps: "all" });
                return;
            }

            gsap.set(cards, {
                xPercent: 0,
                yPercent: 115,
                autoAlpha: 0,
                scale: 0.96,
                rotate: 0,
                transformOrigin: "50% 50%",
                force3D: true,
            });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${window.innerHeight * 3.1}`,
                    pin: true,
                    scrub: 1,
                    snap: {
                        snapTo: "labelsDirectional",
                        duration: { min: 0.2, max: 0.55 },
                        delay: 0.05,
                        ease: "power1.inOut",
                    },
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            timeline.fromTo(
                heading,
                { y: 12, autoAlpha: 0.5 },
                { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" },
                0
            );

            cards.forEach((card, index) => {
                const position = 0.35 + index * 1.05;
                timeline.addLabel(`testimonial-${index}`, position);

                // Earlier cards recede slightly as the next card arrives.
                if (index > 0) {
                    cards.slice(0, index).forEach((previousCard, previousIndex) => {
                        const depth = index - previousIndex;
                        timeline.to(
                            previousCard,
                            {
                                y: -14 * depth,
                                scale: 1 - 0.035 * depth,
                                autoAlpha: Math.max(0.52, 0.82 - depth * 0.12),
                                rotate: 0,
                                duration: 0.42,
                                ease: "power2.out",
                            },
                            position
                        );
                    });
                }

                timeline.fromTo(
                    card,
                    {
                        yPercent: 115,
                        autoAlpha: 0,
                        scale: 0.96,
                    },
                    {
                        yPercent: 0,
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.82,
                        ease: "power3.out",
                    },
                    position + 0.06
                );
            });
        }, section);

        return () => ctx.revert();
    }, []);

    useLayoutEffect(() => {
        const section = statsSectionRef.current;
        if (!section) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            const counters = section.querySelectorAll<HTMLElement>(".stat-count");

            counters.forEach((element) => {
                const target = Number(element.dataset.target);

                if (reducedMotion) {
                    element.textContent = String(target);
                    return;
                }

                const counter = { value: 0 };

                gsap.to(counter, {
                    value: target,
                    duration: 1.8,
                    ease: "power2.out",
                    snap: { value: 1 },
                    scrollTrigger: {
                        trigger: section,
                        start: "top 75%",
                        once: true,
                    },
                    onUpdate: () => {
                        element.textContent = String(Math.round(counter.value));
                    },
                });
            });

            if (reducedMotion) return;

            const rightwardTrack =
                section.querySelector<HTMLElement>(".marquee-right");
            const leftwardTrack =
                section.querySelector<HTMLElement>(".marquee-left");

            // Keep the marquee moving without pinning this section, so normal
            // page scrolling can continue naturally to the next section/footer.
            if (rightwardTrack) {
                gsap.fromTo(
                    rightwardTrack,
                    { xPercent: -50 },
                    {
                        xPercent: 0,
                        duration: 28,
                        ease: "none",
                        repeat: -1,
                    }
                );
            }

            if (leftwardTrack) {
                gsap.fromTo(
                    leftwardTrack,
                    { xPercent: 0 },
                    {
                        xPercent: -50,
                        duration: 22,
                        ease: "none",
                        repeat: -1,
                    }
                );
            }
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <main>
            <section
                ref={sectionRef}
                aria-labelledby="testimonials-title"
                className="relative isolate w-full overflow-hidden bg-white text-black"
            >
                <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-16 md:px-10">
                    <div
                        className="testimonials-heading pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center text-center uppercase leading-[0.78] tracking-[-0.075em]"
                    >
                        <h2
                            id="testimonials-title"
                            className="text-[clamp(3.5rem,13.5vw,12.5rem)] font-semibold"
                        >
                            Ideas
                        </h2>
                        <span className="mt-2 text-[clamp(3.5rem,13.5vw,12.5rem)] font-semibold">
                            Into
                        </span>
                        <span className="mt-2 text-[clamp(3.5rem,13.5vw,12.5rem)] font-semibold">
                            Impact
                        </span>
                    </div>

                    <div className="relative z-10 mt-[10vh] flex h-[min(430px,58svh)] w-full max-w-[590px] items-center justify-center md:mt-[12vh] md:h-[420px]">
                        {testimonials.map((item, index) => (
                            <article
                                key={`${item.name}-${item.business}-${index}`}
                                className="testimonial-stack-card absolute left-0 top-0 flex min-h-[320px] w-full flex-col border border-neutral-200 bg-white/95 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-neutral-400 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] sm:p-7 md:min-h-[350px] md:p-9"
                                style={{
                                    zIndex: index + 1,
                                    willChange: "transform, opacity",
                                }}
                            >
                                <div className="mb-6 flex items-center justify-between sm:mb-8">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                                        {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="text-4xl leading-none text-neutral-400"
                                    >
                                        “
                                    </span>
                                </div>

                                <blockquote className="max-w-[31ch] text-lg font-normal leading-snug tracking-[-0.035em] sm:text-2xl md:text-[1.75rem]">
                                    “{item.quote}”
                                </blockquote>

                                <div className="mt-auto pt-6 sm:pt-8">
                                    <div className="mb-4 h-px w-full bg-neutral-200" />
                                    <ClientAttribution item={item} />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                ref={statsSectionRef}
                aria-label="Our work and client testimonials"
                className="flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-white py-8 text-black md:py-10"
            >
                <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
                    <div className="grid grid-cols-3 gap-4 border-b border-neutral-200 pb-5 md:pb-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col gap-2">
                                <div className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
                                    <span
                                        className="stat-count tabular-nums"
                                        data-target={stat.value}
                                    >
                                        0
                                    </span>
                                    <span>{stat.suffix}</span>
                                </div>
                                <p className="max-w-[140px] text-[8px] uppercase leading-relaxed tracking-[0.1em] text-neutral-500 sm:text-[9px] md:max-w-none md:text-[10px]">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-end justify-between gap-4 py-5 md:py-6">
                        <h2 className="text-xl font-medium tracking-tight sm:text-2xl md:text-3xl">
                            Words from the people
                            <br />
                            behind the projects.
                        </h2>
                        <span className="hidden text-[10px] uppercase tracking-[0.12em] text-neutral-500 sm:block">
                            Client testimonials ↗
                        </span>
                    </div>
                </div>

                {/* First row: left to right */}
                <div className="mb-3 overflow-hidden">
                    <div className="marquee-right flex w-max gap-4">
                        {[...testimonials, ...testimonials].map((item, index) => (
                            <article
                                key={`right-${index}`}
                                aria-hidden={index >= testimonials.length ? true : undefined}
                                className="flex w-[min(72vw,300px)] shrink-0 flex-col border border-neutral-200 bg-neutral-50 p-4 md:w-[320px] md:p-5"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                                        Testimonial {String((index % testimonials.length) + 1).padStart(2, "0")}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="text-3xl text-neutral-400"
                                    >
                                        “
                                    </span>
                                </div>
                                <blockquote className="text-base leading-relaxed tracking-tight md:text-lg">
                                    “{item.quote}”
                                </blockquote>
                                <div className="mt-7 border-t border-neutral-200 pt-4">
                                    <ClientAttribution item={item} />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Second row: right to left */}
                <div className="overflow-hidden">
                    <div className="marquee-left flex w-max gap-4">
                        {[...testimonials].reverse().concat([...testimonials].reverse()).map(
                            (item, index) => (
                                <article
                                    key={`left-${index}`}
                                    aria-hidden={index >= testimonials.length ? true : undefined}
                                    className="flex w-[min(72vw,300px)] shrink-0 flex-col border border-neutral-200 bg-white p-4 md:w-[320px] md:p-5"
                                >
                                    <div className="mb-6 flex items-center justify-between">
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
                                    <blockquote className="text-base leading-relaxed tracking-tight md:text-lg">
                                        “{item.quote}”
                                    </blockquote>
                                    <div className="mt-7 border-t border-neutral-200 pt-4">
                                        <ClientAttribution item={item} />
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                </div>

                <p className="mt-4 px-5 text-center text-[8px] uppercase tracking-[0.12em] text-neutral-400">
                    Built through collaboration
                </p>
            </section>
        </main>
    );
}
