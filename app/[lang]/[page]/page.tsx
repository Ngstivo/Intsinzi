import { notFound } from "next/navigation";
import { InnerPage } from "../../../components/marketing";
import { pages, tr, type Lang } from "../../../lib/content";
import { metadata } from "../../../lib/seo";
type Props={params:Promise<{lang:Lang;page:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return pages.map(({id})=>({page:id}));}
export async function generateMetadata({params}:Props){
  const {lang,page}=await params;
  const entry=pages.find(p=>p.id===page);
  if(!entry) notFound();
  return metadata(lang,tr(lang,entry.label),page);
}
export default async function Page({params}:Props){
  const {lang,page}=await params;
  const entry=pages.find(p=>p.id===page);
  if(!entry) notFound();
  return <InnerPage lang={lang} id={entry.id}/>;
}
