import { client } from "@/sanity/lib/client";
import {
  siteSettingsQuery,
  heroSlidesQuery,
  highlightsQuery,
  featuredProjectsQuery,
  allProjectsQuery,
  projectBySlugQuery,
  projectCategoriesQuery,
  featuredTemplatesQuery,
  aboutPageQuery,
  faqItemsQuery,
} from "@/sanity/lib/queries";
import type {
  SanityHeroSlide,
  SanityHighlight,
  SanityProject,
  SanityProjectCategory,
  SanityHouseTemplate,
  SanityAboutPage,
  SanityFaqItem,
} from "@/sanity/lib/types";
import type { SiteSettingsData } from "@/components/layout/Header";
import {
  SITE_SETTINGS,
  HERO_SLIDES,
  HIGHLIGHTS,
  FEATURED_PROJECTS,
  HOUSE_TEMPLATES,
} from "@/lib/data";

// ─── Helpers ───────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Extract URL string from a Sanity image reference object */
function imageUrl(ref: any): string {
  return ref?.asset?.url ?? "";
}

/** Normalize a raw Sanity project into the flat SanityProject shape */
function normalizeProject(raw: any): SanityProject {
  return {
    title: raw.title,
    slug: typeof raw.slug === "string" ? raw.slug : raw.slug?.current ?? "",
    location: raw.location,
    category:
      typeof raw.category === "string"
        ? raw.category
        : raw.category?.name ?? "",
    thumbnail:
      typeof raw.thumbnail === "string" ? raw.thumbnail : imageUrl(raw.thumbnail),
    images: raw.images
      ? raw.images.map((img: any) =>
          typeof img === "string" ? img : imageUrl(img)
        )
      : undefined,
    description: raw.description,
    completedYear: raw.completedYear,
    ...(raw.featured !== undefined ? { featured: raw.featured } : {}),
  };
}

/** Convert a string to a URL-friendly slug */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Fetchers ──────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const data = await client.fetch(siteSettingsQuery);
    if (!data) return SITE_SETTINGS;
    return data as SiteSettingsData;
  } catch {
    return SITE_SETTINGS;
  }
}

export async function getHeroSlides(): Promise<SanityHeroSlide[]> {
  try {
    const data = await client.fetch(heroSlidesQuery);
    if (!data || !Array.isArray(data) || data.length === 0) return HERO_SLIDES;
    return data.map((slide) => ({
      headline: slide.headline,
      subheadline: slide.subheadline,
      ctaLabel: slide.ctaLabel,
      ctaLink: slide.ctaLink,
      order: slide.order,
      image:
        typeof slide.image === "string" ? slide.image : imageUrl(slide.image),
    }));
  } catch {
    return HERO_SLIDES;
  }
}

export async function getHighlights(): Promise<SanityHighlight[]> {
  try {
    const data = await client.fetch(highlightsQuery);
    if (!data || !Array.isArray(data) || data.length === 0) return HIGHLIGHTS;
    return data as SanityHighlight[];
  } catch {
    return HIGHLIGHTS;
  }
}

export async function getFeaturedProjects(): Promise<SanityProject[]> {
  try {
    const data = await client.fetch(featuredProjectsQuery);
    if (!data || !Array.isArray(data) || data.length === 0)
      return FEATURED_PROJECTS;
    return data.map(normalizeProject);
  } catch {
    return FEATURED_PROJECTS;
  }
}

export async function getAllProjects(): Promise<SanityProject[]> {
  try {
    const data = await client.fetch(allProjectsQuery);
    if (!data || !Array.isArray(data) || data.length === 0)
      return FEATURED_PROJECTS;
    return data.map(normalizeProject);
  } catch {
    return FEATURED_PROJECTS;
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<SanityProject | null> {
  try {
    const data = await client.fetch(projectBySlugQuery, { slug });
    if (!data) return null;
    return normalizeProject(data);
  } catch {
    return (
      FEATURED_PROJECTS.find((p) => p.slug === slug) ?? null
    );
  }
}

export async function getProjectCategories(): Promise<SanityProjectCategory[]> {
  try {
    const data = await client.fetch(projectCategoriesQuery);
    if (!data || !Array.isArray(data) || data.length === 0) {
      return deriveCategoriesFromStatic();
    }
    return data.map((cat) => ({
      name: cat.name,
      slug: typeof cat.slug === "string" ? cat.slug : cat.slug?.current ?? "",
    }));
  } catch {
    return deriveCategoriesFromStatic();
  }
}

function deriveCategoriesFromStatic(): SanityProjectCategory[] {
  const unique = [...new Set(FEATURED_PROJECTS.map((p) => p.category))];
  return unique.map((name) => ({
    name,
    slug: slugify(name),
  }));
}

export async function getFeaturedTemplates(): Promise<SanityHouseTemplate[]> {
  try {
    const data = await client.fetch(featuredTemplatesQuery);
    if (!data || !Array.isArray(data) || data.length === 0)
      return HOUSE_TEMPLATES;
    return data.map((t) => ({
      name: t.name,
      description: t.description,
      specs: t.specs,
      thumbnail:
        typeof t.thumbnail === "string" ? t.thumbnail : imageUrl(t.thumbnail),
      ...(t.featured !== undefined ? { featured: t.featured } : {}),
    }));
  } catch {
    return HOUSE_TEMPLATES;
  }
}

export async function getAboutPage(): Promise<SanityAboutPage | null> {
  try {
    const data = await client.fetch(aboutPageQuery);
    if (!data) return null;
    return {
      story: data.story,
      highlights: data.highlights,
      teamDescription: data.teamDescription,
      heroImage:
        typeof data.heroImage === "string"
          ? data.heroImage
          : data.heroImage
            ? imageUrl(data.heroImage)
            : undefined,
      storyImage:
        typeof data.storyImage === "string"
          ? data.storyImage
          : data.storyImage
            ? imageUrl(data.storyImage)
            : undefined,
    };
  } catch {
    return null;
  }
}

export async function getFaqItems(): Promise<SanityFaqItem[]> {
  try {
    const data = await client.fetch(faqItemsQuery);
    if (!data || !Array.isArray(data)) return [];
    return data as SanityFaqItem[];
  } catch {
    return [];
  }
}
