import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projects } from "../../data/projects";
import {
  LightboxImage,
  LightboxProvider,
} from "../../../components/Imagelightbox";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* -----------------------------------------------------------
   Shared styles
   Keeps type sizes, colours and spacing consistent so the
   whole page reads as one system.
------------------------------------------------------------ */

// Small uppercase labels: 12px minimum, contrast 4.6:1 on white
const label =
  "text-xs font-medium uppercase tracking-[0.14em] text-neutral-500";

// Same label on dark backgrounds
const labelOnDark =
  "text-xs font-medium uppercase tracking-[0.14em] text-neutral-400";

// Two-column section grid: label on the left, content on the right
const sectionGrid =
  "mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-16 lg:gap-20";

// Section padding
const sectionSpacing = "px-4 py-20 sm:px-6 sm:py-28 md:px-10 lg:py-32";

// Medium headings
const sectionTitle =
  "max-w-3xl text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-neutral-900 sm:text-4xl md:text-5xl";

// Body copy: comfortable size, line height and line length
const bodyText = "max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg";

// Visible keyboard focus
const focusRing =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Abhijeet Kulkarni`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);

  const nextProject = projects[(currentIndex + 1) % projects.length];

  // Every image the viewer can step through: main image first, then gallery.
  // Index 0 is the main image; gallery image n is index n + 1.
  const lightboxImages = [
    { src: project.image, alt: `${project.title} project` },
    ...(project.gallery ?? []).map((src, index) => ({
      src,
      alt: `${project.title} UI screen ${index + 1}`,
    })),
  ];

  return (
    <LightboxProvider images={lightboxImages}>
      <main className="min-h-screen bg-white text-neutral-900 antialiased">
        {/* =====================================================
          HERO
      ====================================================== */}

        <section className="px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-10 md:px-10">
          <div className="mx-auto max-w-7xl">
            {/* Back */}
            <Link
              href="/projects"
              className={`mb-10 inline-flex items-center gap-2 ${label} transition-colors hover:text-neutral-900 ${focusRing}`}
            >
              <span aria-hidden="true">←</span>
              <span>Back to projects</span>
            </Link>

            {/* Meta */}
            <div className={`mb-6 flex flex-wrap items-center gap-3 ${label}`}>
              <span>{project.number}</span>

              <span aria-hidden="true" className="h-px w-6 bg-neutral-300" />

              <span>{project.category}</span>

              <span aria-hidden="true" className="h-px w-6 bg-neutral-300" />

              <span>{project.year}</span>
            </div>

            {/* Title */}
            <h1 className="max-w-5xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-neutral-950 sm:text-6xl md:text-7xl lg:text-8xl">
              {project.title}
            </h1>

            {/* Description + technologies */}
            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
              <p className="max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl sm:leading-9">
                {project.description}
              </p>

              <ul
                aria-label="Technologies used"
                className="flex flex-wrap gap-2 md:max-w-sm md:justify-end"
              >
                {project.technologies.map((technology) => (
                  <li
                    key={technology}
                    className="border border-neutral-300 px-3 py-1.5 text-xs font-medium tracking-wide text-neutral-700"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </div>

            {/* NDA / Demo access */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {project.nda ? (
                <div className="inline-flex items-center gap-3 border border-neutral-300 px-4 py-2.5">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-neutral-500"
                  />

                  <span className={label}>NDA Protected</span>
                </div>
              ) : project.url ? (
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-neutral-950 px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-neutral-800"
                >
                  Visit Demo
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {/* =====================================================
          MAIN IMAGE
          Fits inside its frame, loads eagerly (above the fold),
          shows a shimmer skeleton, and opens in the viewer on click.
      ====================================================== */}

        <section className="px-4 sm:px-6 md:px-10">
          <div className="mx-auto max-w-7xl">
            <LightboxImage
              index={0}
              eager
              sizes="(max-width: 768px) 100vw, 1200px"
              className="aspect-[16/9]"
            />
          </div>
        </section>

        {/* =====================================================
          NDA NOTE
      ====================================================== */}

        {project.nda && (
          <section className="px-4 pt-12 sm:px-6 md:px-10">
            <div className="mx-auto max-w-7xl">
              <div className="border-l-2 border-neutral-300 pl-5">
                <p className={label}>Confidential Project</p>

                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
                  Selected UI/UX work is presented for portfolio purposes.
                  Confidential business information, production access and
                  private client data are intentionally excluded.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
          OVERVIEW
      ====================================================== */}

        <section className={sectionSpacing}>
          <div className={sectionGrid}>
            <div className="md:sticky md:top-24 md:self-start">
              <p className={label}>01 / Overview</p>
            </div>

            <div>
              {/* Overview is a long sentence, so it is set smaller than a
                heading and with a comfortable line length. */}
              <h2 className="max-w-3xl text-2xl font-medium leading-snug tracking-[-0.02em] text-neutral-900 sm:text-3xl sm:leading-snug md:text-4xl md:leading-[1.25]">
                {project.overview}
              </h2>
            </div>
          </div>
        </section>

        {/* =====================================================
          MY ROLE
      ====================================================== */}

        <section className="border-y border-neutral-200 bg-neutral-50 px-4 py-16 sm:px-6 sm:py-20 md:px-10">
          <div className={sectionGrid}>
            <div className="md:sticky md:top-24 md:self-start">
              <p className={label}>02 / My Role</p>
            </div>

            <div>
              <h2 className={sectionTitle}>The work behind the product.</h2>

              <p className={`mt-8 ${bodyText}`}>{project.role}</p>
            </div>
          </div>
        </section>

        {/* =====================================================
          UI / UX SHOWCASE
      ====================================================== */}

        {project.gallery && project.gallery.length > 0 && (
          <section className={sectionSpacing}>
            <div className="mx-auto max-w-7xl">
              {/* Section heading */}
              <div className={`mb-14 ${sectionGrid}`}>
                <div className="md:sticky md:top-24 md:self-start">
                  <p className={label}>03 / UI & UX</p>
                </div>

                <div>
                  <h2 className={sectionTitle}>
                    A closer look at the interface.
                  </h2>

                  <p className={`mt-6 ${bodyText}`}>
                    Selected interface screens and UX work from the project.
                    Click any screen to view it larger.
                  </p>
                </div>
              </div>

              {/* Gallery: each image fits its frame and opens in the viewer */}
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {project.gallery.map((image, index) => (
                  <div
                    key={image}
                    className={index === 0 ? "md:col-span-2" : ""}
                  >
                    <LightboxImage
                      index={index + 1}
                      sizes={
                        index === 0
                          ? "(max-width: 768px) 100vw, 1200px"
                          : "(max-width: 768px) 100vw, 600px"
                      }
                      className="aspect-[16/10]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
          FEATURES
      ====================================================== */}

        <section className={sectionSpacing}>
          <div className={sectionGrid}>
            <div className="md:sticky md:top-24 md:self-start">
              <p className={label}>04 / Features</p>

              <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
                Key capabilities and product experiences built into the
                project.
              </p>
            </div>

            <ul className="border-t border-neutral-300">
              {project.features.map((feature, index) => (
                <li
                  key={feature}
                  className="flex items-baseline gap-5 border-b border-neutral-200 py-5 sm:py-6"
                >
                  <span className="w-8 shrink-0 text-xs font-medium tabular-nums text-neutral-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-lg leading-snug tracking-tight text-neutral-900 sm:text-xl">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =====================================================
          CHALLENGES
      ====================================================== */}

        <section className="bg-neutral-950 px-4 py-20 text-white sm:px-6 sm:py-28 md:px-10 lg:py-32">
          <div className={sectionGrid}>
            <div className="md:sticky md:top-24 md:self-start">
              <p className={labelOnDark}>05 / Challenges</p>

              <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-400">
                Problems and constraints considered during the development
                process.
              </p>
            </div>

            <ul className="border-t border-white/20">
              {project.challenges.map((challenge, index) => (
                <li
                  key={challenge}
                  className="flex items-baseline gap-5 border-b border-white/15 py-6 sm:py-7"
                >
                  <span className="w-8 shrink-0 text-xs font-medium tabular-nums text-neutral-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="max-w-2xl text-lg leading-8 text-neutral-200 sm:text-xl sm:leading-9">
                    {challenge}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =====================================================
          TECHNOLOGY
      ====================================================== */}

        <section className="border-b border-neutral-200 bg-neutral-50 px-4 py-16 sm:px-6 sm:py-20 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <p className={label}>06 / Technology</p>

                <h2 className="mt-4 max-w-md text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-neutral-900 sm:text-4xl">
                  Built with the right tools.
                </h2>
              </div>

              <ul
                aria-label="Technologies used"
                className="flex flex-wrap content-start gap-3"
              >
                {project.technologies.map((technology) => (
                  <li
                    key={technology}
                    className="border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =====================================================
          OUTCOME
      ====================================================== */}

        <section className={sectionSpacing}>
          <div className={sectionGrid}>
            <div className="md:sticky md:top-24 md:self-start">
              <p className={label}>07 / Outcome</p>
            </div>

            <div>
              <h2 className="max-w-4xl text-2xl font-medium leading-snug tracking-[-0.02em] text-neutral-900 sm:text-3xl md:text-4xl md:leading-[1.25] lg:text-5xl lg:leading-[1.2]">
                {project.outcome}
              </h2>
            </div>
          </div>
        </section>

        {/* =====================================================
          NEXT PROJECT
      ====================================================== */}

        <section className="border-t border-neutral-200 px-4 py-16 sm:px-6 sm:py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={label}>Next project</p>

                <h2 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-5xl md:text-6xl">
                  {nextProject.title}
                </h2>

                <p className="mt-4 max-w-md text-base leading-7 text-neutral-600">
                  {nextProject.description}
                </p>
              </div>

              <Link
                href={`/projects/${nextProject.slug}`}
                className={`group inline-flex shrink-0 items-center gap-3 border-b border-neutral-900 pb-1.5 text-sm font-medium uppercase tracking-[0.12em] text-neutral-900 ${focusRing}`}
              >
                View project
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
          ALL PROJECTS
      ====================================================== */}

        <section className="border-t border-neutral-200 px-4 py-8 sm:px-6 md:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span className="text-xs font-medium tabular-nums tracking-[0.12em] text-neutral-500">
              {project.number} / {projects.length}
            </span>

            <Link
              href="/projects"
              className={`text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-neutral-900 ${focusRing}`}
            >
              View all projects →
            </Link>
          </div>
        </section>
      </main>
    </LightboxProvider>
  );
}