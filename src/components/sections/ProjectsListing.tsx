"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import type { SanityProject, SanityProjectCategory } from "@/sanity/lib/types";

interface Props {
  projects: SanityProject[];
  categories: SanityProjectCategory[];
}

export default function ProjectsListing({ projects, categories }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const filtered = active ? projects.filter((p) => p.category === active) : projects;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        <button
          onClick={() => setActive(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            active === null
              ? "bg-wood-600 text-white border-wood-600"
              : "border-wood-300 dark:border-wood-500 text-wood-600 dark:text-wood-200 hover:bg-wood-600 hover:text-white hover:border-wood-600"
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActive(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              active === cat.name
                ? "bg-wood-600 text-white border-wood-600"
                : "border-wood-300 dark:border-wood-500 text-wood-600 dark:text-wood-200 hover:bg-wood-600 hover:text-white hover:border-wood-600"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </>
  );
}
