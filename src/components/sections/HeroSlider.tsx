"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  _id: string;
  headline: string;
  subheadline: string;
  ctaLabel: string | null;
  ctaLink: string | null;
  image: { asset: { url: string } } | null;
}

interface Props {
  slides: HeroSlide[] | null;
}

export default function HeroSlider({ slides }: Props) {
  const items = slides ?? [];
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (items.length > 0 ? (c + 1) % items.length : 0)),
    [items.length]
  );
  const prev = () =>
    setCurrent((c) => (items.length > 0 ? (c - 1 + items.length) % items.length : 0));

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, items.length]);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {items.map((slide, i) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          {slide.image?.asset?.url && (
            <Image
              src={slide.image.asset.url}
              alt={slide.headline}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Content — all slides rendered, CSS controls visibility */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            {items.map((slide, i) => (
              <div
                key={slide._id}
                className={`transition-all duration-700 ${
                  i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute"
                }`}
              >
                <h1 className="font-cormorant text-3xl sm:text-5xl md:text-7xl font-bold text-white italic leading-tight mb-4">
                  {slide.headline}
                </h1>
                <p className="text-wood-200 text-base md:text-xl mb-8 leading-relaxed">
                  {slide.subheadline}
                </p>
                {slide.ctaLink && (
                  <Link
                    href={slide.ctaLink}
                    className="inline-block bg-gold-500 hover:bg-gold-600 text-wood-800 font-semibold px-8 py-3 rounded transition-colors text-sm tracking-wide uppercase"
                  >
                    {slide.ctaLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      {items.length > 0 && (
        <>
          <button
            onClick={prev}
            aria-label="Slide trước"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            aria-label="Slide tiếp theo"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Chuyển đến slide ${i + 1}`}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all block ${i === current ? "w-8 bg-gold-500" : "w-4 bg-white/50"}`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
