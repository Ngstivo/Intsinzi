"use client";
import { useState, type ReactNode } from "react";
import { locales, tr, type Lang, type Pair } from "../lib/localization";

export function Tabs({lang,items,children}:{lang:Lang;items:readonly Pair[];children:(tab:number)=>ReactNode}) {
  const [tab,setTab]=useState(0);
  return <><div className="demo-nav" role="group" aria-label={tr(lang,["Workspace views","Widoki panelu"])}>{items.map((item,i)=><button type="button" key={item[0]} aria-pressed={tab===i} onClick={()=>setTab(i)}>{tr(lang,item)}</button>)}</div><div className="demo-content">{children(tab)}</div></>;
}
export function Stats({items}:{items:{label:string;value:string|number}[]}) {
  return <dl className="demo-stats">{items.map(s=><div className="panel" key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>;
}
export function Table({columns,rows,empty}:{columns:string[];rows:{id:string|number;cells:ReactNode[]}[];empty:string}) {
  return <div className="table-wrap" tabIndex={0} role="region" aria-label={columns.join(", ")}><table><thead><tr>{columns.map(c=><th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{rows.length ? rows.map(row=><tr key={row.id}>{row.cells.map((cell,i)=><td key={i}>{cell}</td>)}</tr>) : <tr><td colSpan={columns.length}>{empty}</td></tr>}</tbody></table></div>;
}
export function Bars({items}:{items:{name:string;value:number;formatted?:string}[]}) {
  const max=Math.max(1,...items.map(i=>i.value));
  return <ul className="report-bars">{items.map(i=><li key={i.name}><div><span>{i.name}</span><strong>{i.formatted??i.value}</strong></div><div className="bar-track" aria-hidden="true"><div style={{width:`${i.value/max*100}%`}}/></div></li>)}</ul>;
}
export function money(lang:Lang,value:number) {
  return new Intl.NumberFormat(locales[lang].region,{style:"currency",currency:"PLN",maximumFractionDigits:0}).format(value);
}
