import type { Metadata } from "next";
import Image from "next/image";
import ProjectCard from "@/components/ui/ProjectCard";
import { FEATURED_PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Công trình",
  description: "Các công trình nhà gỗ cổ truyền đã thi công của Xưởng Gỗ Hoàng Huân trên khắp cả nước.",
};

const CATEGORIES = ["Tất cả", "Nhà gỗ 3 gian", "Nhà gỗ 5 gian", "Nhà thờ họ", "Nhà gỗ sân vườn"];

export default function ProjectsPage() {
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

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category filter - UI only, client interaction can be added later */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  cat === "Tất cả"
                    ? "bg-wood-600 text-white border-wood-600"
                    : "border-wood-300 text-wood-600 hover:bg-wood-600 hover:text-white hover:border-wood-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PROJECTS.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
