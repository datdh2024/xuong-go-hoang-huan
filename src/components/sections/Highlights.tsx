import { Award, Warehouse, TreePine, PenTool, Shield, MapPin, LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export interface HighlightItem {
  _id: string;
  icon: string;
  title: string;
  description: string;
}

interface Props {
  highlights: HighlightItem[] | null;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Award, Warehouse, TreePine, PenTool, Shield, MapPin,
};

export default function Highlights({ highlights }: Props) {
  const items = highlights ?? [];

  return (
    <section className="py-20 bg-wood-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Tại sao chọn chúng tôi"
          title="Cam Kết Chất Lượng"
          description="Mỗi công trình là một tác phẩm nghệ thuật, được thực hiện bởi đội ngũ nghệ nhân tâm huyết với hơn 40 năm kinh nghiệm"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Award;
            return (
              <div
                key={item._id}
                className="bg-white rounded-lg p-6 shadow-sm border border-wood-100 hover:shadow-md hover:border-gold-400 transition-all group"
              >
                <div className="w-12 h-12 bg-wood-50 group-hover:bg-gold-500 rounded-lg flex items-center justify-center mb-4 transition-colors">
                  <Icon size={24} className="text-wood-600 group-hover:text-wood-800 transition-colors" />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-wood-700 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
