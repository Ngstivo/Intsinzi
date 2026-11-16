"use client";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { type Lang, pages, assetHref, pageHref, tr } from "../lib/content";

export function Header({ lang, path }: { lang: Lang; path: string }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="shell header-inner">
      <a className="brand" href={pageHref(lang)}><img src={assetHref("/mark.svg")} alt="" width="39" height="39"/><span>INTSINZI<small>DIGITAL STUDIO</small></span></a>
      <button type="button" className="nav-toggle icon-button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? tr(lang,["Close menu","Zamknij menu"]) : tr(lang,["Open menu","Otwórz menu"])} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav id="site-nav" className={open ? "site-nav open" : "site-nav"} aria-label={tr(lang,["Main navigation","Menu główne"])}>
        {pages.slice(0,4).map(({id,label}) => <a key={id} href={pageHref(lang,id)} aria-current={path === id ? "page" : path.startsWith(id + "/") ? "location" : undefined}>{tr(lang,label)}</a>)}
        <div className="language" aria-label={tr(lang,["Language","Język"])}>{(["en","pl"] as const).map(locale => <a key={locale} href={pageHref(locale,path)} lang={locale} hrefLang={locale} aria-current={lang === locale ? "true" : undefined}>{locale.toUpperCase()}</a>)}</div>
        <a className="button header-cta" href={pageHref(lang,"contact")}>{tr(lang,["Start a project","Zacznij projekt"])}<ArrowUpRight size={16}/></a>
      </nav>
    </div>
  </header>;
}
