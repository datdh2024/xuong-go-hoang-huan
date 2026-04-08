import HeroSlider from "@/components/sections/HeroSlider";
import Highlights from "@/components/sections/Highlights";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import HouseTemplates from "@/components/sections/HouseTemplates";
import FaqSection from "@/components/sections/FaqSection";
import QuoteForm from "@/components/sections/QuoteForm";
import { client } from "@/sanity/lib/client";
import {
  faqItemsQuery,
  heroSlidesQuery,
  highlightsQuery,
  featuredProjectsQuery,
  featuredTemplatesQuery,
} from "@/sanity/lib/queries";
import type { FaqItem } from "@/components/sections/FaqSection";
import type { HeroSlide } from "@/components/sections/HeroSlider";
import type { HighlightItem } from "@/components/sections/Highlights";
import type { SanityProject } from "@/components/sections/ProjectsGrid";
import type { HouseTemplate } from "@/components/sections/HouseTemplates";

export default async function HomePage() {
  const [faqs, slides, highlights, projects, templates] = await Promise.all([
    client.fetch<FaqItem[]>(faqItemsQuery),
    client.fetch<HeroSlide[]>(heroSlidesQuery),
    client.fetch<HighlightItem[]>(highlightsQuery),
    client.fetch<SanityProject[]>(featuredProjectsQuery),
    client.fetch<HouseTemplate[]>(featuredTemplatesQuery),
  ]);

  return (
    <>
      <HeroSlider slides={slides ?? []} />
      <Highlights highlights={highlights ?? []} />
      <ProjectsGrid projects={projects ?? []} />
      <HouseTemplates templates={templates ?? []} />
      <FaqSection faqs={faqs ?? []} />
      <QuoteForm />
    </>
  );
}
