import type { MetadataRoute } from "next";
import { pages, projects } from "../lib/content";
import { seoPath, siteUrl } from "../lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  if(!siteUrl) return [];
  const origin=siteUrl;
  const routes=["",...pages.map(p=>p.id),...projects.map(p=>`work/${p.id}`)];
  return (["en","pl"] as const).flatMap(lang=>routes.map(route=>({
    url:new URL(seoPath(lang,route),origin).href,
    alternates:{languages:{en:new URL(seoPath("en",route),origin).href,pl:new URL(seoPath("pl",route),origin).href}},
  })));
}
