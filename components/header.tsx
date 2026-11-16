"use client";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Globe2, Menu, X } from "lucide-react";
import { assetHref, pages, pageHref } from "../lib/content";
import { languages, locales, tr, type Lang } from "../lib/localization";

export function Header({ lang, path }: { lang: Lang; path: string }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="shell header-inner">
      <a className="brand" href={pageHref(lang)}><img src={assetHref("/mark.svg")} alt="" width="39" height="39"/><span>INTSINZI<small>DIGITAL STUDIO</small></span></a>
      <button type="button" className="nav-toggle icon-button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? tr(lang,["Close menu","Zamknij menu"]) : tr(lang,["Open menu","Otwórz menu"])} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav id="site-nav" className={open ? "site-nav open" : "site-nav"} aria-label={tr(lang,["Main navigation","Menu główne"])}>
        {pages.slice(0,4).map(({id,label}) => <a key={id} href={pageHref(lang,id)} aria-current={path === id ? "page" : path.startsWith(id + "/") ? "location" : undefined}>{tr(lang,label)}</a>)}
        <details className="language">
          <summary aria-label={`${tr(lang,["Language","Język"])}: ${locales[lang].name}`}><Globe2 size={14}/>{lang.toUpperCase()}<ChevronDown size={13}/></summary>
          <ul>{languages.map(locale => <li key={locale}><a href={pageHref(locale,path)} lang={locale} hrefLang={locale} aria-current={lang === locale ? "true" : undefined}>{locales[locale].name}</a></li>)}</ul>
        </details>
        <a className="button header-cta" href={pageHref(lang,"contact")}>{tr(lang,["Start a project","Zacznij projekt"])}<ArrowUpRight size={16}/></a>
      </nav>
    </div>
  </header>;
}
