import type { Metadata } from "next";
import { assetHref, pageHref } from "./content";
import { languages, locales, tr, type Lang } from "./localization";

const configuredUrl = process.env.SITE_URL;
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : undefined;
export const seoPath = (lang:Lang,path="") => lang==="en" && !path ? assetHref("/") : pageHref(lang,path);
export function alternateLinks(path: string, origin: string) {
  return Object.fromEntries(languages.map(lang => [lang, new URL(seoPath(lang,path),origin).href]));
}

export function metadata(lang:Lang,title?:string,path=""):Metadata {
  const name = title ? `${title} | Intsinzi Digital Studio` : "Intsinzi Digital Studio";
  const description = tr(lang,["Independent software studio building custom web applications, SaaS, business software and AI integrations.","Niezależne studio tworzące dedykowane aplikacje webowe, produkty SaaS, oprogramowanie biznesowe i integracje AI."]);
  const canonical = siteUrl ? new URL(seoPath(lang,path),siteUrl).href : undefined;
  const ogLocale = (locale: Lang) => locales[locale].region.replace("-", "_");
  return {title:name,description,icons:{icon:assetHref("/mark.svg")},
    alternates: siteUrl ? {canonical,languages:{...alternateLinks(path,siteUrl),"x-default":new URL(seoPath("en",path),siteUrl).href}} : undefined,
    openGraph:{title:name,description,url:canonical,type:"website",siteName:"Intsinzi Digital Studio",locale:ogLocale(lang),alternateLocale:languages.filter(locale=>locale!==lang).map(ogLocale)},
  };
}
