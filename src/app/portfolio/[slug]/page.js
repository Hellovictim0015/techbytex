import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, PlayCircle } from "lucide-react";
import JsonLd from "../../components/JsonLd";
import { absoluteUrl, breadcrumbSchema, createMetadata, SITE_NAME } from "../../lib/seo";
import { getPortfolioProject, getVisiblePortfolio } from "../../lib/portfolio";

// Case study for one project from Admin → Portfolio, e.g. /portfolio/balod-eco-tourism.
export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getVisiblePortfolio();
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

const imageUrl = (image) => (typeof image === "string" ? image : image?.src);
const unoptimized = (src) => typeof src === "string" && !src.startsWith("/");

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) {
    return createMetadata({ title: "Project Not Found", description: "Project not found.", path: "/portfolio" });
  }
  const summary = project.description || project.caseStudy?.problem || project.subtitle || "";
  return createMetadata({
    title: project.seoHeading || `${project.title} — ${project.category || "Project"} Case Study`,
    description: summary.slice(0, 158) || `${project.title}: a ${(project.category || "project").toLowerCase()} built by ${SITE_NAME}.`,
    path: `/portfolio/${project.slug}`,
    image: imageUrl(project.image),
  });
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const found = await getPortfolioProject(slug);
  if (!found) notFound();
  const project = {
    ...found,
    stats: found.stats || [],
    technologies: found.technologies || [],
    features: found.features || [],
  };
  const { problem, solution, result } = project.caseStudy || {};
  const path = `/portfolio/${project.slug}`;
  const img = imageUrl(project.image);

  return (
    <main className="bg-slate-50 pt-28 pb-20 font-sans">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description || problem || project.subtitle || undefined,
            url: absoluteUrl(path),
            image: img ? (img.startsWith("http") ? img : absoluteUrl(img)) : undefined,
            genre: project.category,
            keywords: project.technologies.join(", ") || undefined,
            creator: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
          },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:underline">
          <ArrowLeft size={16} /> All projects
        </Link>

        <header className="mt-6">
          <span className="rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
            {project.category} case study
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">{project.title}</h1>
          {project.subtitle && <p className="mt-3 text-lg text-slate-600">{project.subtitle}</p>}
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {project.clientType && (
              <div>
                <dt className="text-slate-400">Client</dt>
                <dd className="font-semibold text-slate-800">{project.clientType}</dd>
              </div>
            )}
            {project.role && (
              <div>
                <dt className="text-slate-400">Our role</dt>
                <dd className="font-semibold text-slate-800">{project.role}</dd>
              </div>
            )}
          </dl>
          {(project.link || project.videoUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white hover:bg-[#6D28D9]"
                >
                  Visit live project <ArrowUpRight size={16} />
                </a>
              )}
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Watch demo <PlayCircle size={16} />
                </a>
              )}
            </div>
          )}
        </header>

        {project.image && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <Image
              src={project.image}
              alt={project.altText || project.title}
              fill
              priority
              sizes="(min-width: 1024px) 1000px, 100vw"
              unoptimized={unoptimized(project.image)}
              className="object-contain"
            />
          </div>
        )}

        {project.stats.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {project.stats.map((s) => (
              <li key={s} className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-800">
                {s}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 grid gap-6">
          {project.description && <Section title="Overview">{project.description}</Section>}
          {problem && <Section title="The problem">{problem}</Section>}
          {solution && <Section title="Our solution">{solution}</Section>}
          {result && <Section title="Results">{result}</Section>}
          {project.features.length > 0 && (
            <Section title="Key features">
              <ul className="list-disc space-y-1 pl-5">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Section>
          )}
          {project.technologies.length > 0 && (
            <Section title="Tech stack">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-3 py-1 text-sm font-medium text-[#6D28D9]">
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        <div className="mt-12 rounded-3xl bg-slate-900 p-8 text-center text-white md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Want something similar for your business?</h2>
          <p className="mt-3 text-slate-300">Tell us what you need — we reply within 24 hours with a clear, fixed quote.</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 font-bold text-white hover:bg-[#6D28D9]"
          >
            Get a free quote <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
