import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import AboutPageContent from "@/components/sections/AboutPage";
import type { AboutHighlight } from "@/components/sections/AboutPage";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Xưởng Gỗ Hoàng Huân - 40 năm tâm huyết với nghề mộc truyền thống, chuyên thi công nhà gỗ cổ truyền Bắc Bộ.",
};

interface AboutPageData {
  story: string | null;
  teamDescription: string | null;
  highlights: AboutHighlight[] | null;
  heroImage: { asset: { url: string } } | null;
}

export default async function AboutPage() {
  const data = await client.fetch<AboutPageData>(aboutPageQuery);

  return (
    <AboutPageContent
      highlights={data?.highlights ?? null}
      story={data?.story ?? null}
      heroImageUrl={data?.heroImage?.asset?.url ?? null}
    />
  );
}
