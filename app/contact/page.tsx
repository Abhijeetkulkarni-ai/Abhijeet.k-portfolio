"use client";

import { useState, type FormEvent } from "react";
import {
FiArrowUpRight,
FiCheckCircle,
FiLoader,
FiRefreshCw,
} from "react-icons/fi";

const projectTypes = [
"Website Development",
"Web Application",
"Mobile App",
"ERP / CRM Software",
"AI & Automation",
"E-commerce",
"UI/UX Design",
"Other",
];

const budgets = [
"Under ₹25,000",
"₹25,000 – ₹50,000",
"₹50,000 – ₹1 Lakh",
"₹1 – ₹5 Lakhs",
"₹5 Lakhs+",
"Not decided yet",
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
const [status, setStatus] = useState<FormStatus>("idle");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();


if (status === "submitting") return;

const form = event.currentTarget;
const formData = new FormData(form);

const payload = {
  name: String(formData.get("name") || "").trim(),
  email: String(formData.get("email") || "").trim(),
  projectType: String(formData.get("projectType") || ""),
  budget: String(formData.get("budget") || ""),
  message: String(formData.get("message") || "").trim(),
};

setStatus("submitting");

try {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to send your message.");
  }

  setStatus("success");
  form.reset();
} catch {
  setStatus("error");
}

}

const inputClass =
"mt-3 min-h-12 w-full rounded-none border-0 border-b border-gray-300 bg-transparent px-0 py-3 text-base text-black outline-none transition-colors duration-300 placeholder:text-gray-400 focus:border-black focus:ring-0 sm:text-sm";

const labelClass = "block text-sm font-medium text-gray-800";

return ( <main className="min-h-screen overflow-x-clip bg-white px-6 py-20 text-black sm:px-10 sm:py-24 lg:py-28"> <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-14 md:grid-cols-2 md:gap-16 lg:gap-24">
{/* Introduction */} <section className="min-w-0"> <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
Get in touch </p>


      <h1 className="mt-6 text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
        Let&apos;s build
        <br />
        something
        <br />
        <span className="text-gray-400">meaningful.</span>
      </h1>

      <p className="mt-7 max-w-md text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
        Have an idea, a project, or a business challenge?
        Tell me what you&apos;re working on, and let&apos;s
        explore how we can bring it to life.
      </p>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Prefer email?
        </p>

        <a
          href="mailto:abhijeetkulkarni.ai@gmail.com"
          className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          abhijeetkulkarni.ai@gmail.com
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <p className="mt-12 text-xs uppercase tracking-[0.2em] text-gray-400">
        Based in India · Working worldwide
      </p>
    </section>

    {/* Contact form */}
    <section className="min-w-0">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <p className="text-sm text-gray-500">
          Have a project in mind?
        </p>

        <h2 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
          Tell me about it.
        </h2>
      </div>

      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-64 flex-col items-start justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-10"
        >
          <FiCheckCircle className="mb-5 h-8 w-8 text-black" />

          <h3 className="text-2xl font-medium tracking-tight text-black sm:text-3xl">
            Message received.
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-gray-600">
            Thank you for reaching out. I appreciate your interest
            and will get back to you as soon as possible.
          </p>

          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-gray-600 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <FiRefreshCw className="h-4 w-4" />
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-7 sm:space-y-9"
        >
          {/* Name and email */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7">
            <div className="min-w-0">
              <label htmlFor="contact-name" className={labelClass}>
                Your name <span aria-hidden="true">*</span>
              </label>

              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className={inputClass}
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            <div className="min-w-0">
              <label htmlFor="contact-email" className={labelClass}>
                Email address <span aria-hidden="true">*</span>
              </label>

              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john@company.com"
                className={inputClass}
                maxLength={254}
                required
              />
            </div>
          </div>

          {/* Project type and budget */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7">
            <div className="min-w-0">
              <label htmlFor="contact-project-type" className={labelClass}>
                What do you need?
              </label>

              <select
                id="contact-project-type"
                name="projectType"
                defaultValue=""
                className={`${inputClass} cursor-pointer`}
              >
                <option value="" disabled>
                  Select a project type
                </option>

                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label htmlFor="contact-budget" className={labelClass}>
                Estimated budget{" "}
                <span className="text-gray-400">(optional)</span>
              </label>

              <select
                id="contact-budget"
                name="budget"
                defaultValue=""
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select your budget</option>

                {budgets.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="contact-message" className={labelClass}>
              Tell me about your project{" "}
              <span aria-hidden="true">*</span>
            </label>

            <textarea
              id="contact-message"
              name="message"
              rows={4}
              placeholder="Tell me about your idea, goals, timeline, or the problem you want to solve..."
              className={`${inputClass} min-h-32 resize-y`}
              minLength={10}
              maxLength={5000}
              required
            />

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Share as much detail as you can. It helps me understand
              what you&apos;re looking to build.
            </p>
          </div>

          {/* Error message */}
          {status === "error" && (
            <p
              role="alert"
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700"
            >
              Your message couldn&apos;t be sent. Please try again
              or contact me directly at abhijeetkulkarni.ai@gmail.com.
            </p>
          )}

          {/* Submit */}
          <div className="flex flex-col gap-5 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-xs leading-5 text-gray-500">
              Your information will only be used to respond to your
              enquiry.
            </p>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-black bg-black px-7 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send message
                  <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  </div>
</main>


);
}
