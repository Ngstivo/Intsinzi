import "../globals.css";
import { notFound } from "next/navigation";
import { isLanguage, languages } from "../../lib/localization";
export const dynamicParams = false;
export function generateStaticParams(){return languages.map(lang=>({lang}));}
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}) {
  const {lang}=await params;
  if(!isLanguage(lang)) notFound();
  return <html lang={lang}><body>{children}</body></html>;
}
