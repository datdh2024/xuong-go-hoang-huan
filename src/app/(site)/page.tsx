import HeroSlider from "@/components/sections/HeroSlider";
import Highlights from "@/components/sections/Highlights";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import HouseTemplates from "@/components/sections/HouseTemplates";
import FaqSection from "@/components/sections/FaqSection";
import QuoteForm from "@/components/sections/QuoteForm";
import {
  getHeroSlides,
  getHighlights,
  getFeaturedProjects,
  getFeaturedTemplates,
  getFaqItems,
} from "@/sanity/lib/fetchers";

export default async function HomePage() {
  const [heroSlides, highlights, projects, templates, faqs] = await Promise.all([
    getHeroSlides(),
    getHighlights(),
    getFeaturedProjects(),
    getFeaturedTemplates(),
    getFaqItems(),
  ]);

  const houseTypes = templates.map((t) => t.name);

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <Highlights highlights={highlights} />
      <ProjectsGrid projects={projects} />
      <HouseTemplates templates={templates} />
      <FaqSection faqs={faqs} />
      <QuoteForm houseTypes={houseTypes} />
    </>
  );
}
