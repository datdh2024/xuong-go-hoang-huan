import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays, ArrowLeft, Tag } from "lucide-react";
import { getProjectBySlug, getAllProjects } from "@/sanity/lib/fetchers";
import { notFound } from "next/navigation";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/cong-trinh/${slug}`,
      images: project.thumbnail
        ? [{ url: project.thumbnail, alt: project.title }]
        : undefined,
    },
    alternates: {
      canonical: `/cong-trinh/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const galleryImages = project.images?.length ? project.images : [project.thumbnail];

  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: "Trang chủ", path: "/" },
              { name: "Công trình", path: "/cong-trinh" },
              { name: project.title, path: `/cong-trinh/${slug}` },
            ])
          ),
        }}
      />
      {/* Hero image */}
      <div className="relative h-72 md:h-[500px]">
        <Image src={project.thumbnail} alt={project.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 w-full">
            <Link href="/cong-trinh" className="inline-flex items-center gap-1 text-wood-200 hover:text-gold-400 text-sm mb-4 transition-colors">
              <ArrowLeft size={14} /> Tất cả công trình
            </Link>
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-white italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{project.title}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-wood-200">
              <span className="flex items-center gap-1"><MapPin size={14} />{project.location}</span>
              <span className="flex items-center gap-1"><CalendarDays size={14} />{project.completedYear}</span>
              <span className="flex items-center gap-1"><Tag size={14} />{project.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="font-cormorant text-3xl font-semibold text-wood-700 dark:text-wood-100 mb-4">Mô tả công trình</h2>
            <p className="text-gray-600 dark:text-wood-200 leading-relaxed mb-8">{project.description}</p>

            {/* Gallery */}
            <h3 className="font-cormorant text-2xl font-semibold text-wood-700 dark:text-wood-100 mb-4">Thư viện ảnh</h3>
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative h-48 rounded overflow-hidden">
                  <Image src={img} alt={`${project.title} - ảnh ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-wood-50 dark:bg-wood-700 border border-wood-200 dark:border-wood-600 rounded-lg p-6 mb-6 sticky top-28">
              <h3 className="font-cormorant text-xl font-semibold text-wood-700 dark:text-wood-100 mb-4">Thông tin dự án</h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Loại công trình", value: project.category },
                  { label: "Địa điểm", value: project.location },
                  { label: "Năm hoàn thành", value: project.completedYear },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-wood-200 dark:border-wood-600 pb-2">
                    <dt className="text-gray-500 dark:text-wood-300">{item.label}</dt>
                    <dd className="font-medium text-wood-700 dark:text-wood-100">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/lien-he"
                className="block mt-6 text-center bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold py-3 rounded transition-colors text-sm"
              >
                Yêu cầu báo giá
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
