import HeroSlider from "@/components/sections/HeroSlider";
import Highlights from "@/components/sections/Highlights";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import HouseTemplates from "@/components/sections/HouseTemplates";
import FaqSection from "@/components/sections/FaqSection";
import QuoteForm from "@/components/sections/QuoteForm";
import { client } from "@/sanity/lib/client";
import { faqItemsQuery } from "@/sanity/lib/queries";
import type { FaqItem } from "@/components/sections/FaqSection";

export default async function HomePage() {
  const faqs: FaqItem[] = await client.fetch(faqItemsQuery);

  return (
    <>
      <HeroSlider />
      <Highlights />
      <ProjectsGrid />
      <HouseTemplates />
      <FaqSection faqs={faqs ?? []} />
      <QuoteForm />
    </>
  );
}
