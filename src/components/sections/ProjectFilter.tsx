"use client";

import { useState } from "react";

interface Props {
  categories: string[];
  onFilter?: (category: string) => void;
}

export default function ProjectFilter({ categories, onFilter }: Props) {
  const [selected, setSelected] = useState("Tất cả");
  const allCategories = ["Tất cả", ...categories];

  const handleSelect = (cat: string) => {
    setSelected(cat);
    onFilter?.(cat);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-10 justify-center">
      {allCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            cat === selected
              ? "bg-wood-600 text-white border-wood-600"
              : "border-wood-300 text-wood-600 hover:bg-wood-600 hover:text-white hover:border-wood-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
