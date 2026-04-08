import type { Metadata } from "next";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { allProjectsQuery, projectCategoriesQuery } from "@/sanity/lib/queries";
import ProjectsPageContent from "@/components/sections/ProjectsPageContent";

export const metadata: Metadata = {
  title: "Công trình",
  description:
    "Các công trình nhà gỗ cổ truyền đã thi công của Xưởng Gỗ Hoàng Huân trên khắp cả nước.",
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    client.fetch(allProjectsQuery),
    client.fetch(projectCategoriesQuery),
  ]);

  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image
          src="https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?w=1600&q=80"
          alt="Công trình nhà gỗ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gold-400 text-sm tracking-widest uppercase mb-2">Portfolio</p>
            <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-white italic">
              Công Trình
            </h1>
          </div>
        </div>
      </div>

      <ProjectsPageContent
        projects={projects ?? []}
        categories={categories ?? []}
      />
    </div>
  );
}
