import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  SITE_SETTINGS,
  HERO_SLIDES,
  HIGHLIGHTS,
  FEATURED_PROJECTS,
  HOUSE_TEMPLATES,
} from "@/lib/data";

// Mock the Sanity client
vi.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: vi.fn(),
  },
}));

import { client } from "@/sanity/lib/client";
import {
  getSiteSettings,
  getHeroSlides,
  getHighlights,
  getFeaturedProjects,
  getAllProjects,
  getProjectBySlug,
  getProjectCategories,
  getFeaturedTemplates,
  getAboutPage,
  getFaqItems,
} from "@/sanity/lib/fetchers";

const mockedFetch = vi.mocked(client.fetch);

beforeEach(() => {
  mockedFetch.mockReset();
});

// ─── getSiteSettings ───────────────────────────────────────────────
describe("getSiteSettings", () => {
  it("returns site settings from Sanity on success", async () => {
    const raw = {
      companyName: "Test Co",
      tagline: "Tag",
      phone: "123",
      email: "a@b.com",
      address: "addr",
      workingHours: "9-5",
      facebookUrl: "https://fb.com",
      tiktokUrl: "https://tt.com",
    };
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getSiteSettings();
    expect(result).toEqual(raw);
  });

  it("falls back to SITE_SETTINGS on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getSiteSettings();
    expect(result).toEqual(SITE_SETTINGS);
  });

  it("falls back to SITE_SETTINGS when Sanity returns null", async () => {
    mockedFetch.mockResolvedValueOnce(null);

    const result = await getSiteSettings();
    expect(result).toEqual(SITE_SETTINGS);
  });
});

// ─── getHeroSlides ─────────────────────────────────────────────────
describe("getHeroSlides", () => {
  it("normalizes image from Sanity response", async () => {
    const raw = [
      {
        headline: "Test",
        subheadline: "Sub",
        ctaLabel: "CTA",
        ctaLink: "/link",
        order: 1,
        image: { asset: { url: "https://cdn.sanity.io/img.jpg" } },
      },
    ];
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getHeroSlides();
    expect(result).toEqual([
      {
        headline: "Test",
        subheadline: "Sub",
        ctaLabel: "CTA",
        ctaLink: "/link",
        order: 1,
        image: "https://cdn.sanity.io/img.jpg",
      },
    ]);
  });

  it("falls back to HERO_SLIDES on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getHeroSlides();
    expect(result).toEqual(HERO_SLIDES);
  });
});

// ─── getHighlights ─────────────────────────────────────────────────
describe("getHighlights", () => {
  it("returns highlights from Sanity on success", async () => {
    const raw = [
      { icon: "Award", title: "Test", description: "Desc", order: 1 },
    ];
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getHighlights();
    expect(result).toEqual(raw);
  });

  it("falls back to HIGHLIGHTS on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getHighlights();
    expect(result).toEqual(HIGHLIGHTS);
  });
});

// ─── getFeaturedProjects ───────────────────────────────────────────
describe("getFeaturedProjects", () => {
  it("normalizes project data from Sanity", async () => {
    const raw = [
      {
        title: "Project 1",
        slug: { current: "project-1" },
        location: "Ha Noi",
        category: { name: "Nha go 3 gian" },
        thumbnail: { asset: { url: "https://cdn.sanity.io/thumb.jpg" } },
        description: "Desc",
        completedYear: 2023,
        featured: true,
      },
    ];
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getFeaturedProjects();
    expect(result).toEqual([
      {
        title: "Project 1",
        slug: "project-1",
        location: "Ha Noi",
        category: "Nha go 3 gian",
        thumbnail: "https://cdn.sanity.io/thumb.jpg",
        description: "Desc",
        completedYear: 2023,
        featured: true,
      },
    ]);
  });

  it("falls back to FEATURED_PROJECTS on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getFeaturedProjects();
    expect(result).toEqual(FEATURED_PROJECTS);
  });
});

// ─── getAllProjects ─────────────────────────────────────────────────
describe("getAllProjects", () => {
  it("normalizes project data from Sanity", async () => {
    const raw = [
      {
        title: "Project A",
        slug: { current: "project-a" },
        location: "HCM",
        category: { name: "Nha tho ho" },
        thumbnail: { asset: { url: "https://cdn.sanity.io/a.jpg" } },
        description: "Desc A",
        completedYear: 2022,
      },
    ];
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getAllProjects();
    expect(result).toEqual([
      {
        title: "Project A",
        slug: "project-a",
        location: "HCM",
        category: "Nha tho ho",
        thumbnail: "https://cdn.sanity.io/a.jpg",
        description: "Desc A",
        completedYear: 2022,
      },
    ]);
  });

  it("falls back to FEATURED_PROJECTS on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getAllProjects();
    expect(result).toEqual(FEATURED_PROJECTS);
  });
});

// ─── getProjectBySlug ──────────────────────────────────────────────
describe("getProjectBySlug", () => {
  it("normalizes single project with images array", async () => {
    const raw = {
      title: "Project X",
      slug: { current: "project-x" },
      location: "Da Nang",
      category: { name: "Nha go san vuon" },
      thumbnail: { asset: { url: "https://cdn.sanity.io/x.jpg" } },
      images: [
        { asset: { url: "https://cdn.sanity.io/img1.jpg" } },
        { asset: { url: "https://cdn.sanity.io/img2.jpg" } },
      ],
      description: "Desc X",
      completedYear: 2024,
    };
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getProjectBySlug("project-x");
    expect(result).toEqual({
      title: "Project X",
      slug: "project-x",
      location: "Da Nang",
      category: "Nha go san vuon",
      thumbnail: "https://cdn.sanity.io/x.jpg",
      images: [
        "https://cdn.sanity.io/img1.jpg",
        "https://cdn.sanity.io/img2.jpg",
      ],
      description: "Desc X",
      completedYear: 2024,
    });
  });

  it("falls back to matching project from FEATURED_PROJECTS", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getProjectBySlug("nha-go-3-gian-ha-noi");
    expect(result).toEqual(
      FEATURED_PROJECTS.find((p) => p.slug === "nha-go-3-gian-ha-noi") ?? null
    );
  });

  it("returns null when slug not found in fallback", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getProjectBySlug("nonexistent-slug");
    expect(result).toBeNull();
  });

  it("returns null when Sanity returns null", async () => {
    mockedFetch.mockResolvedValueOnce(null);

    const result = await getProjectBySlug("some-slug");
    expect(result).toBeNull();
  });
});

// ─── getProjectCategories ──────────────────────────────────────────
describe("getProjectCategories", () => {
  it("normalizes categories with slug from Sanity", async () => {
    const raw = [
      { name: "Nha go 3 gian", slug: { current: "nha-go-3-gian" } },
      { name: "Nha tho ho", slug: { current: "nha-tho-ho" } },
    ];
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getProjectCategories();
    expect(result).toEqual([
      { name: "Nha go 3 gian", slug: "nha-go-3-gian" },
      { name: "Nha tho ho", slug: "nha-tho-ho" },
    ]);
  });

  it("derives categories from FEATURED_PROJECTS on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getProjectCategories();
    // Should have unique categories derived from FEATURED_PROJECTS
    const uniqueCategories = [
      ...new Set(FEATURED_PROJECTS.map((p) => p.category)),
    ];
    expect(result).toHaveLength(uniqueCategories.length);
    for (const cat of result) {
      expect(cat).toHaveProperty("name");
      expect(cat).toHaveProperty("slug");
      expect(uniqueCategories).toContain(cat.name);
    }
  });
});

// ─── getFeaturedTemplates ──────────────────────────────────────────
describe("getFeaturedTemplates", () => {
  it("normalizes template thumbnail from Sanity", async () => {
    const raw = [
      {
        name: "Template 1",
        description: "Desc",
        specs: { area: "60m2", bays: 3, columns: 16 },
        thumbnail: { asset: { url: "https://cdn.sanity.io/t1.jpg" } },
        featured: true,
      },
    ];
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getFeaturedTemplates();
    expect(result).toEqual([
      {
        name: "Template 1",
        description: "Desc",
        specs: { area: "60m2", bays: 3, columns: 16 },
        thumbnail: "https://cdn.sanity.io/t1.jpg",
        featured: true,
      },
    ]);
  });

  it("falls back to HOUSE_TEMPLATES on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getFeaturedTemplates();
    expect(result).toEqual(HOUSE_TEMPLATES);
  });
});

// ─── getAboutPage ──────────────────────────────────────────────────
describe("getAboutPage", () => {
  it("normalizes heroImage from Sanity", async () => {
    const raw = {
      story: [{ _type: "block", children: [] }],
      highlights: [{ number: "40+", label: "Nam" }],
      teamDescription: "Team desc",
      heroImage: { asset: { url: "https://cdn.sanity.io/hero.jpg" } },
    };
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getAboutPage();
    expect(result).toEqual({
      story: [{ _type: "block", children: [] }],
      highlights: [{ number: "40+", label: "Nam" }],
      teamDescription: "Team desc",
      heroImage: "https://cdn.sanity.io/hero.jpg",
    });
  });

  it("returns null on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getAboutPage();
    expect(result).toBeNull();
  });

  it("returns null when Sanity returns null", async () => {
    mockedFetch.mockResolvedValueOnce(null);

    const result = await getAboutPage();
    expect(result).toBeNull();
  });
});

// ─── getFaqItems ───────────────────────────────────────────────────
describe("getFaqItems", () => {
  it("returns FAQ items from Sanity on success", async () => {
    const raw = [
      { _id: "1", question: "Q1", answer: "A1" },
      { _id: "2", question: "Q2", answer: "A2" },
    ];
    mockedFetch.mockResolvedValueOnce(raw);

    const result = await getFaqItems();
    expect(result).toEqual(raw);
  });

  it("returns empty array on error", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("fail"));

    const result = await getFaqItems();
    expect(result).toEqual([]);
  });
});
