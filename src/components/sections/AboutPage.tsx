import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

export interface AboutHighlight {
  number: string;
  label: string;
}

interface Props {
  highlights: AboutHighlight[] | null;
  story: string | null;
  heroImageUrl: string | null;
}

export default function AboutPage({ highlights, story, heroImageUrl }: Props) {
  return (
    <div className="pt-24">
      {/* Hero */}
      {heroImageUrl && (
        <div className="relative h-72 md:h-96">
          <Image
            src={heroImageUrl}
            alt="Xưởng Gỗ Hoàng Huân - nhà gỗ cổ truyền"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gold-400 text-sm tracking-widest uppercase mb-2">Về chúng tôi</p>
              <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-white italic">
                Giới Thiệu
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {highlights && highlights.length > 0 && (
        <div className="bg-wood-600 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {highlights.map((s) => (
              <div key={s.label}>
                <div className="font-cormorant text-4xl font-bold text-gold-400">{s.number}</div>
                <div className="text-wood-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Story */}
      {story && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-10 bg-gold-500" />
                  <span className="text-xs text-gold-600 tracking-widest uppercase font-semibold">Câu chuyện</span>
                </div>
                <h2 className="font-cormorant text-4xl font-semibold text-wood-700 mb-6">
                  Tâm Huyết Với Nghề Mộc Truyền Thống
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{story}</p>
                </div>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Nghệ nhân chạm khắc"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team — always hardcoded, no Sanity schema yet */}
      <section className="py-20 bg-wood-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeading
            label="Đội ngũ"
            title="Những Người Thợ Tâm Huyết"
            description="Đội ngũ nghệ nhân của chúng tôi là những người con của làng nghề truyền thống, mang trong mình tình yêu và sự tôn trọng với từng thớ gỗ"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { role: "Thợ chạm khắc", desc: "Nghệ nhân chạm khắc hoa văn cổ điển với độ tỉ mỉ và chính xác cao" },
              { role: "Thợ mộc kết cấu", desc: "Đội ngũ xử lý kết cấu cột kèo, đảm bảo độ vững chắc của công trình" },
              { role: "Kiến trúc tư vấn", desc: "Đội tư vấn thiết kế kết hợp kiến trúc truyền thống và nhu cầu hiện đại" },
            ].map((item) => (
              <div key={item.role} className="bg-white rounded-lg p-6 border border-wood-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-wood-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gold-400 text-2xl font-cormorant font-bold">木</span>
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-wood-700 mb-2">{item.role}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
