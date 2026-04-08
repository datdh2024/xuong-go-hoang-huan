// Portable Text block type (simplified for typing purposes)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlock = Record<string, any>;

export interface SanityHeroSlide {
  image: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
}

export interface SanityHighlight {
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface SanityProject {
  title: string;
  slug: string;
  location: string;
  category: string;
  thumbnail: string;
  images: string[];
  description: string;
  completedYear: number;
  featured: boolean;
}

export interface SanityProjectCategory {
  name: string;
  slug: string;
}

export interface SanityHouseTemplate {
  name: string;
  thumbnail: string;
  specs: {
    area: string;
    bays: number;
    columns: number;
  };
  description: string;
  featured: boolean;
}

export interface SanityAboutPage {
  heroImage: string;
  story: PortableTextBlock[];
  highlights: Array<{ number: string; label: string }>;
  teamDescription: string;
}

export interface SanityFaqItem {
  _id: string;
  question: string;
  answer: string;
}
