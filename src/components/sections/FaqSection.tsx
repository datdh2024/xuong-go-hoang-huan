"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const FAQS = [
  {
    id: 1,
    question: "Chi phí xây dựng nhà gỗ cổ truyền là bao nhiêu?",
    answer:
      "Chi phí phụ thuộc vào loại gỗ, kích thước và độ phức tạp của công trình. Chúng tôi cung cấp báo giá miễn phí sau khi khảo sát và tư vấn cụ thể theo nhu cầu của quý khách.",
  },
  {
    id: 2,
    question: "Thời gian thi công một công trình nhà gỗ mất bao lâu?",
    answer:
      "Thông thường từ 3 đến 6 tháng tùy theo quy mô công trình. Nhà gỗ 3 gian đơn giản có thể hoàn thành trong 3 tháng, còn công trình lớn từ 5–7 gian sẽ cần 5–6 tháng.",
  },
  {
    id: 3,
    question: "Loại gỗ nào phù hợp nhất để xây nhà truyền thống?",
    answer:
      "Gỗ lim, gỗ mít và gỗ xoan là những loại được ưa chuộng nhất nhờ độ bền cao và khả năng chịu mối mọt tốt. Chúng tôi tư vấn lựa chọn loại gỗ phù hợp với ngân sách và yêu cầu của từng gia đình.",
  },
  {
    id: 4,
    question: "Xưởng có thiết kế theo yêu cầu riêng không?",
    answer:
      "Có. Chúng tôi nhận thiết kế và thi công hoàn toàn theo yêu cầu của khách hàng — từ kiểu dáng, kích thước, số gian, đến các chi tiết chạm khắc hoa văn truyền thống.",
  },
  {
    id: 5,
    question: "Nhà gỗ có bền và chịu được thời tiết khắc nghiệt không?",
    answer:
      "Nhà gỗ được xử lý chống mối mọt và chịu lực theo tiêu chuẩn kỹ thuật, đảm bảo tuổi thọ hàng chục năm. Nhiều công trình của chúng tôi đã trải qua 20–30 năm vẫn giữ nguyên vẻ đẹp và độ bền.",
  },
  {
    id: 6,
    question: "Xưởng có thi công tại các tỉnh thành khác không?",
    answer:
      "Có. Chúng tôi nhận thi công trên toàn quốc. Đội ngũ thợ lành nghề sẽ đến tận nơi để khảo sát, lắp dựng và hoàn thiện công trình tại địa điểm của quý khách.",
  },
  {
    id: 7,
    question: "Có bảo hành công trình sau khi hoàn thành không?",
    answer:
      "Có. Chúng tôi bảo hành kết cấu công trình trong vòng 12 tháng và hỗ trợ bảo trì dài hạn theo thỏa thuận. Quý khách yên tâm tuyệt đối về chất lượng sau bàn giao.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Giải đáp thắc mắc"
          title="Câu Hỏi Thường Gặp"
          description="Những câu hỏi phổ biến về quy trình, chi phí và chất lượng công trình nhà gỗ cổ truyền"
        />

        <div className="space-y-2">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-wood-200 rounded-lg overflow-hidden"
              >
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-wood-50 hover:bg-wood-100 transition-colors"
                >
                  <span className="font-cormorant text-wood-700 font-semibold text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-gold-600 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  hidden={!isOpen}
                  className="px-5 py-4 text-gray-600 text-sm leading-relaxed bg-white border-t border-wood-100"
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
