import { Award, Warehouse, TreePine, PenTool, Shield, MapPin, LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { HIGHLIGHTS } from "@/lib/data";
import type { SanityHighlight } from "@/sanity/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Award, Warehouse, TreePine, PenTool, Shield, MapPin,
};

export default function Highlights({ highlights = HIGHLIGHTS }: { highlights?: SanityHighlight[] }) {
  if (highlights.length === 0) return null;
  return (
    <section className="py-20 bg-wood-50 dark:bg-wood-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Tại sao chọn chúng tôi"
          title="Cam Kết Chất Lượng"
          description="Mỗi công trình là một tác phẩm nghệ thuật, được thực hiện bởi đội ngũ nghệ nhân tâm huyết với hơn 40 năm kinh nghiệm"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {highlights.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Award;
            return (
              <div key={item.title} className="bg-white dark:bg-wood-700 rounded-lg p-4 sm:p-6 shadow-sm border border-wood-100 dark:border-wood-600 hover:shadow-md hover:border-gold-400 transition-all group flex items-start gap-4 sm:block">
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-wood-50 dark:bg-wood-600 group-hover:bg-gold-500 rounded-lg flex items-center justify-center sm:mb-4 transition-colors">
                  <Icon size={20} className="sm:hidden text-wood-600 dark:text-wood-200 group-hover:text-wood-800 transition-colors" />
                  <Icon size={24} className="hidden sm:block text-wood-600 dark:text-wood-200 group-hover:text-wood-800 transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-cormorant text-lg sm:text-xl font-semibold text-wood-700 dark:text-wood-100 sm:mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-wood-200 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
