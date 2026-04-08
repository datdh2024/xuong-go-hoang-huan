"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectFilter from "@/components/sections/ProjectFilter";

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  location: string;
  completedYear: number;
  description: string;
  category: { name: string } | null;
  thumbnail: { asset: { url: string } } | null;
}

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
}

interface Props {
  projects: Project[];
  categories: Category[];
}

export default function ProjectsPageContent({ projects, categories }: Props) {
  const [selected, setSelected] = useState("Tất cả");

  const filtered =
    selected === "Tất cả"
      ? projects
      : projects.filter((p) => p.category?.name === selected);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ProjectFilter
          categories={categories.map((c) => c.name)}
          onFilter={setSelected}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard
              key={project._id}
              slug={project.slug.current}
              title={project.title}
              location={project.location}
              category={project.category?.name ?? ""}
              completedYear={project.completedYear}
              description={project.description}
              thumbnail={project.thumbnail?.asset?.url ?? ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
