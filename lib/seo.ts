import type { Metadata } from "next";
import { assetHref, pageHref, tr, type Lang } from "./content";

const configuredUrl = process.env.SITE_URL;
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : undefined;
export const seoPath = (lang:Lang,path="") => lang==="en" && !path ? assetHref("/") : pageHref(lang,path);

export function metadata(lang:Lang,title?:string,path=""):Metadata {
  const name = title ? `${title} | Intsinzi Digital Studio` : "Intsinzi Digital Studio";
  const description = tr(lang,["Independent software studio building custom web applications, SaaS, business software and AI integrations.","Niezależne studio tworzące dedykowane aplikacje webowe, produkty SaaS, oprogramowanie biznesowe i integracje AI."]);
  const canonical = siteUrl ? new URL(seoPath(lang,path),siteUrl).href : undefined;
  return {title:name,description,icons:{icon:assetHref("/mark.svg")},
    alternates: siteUrl ? {canonical,languages:{en:new URL(seoPath("en",path),siteUrl).href,pl:new URL(seoPath("pl",path),siteUrl).href,"x-default":new URL(seoPath("en",path),siteUrl).href}} : undefined,
    openGraph:{title:name,description,url:canonical,type:"website",siteName:"Intsinzi Digital Studio",locale:lang==="pl"?"pl_PL":"en_GB"},
  };
}
