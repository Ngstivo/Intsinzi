import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Frame } from "../../../../components/marketing";
import { AiDesk } from "../../../../components/ai-desk";
import { BookEase } from "../../../../components/bookease";
import { ClientFlow } from "../../../../components/clientflow";
import { StockPilot } from "../../../../components/stockpilot";
import { pageHref, projects, tr, type Lang } from "../../../../lib/content";
import { metadata } from "../../../../lib/seo";

const demos={clientflow:ClientFlow,bookease:BookEase,stockpilot:StockPilot,"ai-desk":AiDesk};
type Props={params:Promise<{lang:Lang;demo:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return projects.map(({id})=>({demo:id}));}
export async function generateMetadata({params}:Props){
  const {lang,demo}=await params;
  const project=projects.find(p=>p.id===demo);
  if(!project) notFound();
  return metadata(lang,project.name,`work/${demo}`);
}
export default async function Page({params}:Props){
  const {lang,demo}=await params;
  const project=projects.find(p=>p.id===demo);
  if(!project) notFound();
  const Demo=demos[project.id];
  return <Frame lang={lang} path={`work/${demo}`}><div className="shell demo-page">
    <a className="text-link" href={pageHref(lang,"work")}><ArrowLeft size={16}/>{tr(lang,["All demonstrations","Wszystkie demonstracje"])}</a>
    <div className="demo-heading"><div><p className="eyebrow">{tr(lang,["Interactive concept demo","Interaktywna demonstracja koncepcji"])}</p><h1>{project.name}</h1><p className="lede">{tr(lang,project.detail)}</p></div><a className="button primary" href={`${pageHref(lang,"contact")}?demo=${encodeURIComponent(project.name)}`}>{tr(lang,["Request a similar product","Zapytaj o podobny produkt"])}<ArrowUpRight size={17}/></a></div>
    <p className="sample-note">{tr(lang,["Use sample information only. Changes reset when you reload this page.","Używaj tylko przykładowych danych. Zmiany znikają po odświeżeniu strony."])}</p>
    <section className="panel demo-workspace" aria-label={project.name}><Demo lang={lang}/></section>
  </div></Frame>;
}
