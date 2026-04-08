import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays } from "lucide-react";

interface ProjectCardProps {
  slug: string;
  title: string;
  location: string;
  category: string;
  completedYear: number;
  description: string;
  thumbnail: string;
}

export default function ProjectCard({ slug, title, location, category, completedYear, description, thumbnail }: ProjectCardProps) {
  return (
    <Link href={`/cong-trinh/${slug}`} className="group block bg-white dark:bg-wood-700 rounded-lg overflow-hidden shadow-sm border border-wood-100 dark:border-wood-600 hover:shadow-lg transition-all">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-3 left-3 bg-wood-600 text-white text-xs px-3 py-1 rounded-full font-medium">
          {category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-cormorant text-xl font-semibold text-wood-700 dark:text-wood-100 mb-2 group-hover:text-wood-600 dark:group-hover:text-gold-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-wood-200 text-sm leading-relaxed mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-wood-300">
          <span className="flex items-center gap-1"><MapPin size={12} />{location}</span>
          <span className="flex items-center gap-1"><CalendarDays size={12} />{completedYear}</span>
        </div>
      </div>
    </Link>
  );
}
