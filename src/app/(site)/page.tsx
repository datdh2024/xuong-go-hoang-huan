import HeroSlider from "@/components/sections/HeroSlider";
import Highlights from "@/components/sections/Highlights";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import HouseTemplates from "@/components/sections/HouseTemplates";
import FaqSection from "@/components/sections/FaqSection";
import QuoteForm from "@/components/sections/QuoteForm";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Highlights />
      <ProjectsGrid />
      <HouseTemplates />
      <FaqSection />
      <QuoteForm />
    </>
  );
}
