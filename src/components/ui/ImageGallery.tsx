"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, prev, next]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative h-48 rounded overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <Image
              src={img}
              alt={`${alt} - ảnh ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                Xem ảnh
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox — rendered via portal to avoid click-through to thumbnails */}
      {openIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Thư viện ảnh"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
            onMouseDown={close}
          />

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm font-medium">
            {openIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-2 md:left-6 z-10 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-2 md:right-6 z-10 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight size={36} />
            </button>
          )}

          {/* Main image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] m-4 md:m-12 animate-scale-in pointer-events-none"
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const diff = e.changedTouches[0].clientX - touchStart;
              if (Math.abs(diff) > 50) {
                diff > 0 ? prev() : next();
              }
              setTouchStart(null);
            }}
          >
            <Image
              src={images[openIndex]}
              alt={`${alt} - ảnh ${openIndex + 1}`}
              fill
              className="object-contain pointer-events-auto"
              sizes="(max-width: 768px) 100vw, 85vw"
              priority
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
