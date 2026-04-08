import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { HOUSE_TEMPLATES } from "@/lib/data";
import { LayoutGrid, Columns2, Columns3 } from "lucide-react";
import type { SanityHouseTemplate } from "@/sanity/lib/types";

export default function HouseTemplates({ templates = HOUSE_TEMPLATES }: { templates?: SanityHouseTemplate[] }) {
  if (templates.length === 0) return null;
  return (
    <section className="py-20 bg-wood-100 dark:bg-wood-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Mẫu nhà gỗ"
          title="Catalogue Thiết Kế"
          description="Tham khảo các mẫu nhà gỗ cổ truyền phổ biến. Chúng tôi tư vấn và thiết kế theo yêu cầu riêng của từng gia đình"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div key={template.name} className="bg-white dark:bg-wood-700 rounded-lg overflow-hidden shadow-sm border border-wood-200 dark:border-wood-600 hover:shadow-md transition-shadow group">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-cormorant text-lg font-semibold text-wood-700 dark:text-wood-100 mb-2">{template.name}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {template.specs.area && (
                    <span className="flex items-center gap-1 text-xs bg-wood-50 dark:bg-wood-600 text-wood-600 dark:text-wood-200 px-2 py-1 rounded border border-wood-200 dark:border-wood-500">
                      <LayoutGrid size={10} /> {template.specs.area}
                    </span>
                  )}
                  {template.specs.bays && (
                    <span className="flex items-center gap-1 text-xs bg-wood-50 dark:bg-wood-600 text-wood-600 dark:text-wood-200 px-2 py-1 rounded border border-wood-200 dark:border-wood-500">
                      <Columns3 size={10} /> {template.specs.bays} gian
                    </span>
                  )}
                  {template.specs.columns && (
                    <span className="flex items-center gap-1 text-xs bg-wood-50 dark:bg-wood-600 text-wood-600 dark:text-wood-200 px-2 py-1 rounded border border-wood-200 dark:border-wood-500">
                      <Columns2 size={10} /> {template.specs.columns} cột
                    </span>
                  )}
                </div>
                <p className="text-gray-500 dark:text-wood-200 text-xs leading-relaxed">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
