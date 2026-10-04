
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiJavascript,
    SiHtml5,
    SiCss,
    SiNodedotjs,
    SiExpress,
    SiPython,
    SiFastapi,
    SiPostgresql,
    SiMongodb,
    SiSupabase,
    SiGit,
    SiGithub,
    SiDocker,
    SiVercel,
} from "react-icons/si";

import {
    FiDatabase,
    FiZap,
    FiLayers,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const expertise = [
    {
        number: "01",
        title: "Frontend Development",
        description:
            "Building responsive, interactive interfaces with thoughtful design, smooth motion, and attention to detail.",
        technologies: [
            { name: "React", icon: SiReact },
            { name: "Next.js", icon: SiNextdotjs },
            { name: "TypeScript", icon: SiTypescript },
            { name: "JavaScript", icon: SiJavascript },
            { name: "HTML5", icon: SiHtml5 },
            { name: "CSS3", icon: SiCss },
            { name: "GSAP", icon: FiLayers },
        ],
    },
    {
        number: "02",
        title: "Backend & Databases",
        description:
            "Designing reliable APIs, backend services, and database systems that power real-world applications.",
        technologies: [
            { name: "Node.js", icon: SiNodedotjs },
            { name: "Express", icon: SiExpress },
            { name: "Python", icon: SiPython },
            { name: "FastAPI", icon: SiFastapi },
            { name: "PostgreSQL", icon: SiPostgresql },
            { name: "MongoDB", icon: SiMongodb },
            { name: "Supabase", icon: SiSupabase },
        ],
    },
    {
        number: "03",
        title: "AI & Automation",
        description:
            "Integrating AI into business workflows, automating repetitive tasks, and turning data into useful intelligence.",
        technologies: [
            { name: "OpenAI APIs", icon: FiZap },
            { name: "AI Integration", icon: FiZap },
            { name: "Workflow Automation", icon: FiLayers },
            { name: "Company Intelligence", icon: FiDatabase },
        ],
    },
    {
        number: "04",
        title: "Products & Infrastructure",
        description:
            "Developing business software and deploying scalable products, from ERP systems to SaaS applications.",
        technologies: [
            { name: "ERP & CRM", icon: FiLayers },
            { name: "SaaS", icon: FiZap },
            { name: "REST APIs", icon: FiDatabase },
            { name: "Git", icon: SiGit },
            { name: "GitHub", icon: SiGithub },
            { name: "Docker", icon: SiDocker },
            { name: "Vercel", icon: SiVercel },
        ],
    },
];

export default function TechStack() {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;

        if (!section || !stage) return;

        const ctx = gsap.context(() => {
            const groups =
                gsap.utils.toArray<HTMLElement>(".stack-group");

            if (groups.length === 0) return;

            const mm = gsap.matchMedia();

            mm.add(
                "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
                () => {
                    // Keep all categories in one shared viewport.
                    gsap.set(stage, {
                        position: "relative",
                        height: "100vh",
                        overflow: "hidden",
                    });

                    gsap.set(groups, {
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        autoAlpha: 0,
                        yPercent: 18,
                        willChange: "transform, opacity",
                    });

                    // First category is visible when the section starts.
                    gsap.set(groups[0], {
                        autoAlpha: 1,
                        yPercent: 0,
                    });


                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: () =>
                                `+=${window.innerHeight * (groups.length - 1)}`,
                            pin: true,
                            scrub: 0.5,
                            snap: {
                                snapTo: 1 / (groups.length - 1),
                                duration: { min: 0.2, max: 0.45 },
                                delay: 0.05,
                                ease: "power2.inOut",
                            },
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    groups.slice(0, -1).forEach((current, index) => {
                        const next = groups[index + 1];
                        const position = index;

                        // Current category exits upward.
                        timeline.to(
                            current,
                            {
                                yPercent: -18,
                                autoAlpha: 0,
                                duration: 0.45,
                                ease: "power2.inOut",
                            },
                            position,
                        );

                        // Next category enters from below.
                        timeline.fromTo(
                            next,
                            {
                                yPercent: 18,
                                autoAlpha: 0,
                            },
                            {
                                yPercent: 0,
                                autoAlpha: 1,
                                duration: 0.55,
                                ease: "power2.out",
                                immediateRender: false,
                            },
                            position + 0.45,
                        );
                    });


                    return () => {
                        timeline.scrollTrigger?.kill();
                        timeline.kill();
                        gsap.set([stage, ...groups], {
                            clearProps: "all",
                        });
                    };
                },
            );

            return () => mm.revert();
        }, section);

        return () => ctx.revert();
    }, []);
    return (
        <section
            ref={sectionRef}
            id="tech-stack"
            className="tech-stack-section bg-background px-6 py-24 text-foreground sm:px-10 sm:py-32 md:h-screen md:py-0"
        >
            <div className="mx-auto grid max-w-7xl gap-14 md:h-full md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-20">
                {/* Left: stays vertically centered */}
                <div className="stack-heading flex flex-col justify-center md:h-full">
                    <span className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                        What I work with
                    </span>

                    <h2 className="max-w-lg text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                        The tools behind what I build.
                    </h2>

                    <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
                        From crafting intuitive interfaces to engineering
                        intelligent systems, these are the technologies I use
                        to turn ideas into real-world products.
                    </p>

                    <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="h-px w-8 bg-current" />
                        <span>Design. Engineer. Automate.</span>
                    </div>
                </div>

                {/* Right: scroll-controlled category stage */}
                <div
                    ref={stageRef}
                    className="stack-list relative min-w-0 md:h-full"
                >
                    {expertise.map((group) => (
                        <article
                            key={group.number}
                            className="stack-group border-t border-border py-10 md:border-t-0 md:py-0"
                        >
                            <div className="mb-7 flex items-center gap-4">
                                <span className="font-mono text-sm text-muted-foreground">
                                    {group.number}
                                </span>

                                <span className="h-px flex-1 bg-border" />

                                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Expertise
                                </span>
                            </div>

                            <h3 className="text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl">
                                {group.title}
                            </h3>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                                {group.description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {group.technologies.map((technology) => {
                                    const Icon = technology.icon;

                                    return (
                                        <div
                                            key={technology.name}
                                            className="tech-item flex items-center gap-2.5 rounded-full border border-border px-3.5 py-2.5 text-sm transition-colors duration-300 hover:border-foreground/40"
                                        >
                                            <Icon
                                                className="h-4 w-4 shrink-0 text-foreground/80"
                                                aria-hidden="true"
                                            />

                                            <span>{technology.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </div>

                <p className="text-xs tracking-wide text-muted-foreground md:hidden">
                    Always learning. Always building.
                </p>
            </div>
        </section>
    );
}
