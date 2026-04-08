import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { FEATURED_PROJECTS } from "@/lib/data";

export default function ProjectsGrid() {
  return (
    <section className="py-20 bg-white dark:bg-wood-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Công trình tiêu biểu"
          title="Dự Án Đã Thực Hiện"
          description="Hàng trăm công trình nhà gỗ cổ truyền trên khắp cả nước, mỗi công trình là một câu chuyện về tâm huyết và nghề"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/cong-trinh"
            className="inline-flex items-center gap-2 border border-wood-600 text-wood-600 dark:text-wood-200 dark:border-wood-400 hover:bg-wood-600 hover:text-white font-semibold px-8 py-3 rounded transition-all text-sm"
          >
            Xem tất cả công trình <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
