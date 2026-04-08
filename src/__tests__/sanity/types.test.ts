import { describe, it, expect } from "vitest";
import type {
  SanityHeroSlide,
  SanityHighlight,
  SanityProject,
  SanityProjectCategory,
  SanityHouseTemplate,
  SanityAboutPage,
  SanityFaqItem,
} from "@/sanity/lib/types";

describe("Sanity response types", () => {
  it("SanityHeroSlide conforms to expected shape", () => {
    const slide: SanityHeroSlide = {
      image: "https://cdn.sanity.io/images/abc/production/hero.jpg",
      headline: "Xưởng gỗ Hoàng Huấn",
      subheadline: "Chất lượng hàng đầu",
      ctaLabel: "Liên hệ",
      ctaLink: "/lien-he",
      order: 1,
    };
    expect(slide.image).toBeDefined();
    expect(slide.headline).toBeDefined();
    expect(typeof slide.order).toBe("number");
  });

  it("SanityHighlight conforms to expected shape", () => {
    const highlight: SanityHighlight = {
      icon: "Award",
      title: "Uy tín",
      description: "Hơn 20 năm kinh nghiệm",
      order: 1,
    };
    expect(highlight.icon).toBeDefined();
    expect(highlight.title).toBeDefined();
    expect(typeof highlight.order).toBe("number");
  });

  it("SanityProject conforms to expected shape", () => {
    const project: SanityProject = {
      title: "Nhà gỗ 5 gian",
      slug: "nha-go-5-gian",
      location: "Hà Nội",
      category: "Nhà gỗ",
      thumbnail: "https://cdn.sanity.io/images/abc/production/thumb.jpg",
      images: [
        "https://cdn.sanity.io/images/abc/production/img1.jpg",
        "https://cdn.sanity.io/images/abc/production/img2.jpg",
      ],
      description: "Công trình nhà gỗ lim 5 gian",
      completedYear: 2024,
      featured: true,
    };
    expect(project.slug).toBe("nha-go-5-gian");
    expect(project.images).toHaveLength(2);
    expect(typeof project.featured).toBe("boolean");
  });

  it("SanityProjectCategory conforms to expected shape", () => {
    const category: SanityProjectCategory = {
      name: "Nhà gỗ",
      slug: "nha-go",
    };
    expect(category.name).toBeDefined();
    expect(typeof category.slug).toBe("string");
  });

  it("SanityHouseTemplate conforms to expected shape", () => {
    const template: SanityHouseTemplate = {
      name: "Mẫu nhà 3 gian",
      thumbnail: "https://cdn.sanity.io/images/abc/production/template.jpg",
      specs: {
        area: "120m²",
        bays: 3,
        columns: 12,
      },
      description: "Mẫu nhà gỗ truyền thống 3 gian",
      featured: true,
    };
    expect(template.specs.bays).toBe(3);
    expect(typeof template.featured).toBe("boolean");
  });

  it("SanityAboutPage conforms to expected shape", () => {
    const about: SanityAboutPage = {
      heroImage: "https://cdn.sanity.io/images/abc/production/about.jpg",
      story: [{ _type: "block", children: [{ text: "Our story" }] }],
      highlights: [
        { number: "20+", label: "Năm kinh nghiệm" },
        { number: "500+", label: "Công trình" },
      ],
      teamDescription: "Đội ngũ thợ lành nghề",
    };
    expect(about.highlights).toHaveLength(2);
    expect(about.story).toBeDefined();
  });

  it("SanityFaqItem conforms to expected shape", () => {
    const faq: SanityFaqItem = {
      _id: "faq-001",
      question: "Giá nhà gỗ bao nhiêu?",
      answer: "Tùy theo loại gỗ và quy mô công trình",
    };
    expect(faq._id).toBeDefined();
    expect(faq.question).toBeDefined();
    expect(faq.answer).toBeDefined();
  });
});
