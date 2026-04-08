import type { Metadata } from "next";
import Image from "next/image";
import ProjectsListing from "@/components/sections/ProjectsListing";
import { getAllProjects, getProjectCategories } from "@/sanity/lib/fetchers";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Công trình",
  description:
    "Các công trình nhà gỗ cổ truyền đã thi công của Xưởng Gỗ Hoàng Huân trên khắp cả nước.",
  openGraph: {
    title: "Công trình",
    description:
      "Các công trình nhà gỗ cổ truyền đã thi công của Xưởng Gỗ Hoàng Huân trên khắp cả nước.",
    url: "/cong-trinh",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/cong-trinh",
  },
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getAllProjects(),
    getProjectCategories(),
  ]);

  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: "Trang chủ", path: "/" },
              { name: "Công trình", path: "/cong-trinh" },
            ])
          ),
        }}
      />
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
          <ProjectsListing projects={projects} categories={categories} />
        </div>
      </section>
    </div>
  );
}
