import { Home } from "../../components/marketing";
import { metadata } from "../../lib/seo";
import type { Lang } from "../../lib/content";
type Props={params:Promise<{lang:Lang}>};
export async function generateMetadata({params}:Props){return metadata((await params).lang);}
export default async function Page({params}:Props){return <Home lang={(await params).lang}/>;}
