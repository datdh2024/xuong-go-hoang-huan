"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 bg-white dark:bg-wood-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Giải đáp thắc mắc"
          title="Câu Hỏi Thường Gặp"
          description="Những câu hỏi phổ biến về quy trình, chi phí và chất lượng công trình nhà gỗ cổ truyền"
        />

        <div className="space-y-2">
          {faqs.map((faq) => {
            const isOpen = openId === faq._id;
            return (
              <div
                key={faq._id}
                className="border border-wood-200 dark:border-wood-600 rounded-lg overflow-hidden"
              >
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq._id}`}
                  onClick={() => toggle(faq._id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-wood-50 dark:bg-wood-700 hover:bg-wood-100 dark:hover:bg-wood-600 transition-colors"
                >
                  <span className="text-wood-700 dark:text-wood-100 font-semibold text-sm">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-gold-600 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  id={`faq-answer-${faq._id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq._id}`}
                  hidden={!isOpen}
                  className="px-5 py-4 text-gray-600 dark:text-wood-200 text-sm leading-relaxed bg-white dark:bg-wood-800 border-t border-wood-100 dark:border-wood-600"
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
