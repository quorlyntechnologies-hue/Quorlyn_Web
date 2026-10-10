import Image from "next/image";
import Link from "next/link";

import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import type { Project } from "@/content/projects";

/** Published artwork and plain project facts, shared by home and the work index. */
export function ProjectPreview({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const cover = project.images[0];
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="grid gap-8 border-t border-line py-8 lg:grid-cols-2 lg:items-center lg:gap-12">
      {cover && (
        <Link href={`/work/${project.slug}`} className="block overflow-hidden rounded-md">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, 100vw"
            className="h-auto w-full"
          />
        </Link>
      )}
      <div className={cover ? undefined : "lg:col-span-2"}>
        <Heading className="text-h3 font-medium text-fg">
          <Link href={`/work/${project.slug}`} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </Heading>
        <p className="mt-3 text-sm text-subtle">
          {project.category} · {project.year}
          {project.client && ` · ${project.client}`}
        </p>
        <p className="mt-5 max-w-[65ch] leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          {project.publication && (
            <ButtonLink href={project.publication.actionUrl} className="group">
              {project.publication.actionLabel}
              <ArrowRight />
            </ButtonLink>
          )}
          <Link
            href={`/work/${project.slug}`}
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-accent"
          >
            {project.publication ? "About the game" : "Read case study"}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
