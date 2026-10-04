
"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    FiArrowUpRight,
    FiArrowUp,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const signatureRef = useRef<SVGSVGElement>(null);

    useLayoutEffect(() => {
        const footer = footerRef.current;
        const signature = signatureRef.current;

        if (!footer || !signature) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add(
                "(prefers-reduced-motion: no-preference)",
                () => {
                    const paths =
                        signature.querySelectorAll<SVGPathElement>(
                            ".signature-path",
                        );

                    paths.forEach((path) => {
                        const length = path.getTotalLength();

                        gsap.set(path, {
                            strokeDasharray: length,
                            strokeDashoffset: length,
                        });
                    });

                    gsap.to(paths, {
                        strokeDashoffset: 0,
                        stagger: 0.12,
                        ease: "none",
                        scrollTrigger: {
                            trigger: footer,
                            start: "top 65%",
                            end: "bottom bottom",
                            scrub: 0.6,
                        },
                    });
                },
            );

            return () => mm.revert();
        }, footer);

        return () => ctx.revert();
    }, []);

    return (
        <footer
            ref={footerRef}
            className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black px-5 text-white sm:px-8 lg:h-screen lg:min-h-[600px] lg:px-12"
        >
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
                {/* TOP: Closing message */}
                <div className="flex flex-col items-start justify-center gap-5 pt-12 sm:flex-row sm:items-end sm:justify-between sm:pt-14 lg:pt-12">
                    <div>
                        <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-white/45 sm:text-xs">
                            Have something in mind?
                        </p>

                        <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Let&apos;s make something{" "}
                            <span className="text-white/40">meaningful.</span>
                        </h2>
                    </div>

                    <a
                        href="mailto:YOUR_EMAIL@example.com"
                        className="group inline-flex shrink-0 items-center gap-2 border-b border-white/30 pb-2 text-sm transition-colors hover:border-white"
                    >
                        Let&apos;s talk
                        <FiArrowUpRight className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>
                </div>

                {/* MIDDLE: Animated signature */}
                <div className="flex flex-1 flex-col items-center justify-center py-10">
                    <p className="mb-5 text-[9px] uppercase tracking-[0.4em] text-white/35 sm:text-[10px]">
                        Signed, Abhijeet
                    </p>

                   
                    <svg
                        ref={signatureRef}
                        viewBox="0 0 1200 340"
                        role="img"
                        aria-label="Abhijeet S. Kulkarni signature"
                        className="block w-full max-w-5xl overflow-visible"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g
                            stroke="white"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {/* Large, expressive A */}
                            <path
                                className="signature-path"
                                d="
        M95 232
        C119 186 174 69 201 49
        C216 38 213 72 199 111
        C181 163 150 224 145 249
        C141 269 166 233 194 204
        C218 180 240 165 252 175
        C264 185 236 214 235 226
        C234 241 258 226 280 201
      "
                            />

                            {/* bhijeet — connected handwritten flow */}
                            <path
                                className="signature-path"
                                d="
        M280 201
        C291 184 304 164 317 143
        C328 124 342 106 348 113
        C356 122 330 174 319 204
        C313 221 327 219 345 196
        C363 174 381 163 390 175
        C399 188 373 211 377 222
        C382 235 404 208 421 188
        C438 168 453 166 460 178
        C467 190 445 210 450 222
        C456 236 481 208 497 189
        C514 170 527 169 533 180
        C539 191 518 211 523 222
        C529 235 552 209 569 189
        C584 172 599 170 605 181
        C611 192 590 211 596 222
        C603 235 624 211 642 190
      "
                            />

                            {/* S. — distinctive middle initial */}
                            <path
                                className="signature-path"
                                d="
        M672 157
        C690 135 726 103 747 109
        C763 113 745 136 726 151
        C705 167 681 181 675 199
        C669 216 692 220 713 207
        C728 198 740 185 748 174
        C758 160 765 173 758 190
        C750 208 743 224 750 232
        C759 242 777 224 791 207
      "
                            />

                            {/* Kulkarni — flowing final name */}
                            <path
                                className="signature-path"
                                d="
        M818 205
        C841 171 866 120 880 88
        C890 66 900 73 890 99
        C875 139 851 191 843 214
        C836 236 862 206 882 185
        C899 167 915 165 922 176
        C929 187 906 208 912 220
        C919 233 942 205 959 187
        C976 169 990 168 997 179
        C1004 191 984 210 990 220
        C997 232 1019 207 1036 189
        C1052 172 1065 174 1067 185
        C1069 197 1052 211 1058 220
        C1065 230 1084 210 1102 190
      "
                            />

                            {/* Long signature underline */}
                            <path
                                className="signature-path"
                                d="
        M111 270
        C318 294 526 269 702 258
        C863 248 1010 256 1141 224
        C1100 250 1053 265 1015 269
      "
                            />

                            {/* Final pen flourish */}
                            <path
                                className="signature-path"
                                d="
        M1022 239
        C1055 218 1087 216 1104 229
        C1118 240 1103 253 1093 245
        C1085 238 1103 226 1122 235
        C1136 241 1147 251 1154 259
      "
                            />
                        </g>
                    </svg>

                    <p className="mt-5 text-center text-xs text-white/35 sm:text-sm">
                        Building ideas into reality.
                    </p>
                </div>

                {/* BOTTOM: Normal footer details */}
                <div className="mt-auto border-t border-white/15">
                    <div className="grid grid-cols-2 gap-8 py-7 sm:grid-cols-3 sm:py-8">
                        <div>
                            <Link
                                href="/"
                                className="text-base font-medium tracking-tight"
                            >
                                Abhijeet Kulkarni
                                <span className="text-violet-400">.</span>
                            </Link>

                            <p className="mt-2 text-xs text-white/40">
                                Developer & entrepreneur
                            </p>
                        </div>

                        <div>
                            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/35">
                                Explore
                            </p>

                            <div className="flex flex-col items-start gap-2 text-xs text-white/65">
                                <Link href="/" className="hover:text-white">
                                    Home
                                </Link>
                                <Link href="/about" className="hover:text-white">
                                    About
                                </Link>
                                <Link href="/projects" className="hover:text-white">
                                    Projects
                                </Link>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/35">
                                Connect
                            </p>

                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/65">
                                <a
                                    href="https://www.instagram.com/abhijeetk.builds/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-white"
                                >
                                    Instagram ↗
                                </a>

                                <a
                                    href="https://www.linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-white"
                                >
                                    LinkedIn ↗
                                </a>

                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-white"
                                >
                                    GitHub ↗
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 py-4 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} Abhijeet Kulkarni.
                            All rights reserved.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            className="inline-flex w-fit items-center gap-2 transition-colors hover:text-white"
                        >
                            Back to top <FiArrowUp />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

