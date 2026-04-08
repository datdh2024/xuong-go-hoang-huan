"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { HOUSE_TYPES, PROVINCES } from "@/lib/data";

const schema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").max(11),
  houseType: z.string().min(1, "Vui lòng chọn loại nhà"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  area: z.string().optional(),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function QuoteForm({ houseTypes = HOUSE_TYPES }: { houseTypes?: string[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      alert("Có lỗi xảy ra. Vui lòng gọi điện trực tiếp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-wood-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Nhận báo giá"
          title="Tư Vấn Miễn Phí"
          description="Để lại thông tin, chúng tôi sẽ liên hệ tư vấn và báo giá trong vòng 24 giờ"
          light
        />

        {submitted ? (
          <div className="bg-white/10 backdrop-blur rounded-xl p-10 text-center">
            <CheckCircle size={48} className="text-gold-400 mx-auto mb-4" />
            <h3 className="font-cormorant text-2xl text-white font-semibold mb-2">Gửi thành công!</h3>
            <p className="text-wood-200">Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ làm việc.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white/10 backdrop-blur rounded-xl p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-wood-100 text-sm mb-1">Họ và tên *</label>
                <input
                  {...register("name")}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                />
                {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-wood-100 text-sm mb-1">Số điện thoại *</label>
                <input
                  {...register("phone")}
                  placeholder="0985 241 204"
                  type="tel"
                  className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                />
                {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-wood-100 text-sm mb-1">Loại nhà muốn làm *</label>
                <select
                  {...register("houseType")}
                  className="w-full bg-white/20 border border-white/30 text-white rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                >
                  <option value="" className="text-gray-800">-- Chọn loại nhà --</option>
                  {houseTypes.map((t) => <option key={t} value={t} className="text-gray-800">{t}</option>)}
                </select>
                {errors.houseType && <p className="text-red-300 text-xs mt-1">{errors.houseType.message}</p>}
              </div>
              <div>
                <label className="block text-wood-100 text-sm mb-1">Tỉnh / Thành phố *</label>
                <select
                  {...register("province")}
                  className="w-full bg-white/20 border border-white/30 text-white rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                >
                  <option value="" className="text-gray-800">-- Chọn tỉnh/thành --</option>
                  {PROVINCES.map((p) => <option key={p} value={p} className="text-gray-800">{p}</option>)}
                </select>
                {errors.province && <p className="text-red-300 text-xs mt-1">{errors.province.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-wood-100 text-sm mb-1">Diện tích dự kiến</label>
              <input
                {...register("area")}
                placeholder="VD: 80m², 5 gian, 32 cột..."
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-wood-100 text-sm mb-1">Ghi chú thêm</label>
              <textarea
                {...register("note")}
                rows={3}
                placeholder="Yêu cầu đặc biệt, thời gian thi công mong muốn..."
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-wood-800 font-semibold py-3 rounded transition-colors text-sm"
            >
              <Send size={16} />
              {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
