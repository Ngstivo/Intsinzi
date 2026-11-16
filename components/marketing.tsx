import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Boxes, CalendarDays, Check, Code2, Database, Globe2, LayoutDashboard, Layers3, Plug, Sparkles, Users, Workflow } from "lucide-react";
import type { CSSProperties } from "react";
import { email, assetHref, pageHref, pages, principles, developmentSteps, projects, services, tr, type Lang, type Pair, type Project } from "../lib/content";
import { ContactForm } from "./contact";
import { Header } from "./header";

const icon = {web: Code2, saas: Layers3, crm: Users, booking: CalendarDays, ai: Sparkles, api: Plug, wp: Globe2};
const projectIcon = {clientflow: Users, bookease: CalendarDays, stockpilot: Boxes, "ai-desk": Sparkles};

export function Frame({lang,path,children}: {lang:Lang; path:string; children:React.ReactNode}) {
  return <><a className="skip" href="#main">{tr(lang,["Skip to content","Przejdź do treści"])}</a><Header lang={lang} path={path}/>
    <main id="main">{children}</main>
    <footer className="footer shell"><div><a className="brand" href={pageHref(lang)}><img src={assetHref("/mark.svg")} alt="" width="36" height="36"/><span>INTSINZI<small>DIGITAL STUDIO</small></span></a><p>{tr(lang,["Ideas into digital products.","Od pomysłu do cyfrowego produktu."])}</p></div><nav aria-label={tr(lang,["Footer","Stopka"])}>{pages.map(p=><a key={p.id} href={pageHref(lang,p.id)}>{tr(lang,p.label)}</a>)}</nav><a href={`mailto:${email}`}>{email}</a></footer>
  </>;
}

function SectionHead({tag,title,copy,lang,link}: {tag:Pair; title:Pair; copy?:Pair; lang:Lang; link?:{path:string; label:Pair}}) {
  return <div className="section-heading"><div><p className="eyebrow">{tr(lang,tag)}</p><h2>{tr(lang,title)}</h2>{copy && <p className="lede">{tr(lang,copy)}</p>}</div>{link && <a className="text-link" href={pageHref(lang,link.path)}>{tr(lang,link.label)}<ArrowUpRight size={17}/></a>}</div>;
}

function Chart() {
  return <svg className="chart" viewBox="0 0 450 136" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="area" x2="0" y2="1"><stop stopColor="#6c64f9" stopOpacity=".34"/><stop offset="1" stopColor="#6c64f9" stopOpacity="0"/></linearGradient></defs>
    <path d="M0 25h450M0 58h450M0 91h450M0 124h450" stroke="#232c46" strokeDasharray="3 4"/>
    <path d="M0 107C23 108 31 88 53 92S80 111 103 92S128 61 153 74S177 83 204 63S222 50 251 57S276 61 301 35S329 47 351 36S372 49 397 28S427 31 450 8V136H0Z" fill="url(#area)"/>
    <path d="M0 107C23 108 31 88 53 92S80 111 103 92S128 61 153 74S177 83 204 63S222 50 251 57S276 61 301 35S329 47 351 36S372 49 397 28S427 31 450 8" fill="none" stroke="#9c87ff" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
  </svg>;
}

function HeroPreview({lang}: {lang:Lang}) {
  const metrics = [{label:["Pipeline value","Wartość szans"],value:"84,500 PLN"},{label:["Open deals","Otwarte szanse"],value:"12"},{label:["Follow-ups","Zadania"],value:"04"}] as const;
  return <a className="hero-preview" href={pageHref(lang,"work/clientflow")} aria-label={tr(lang,["Open the ClientFlow CRM demo","Otwórz demonstrację ClientFlow CRM"])}>
    <div className="window-top"><span className="dots"><i/><i/><i/></span><span>ClientFlow CRM</span><ArrowUpRight size={15}/></div>
    <div className="mock-layout"><div className="mock-rail"><span><LayoutDashboard/></span><Users/><Workflow/><CalendarDays/></div><div className="mock-body">
      <div className="mock-title"><div><small>CLIENTFLOW CRM</small><strong>{tr(lang,["Sales overview","Przegląd sprzedaży"])}</strong></div><span className="demo-chip">{tr(lang,["Concept demo","Demonstracja"])}</span></div>
      <div className="mock-metrics">{metrics.map(m=><div key={m.value}><small>{tr(lang,m.label)}</small><strong>{m.value}</strong></div>)}</div>
      <div className="mock-chart"><div><strong>{tr(lang,["Pipeline activity","Aktywność sprzedaży"])}</strong><small>{tr(lang,["Last 6 months","Ostatnie 6 miesięcy"])}</small></div><Chart/><div className="axis"><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span></div></div>
      <div className="mock-foot"><span><i/>{tr(lang,["Sample workspace","Przykładowe dane"])}</span><span>{tr(lang,["Open interactive demo","Otwórz demonstrację"])} <ArrowUpRight size={12}/></span></div>
    </div></div>
  </a>;
}

function PreviewArt({project}: {project:Project}) {
  const title = project.name;
  const Glyph=projectIcon[project.id];
  return <div className="card-art" style={{"--accent":project.accent} as CSSProperties} aria-hidden="true">
    <div className="mini-window"><div className="mini-top"><Glyph size={13}/>{title}<span>•••</span></div><div className="mini-body">
      {project.id === "clientflow" && <div className="mini-pipeline">{[3,2,3].map((n,i)=><div key={i}><i/>{Array.from({length:n},(_,j)=><b key={j}/>)}</div>)}</div>}
      {project.id === "bookease" && <div className="mini-calendar">{Array.from({length:28},(_,i)=><i className={[3,8,15,18,24].includes(i) ? "selected" : ""} key={i}>{i+1}</i>)}</div>}
      {project.id === "stockpilot" && <div className="mini-bars">{[27,66,48,75,54,91,68,83,97].map((n,i)=><i key={i} style={{height:n+"%"}}/>)}</div>}
      {project.id === "ai-desk" && <div className="mini-chat"><div/><div/><div/></div>}
    </div></div>
  </div>;
}

function Projects({lang}: {lang:Lang}) {
  return <div className="project-grid">{projects.map(project=><a className="project-card panel" key={project.id} href={pageHref(lang,`work/${project.id}`)}><PreviewArt project={project}/><div className="card-content"><span className="project-type">{tr(lang,project.type)}</span><div className="project-title"><h3>{project.name}</h3><ArrowUpRight size={22}/></div><p>{tr(lang,project.detail)}</p></div></a>)}</div>;
}
function Services({lang,full=false}: {lang:Lang; full?:boolean}) {
  return <div className="service-grid">{(full ? services : services.slice(0,6)).map(s=>{const Glyph=icon[s.icon];return <article className="panel service-card" key={s.icon}><span className="tile-icon"><Glyph size={22}/></span><h3>{tr(lang,s.name)}</h3><p>{tr(lang,s.detail)}</p></article>;})}</div>;
}
function Principles({lang}: {lang:Lang}) {
  return <ul className="principles">{principles.map(p=><li key={p[0]}><Check size={18}/>{tr(lang,p)}</li>)}</ul>;
}
function Process({lang}: {lang:Lang}) {
  return <ol className="process">{developmentSteps.map((s,i)=><li key={s.title[0]}><span>0{i+1}</span><h3>{tr(lang,s.title)}</h3><p>{tr(lang,s.text)}</p></li>)}</ol>;
}
function Cta({lang}: {lang:Lang}) {
  return <section className="shell section"><div className="cta panel"><div><p className="eyebrow">{tr(lang,["Contact","Kontakt"])}</p><h2>{tr(lang,["What are you building?","Co chcesz zbudować?"])}</h2><p>{tr(lang,["Tell us what you need and where you want to take it.","Opowiedz, czego potrzebujesz i jaki cel chcesz osiągnąć."])}</p></div><a className="button primary" href={pageHref(lang,"contact")}>{tr(lang,["Start a project","Zacznij projekt"])}<ArrowUpRight size={18}/></a></div></section>;
}

export function Home({lang}: {lang:Lang}) {
  return <Frame lang={lang} path="">
    <section className="hero shell"><div className="hero-copy"><p className="eyebrow"><i/> {tr(lang,["Independent software studio","Niezależne studio programistyczne"])}</p><h1>{tr(lang,["Your Ideas.","Twoje pomysły."])}<br/><span>{tr(lang,["Engineered","Przekształcone"])}<br/>{tr(lang,["Into Reality.","w rzeczywistość."])}</span></h1>
    <p>{tr(lang,["We design and build custom web applications, business software and AI-powered solutions that help businesses simplify operations and grow.","Projektujemy i tworzymy dedykowane aplikacje webowe, oprogramowanie biznesowe i rozwiązania AI, które upraszczają pracę firm i wspierają ich rozwój."])}</p>
    <div className="actions"><a className="button primary" href={pageHref(lang,"contact")}>{tr(lang,["Start a Project","Zacznij projekt"])}<ArrowUpRight size={18}/></a><a className="button secondary" href="#work">{tr(lang,["Explore Our Work","Zobacz realizacje"])}<ArrowDown size={16}/></a></div></div><HeroPreview lang={lang}/></section>
    <div className="shell hero-baseline"><span><Globe2 size={15}/>{tr(lang,["Poland · Europe · Worldwide","Polska · Europa · cały świat"])}</span><span>{tr(lang,["Ideas into digital products.","Od pomysłu do cyfrowego produktu."])}<ArrowDownRight size={15}/></span></div>
    <section className="shell section" id="work"><SectionHead lang={lang} tag={["Selected work","Wybrane projekty"]} title={["Explore the demos.","Poznaj demonstracje."]} copy={["Four interactive concepts built to show how the software works.","Cztery interaktywne koncepcje pokazujące działanie oprogramowania."]} link={{path:"work",label:["All demonstrations","Wszystkie demonstracje"]}}/><Projects lang={lang}/></section>
    <section className="shell section"><SectionHead lang={lang} tag={["Services","Usługi"]} title={["Software built around your business.","Oprogramowanie dopasowane do Twojej firmy."]} link={{path:"services",label:["View all services","Zobacz wszystkie usługi"]}}/><Services lang={lang}/></section>
    <section className="shell section split"><SectionHead lang={lang} tag={["The studio","Studio"]} title={["Why work with Intsinzi?","Dlaczego Intsinzi?"]} copy={["Technology that moves business forward.","Technologia, która wspiera rozwój biznesu."]}/><Principles lang={lang}/></section>
    <section className="shell section"><SectionHead lang={lang} tag={["Technology","Technologia"]} title={["The tools behind the work.","Technologie, z których korzystamy."]}/><div className="stack">{["Next.js","React","TypeScript","Tailwind CSS","Node.js","PostgreSQL"].map((s,i)=><span key={s}>{i<4?<Code2 size={17}/>:<Database size={17}/>} {s}</span>)}</div></section>
    <section className="shell section"><SectionHead lang={lang} tag={["Process","Proces"]} title={["From first call to handover.","Od pierwszej rozmowy po przekazanie."]}/><Process lang={lang}/></section><Cta lang={lang}/>
  </Frame>;
}

const pricing = [
  {name:services[0].name, price:2500}, {name:services[1].name,price:3000},
  {name:["CRM and booking systems","CRM i systemy rezerwacji"] as const,price:3500}, {name:["AI integrations","Integracje AI"] as const,price:2000},
];

export function InnerPage({lang,id}: {lang:Lang;id:typeof pages[number]["id"]}) {
  const titles = {
    work:[["Explore the demos.","Poznaj demonstracje."],["Open any concept and try the workflows with sample data.","Otwórz dowolną koncepcję i przetestuj funkcje na przykładowych danych."]],
    services:[["Build the software your business needs.","Zbuduj oprogramowanie, którego potrzebuje Twoja firma."],["From an initial product release to the tools that keep daily operations running.","Od pierwszej wersji produktu po narzędzia do codziennej pracy."]],
    about:[["An independent software studio.","Niezależne studio programistyczne."],["Intsinzi builds custom software for businesses in Poland, Europe and worldwide. You work directly with the developer building your product.","Intsinzi tworzy dedykowane oprogramowanie dla firm w Polsce, Europie i na całym świecie. Współpracujesz bezpośrednio z programistą tworzącym Twój produkt."]],
    pricing:[["Starting prices.","Ceny wyjściowe."],["Final quotations depend on your requirements and the agreed scope.","Ostateczna wycena zależy od wymagań i uzgodnionego zakresu."]],
    contact:[["Tell us about your project.","Opowiedz o swoim projekcie."],["Share the problem you want to solve, the people who will use the product and any timing constraints.","Opisz problem do rozwiązania, przyszłych użytkowników i istotne terminy."]],
  } as const;
  return <Frame lang={lang} path={id}><section className="shell inner-intro"><p className="eyebrow">{tr(lang,pages.find(p=>p.id===id)!.label)}</p><h1>{tr(lang,titles[id][0])}</h1><p className="lede">{tr(lang,titles[id][1])}</p></section>
    <div className="shell inner-content">
      {id==="work" && <Projects lang={lang}/>}
      {id==="services" && <Services lang={lang} full/>}
      {id==="about" && <><Principles lang={lang}/><section className="section"><SectionHead lang={lang} tag={["Process","Proces"]} title={["How we work.","Jak pracujemy."]}/><Process lang={lang}/></section></>}
      {id==="pricing" && <div className="price-grid">{pricing.map(p=><article className="panel price-card" key={p.price}><h2>{tr(lang,p.name)}</h2><p>{tr(lang,["From","Od"])} <strong>{new Intl.NumberFormat(lang==="pl"?"pl-PL":"en-GB",{useGrouping:"always"}).format(p.price)} PLN</strong></p><a className="text-link" href={pageHref(lang,"contact")}>{tr(lang,["Discuss your project","Porozmawiajmy o projekcie"])}<ArrowRight size={17}/></a></article>)}</div>}
      {id==="contact" && <div className="contact-layout"><aside className="panel contact-aside"><h2>{tr(lang,["Email the studio","Napisz do studia"])}</h2><a href={`mailto:${email}`}>{email}</a><p><Globe2 size={16}/>{tr(lang,["Poland · Europe · Worldwide","Polska · Europa · cały świat"])}</p></aside><ContactForm lang={lang}/></div>}
    </div>{id!=="contact" && <Cta lang={lang}/>}</Frame>;
}
