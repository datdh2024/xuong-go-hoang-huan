import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";

export interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  location: string;
  completedYear: number;
  description: string;
  category: { name: string } | null;
  thumbnail: { asset: { url: string } } | null;
}

interface Props {
  projects: SanityProject[] | null;
}

export default function ProjectsGrid({ projects }: Props) {
  const items = projects ?? [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Công trình tiêu biểu"
          title="Dự Án Đã Thực Hiện"
          description="Hàng trăm công trình nhà gỗ cổ truyền trên khắp cả nước, mỗi công trình là một câu chuyện về tâm huyết và nghề"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {items.map((project) => (
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
        <div className="text-center">
          <Link
            href="/cong-trinh"
            className="inline-flex items-center gap-2 border border-wood-600 text-wood-600 hover:bg-wood-600 hover:text-white font-semibold px-8 py-3 rounded transition-all text-sm"
          >
            Xem tất cả công trình <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
