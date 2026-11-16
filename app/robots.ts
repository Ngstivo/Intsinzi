import type { MetadataRoute } from "next";
import { assetHref } from "../lib/content";
import { siteUrl } from "../lib/seo";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {rules:{userAgent:"*",allow:"/"},sitemap:siteUrl ? `${siteUrl}${assetHref("/sitemap.xml")}` : undefined};
}
