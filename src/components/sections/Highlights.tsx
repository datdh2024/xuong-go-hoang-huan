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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Award;
            return (
              <div key={item.title} className="bg-white dark:bg-wood-700 rounded-lg p-6 shadow-sm border border-wood-100 dark:border-wood-600 hover:shadow-md hover:border-gold-400 transition-all group">
                <div className="w-12 h-12 bg-wood-50 dark:bg-wood-600 group-hover:bg-gold-500 rounded-lg flex items-center justify-center mb-4 transition-colors">
                  <Icon size={24} className="text-wood-600 dark:text-wood-200 group-hover:text-wood-800 transition-colors" />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-wood-700 dark:text-wood-100 mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-wood-200 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
