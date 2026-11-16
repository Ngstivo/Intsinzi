import "../globals.css";
import { notFound } from "next/navigation";
export const dynamicParams = false;
export function generateStaticParams(){return [{lang:"en"},{lang:"pl"}];}
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}) {
  const {lang}=await params;
  if(lang!=="en" && lang!=="pl") notFound();
  return <html lang={lang}><body>{children}</body></html>;
}
