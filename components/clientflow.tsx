"use client";
import { useState, type FormEvent } from "react";
import { tr, type Lang } from "../lib/content";
import { initialLeads, stages } from "../lib/demo-data";
import { Bars, money, Stats, Table, Tabs } from "./demo-ui";

export function ClientFlow({lang}:{lang:Lang}) {
  const [leads,setLeads]=useState(()=>initialLeads.map(lead=>({...lead,followUp:lead.followUp ? tr(lang,lead.followUp) : ""})));
  const [search,setSearch]=useState("");
  const msg=(en:string,pl:string)=>tr(lang,[en,pl]);
  const move=(id:number,stage:number)=>setLeads(list=>list.map(l=>l.id===id?{...l,stage}:l));
  function add(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget;
    const data=new FormData(form);
    const name=String(data.get("name")).trim(), company=String(data.get("company")).trim();
    if(!name||!company) return;
    setLeads(list=>[...list,{id:Math.max(0,...list.map(l=>l.id))+1,name,company,stage:0,value:Number(data.get("value")),followUp:String(data.get("followUp")).trim()}]);
    form.reset();
  }
  const active=leads.filter(l=>l.stage<3);
  const reminders=leads.filter(l=>l.followUp);
  const stageSelect=(lead:typeof leads[number])=><select aria-label={`${msg("Stage","Etap")} — ${lead.name}`} value={lead.stage} onChange={e=>move(lead.id,Number(e.target.value))}>{stages.map((s,i)=><option key={s[0]} value={i}>{tr(lang,s)}</option>)}</select>;
  return <Tabs lang={lang} items={[["Overview","Przegląd"],["Customers","Klienci"],["Pipeline","Lejek"],["Follow-ups","Zadania"],["Analytics","Analityka"]]}>{tab=><>
    {tab===0 && <><h2>{msg("Sales overview","Przegląd sprzedaży")}</h2><Stats items={[{label:msg("Open deals","Otwarte szanse"),value:active.length},{label:msg("Open pipeline","Wartość lejka"),value:money(lang,active.reduce((s,l)=>s+l.value,0))},{label:msg("Follow-ups","Zadania"),value:reminders.length}]}/></>}
    {(tab===0||tab===4) && <><h3>{msg("Deal value by stage","Wartość szans wg etapu")}</h3><Bars items={stages.map((stage,i)=>{const value=leads.filter(l=>l.stage===i).reduce((s,l)=>s+l.value,0);return {name:tr(lang,stage),value,formatted:money(lang,value)};})}/>{tab===4&&<p>{msg("Share of leads won","Udział wygranych szans")}: {Math.round(leads.filter(l=>l.stage===3).length/leads.length*100)}%</p>}</>}
    {tab===1 && <><h2>{msg("Customer records","Rejestr klientów")}</h2><form className="demo-form" onSubmit={add}>
      <label>{msg("Sample contact name","Przykładowe imię i nazwisko")}<input name="name" required maxLength={60}/></label>
      <label>{msg("Sample company","Przykładowa firma")}<input name="company" required maxLength={60}/></label>
      <label>{msg("Deal value (PLN)","Wartość (PLN)")}<input name="value" type="number" min={0} max={99999999} required/></label>
      <label>{msg("Follow-up reminder","Przypomnienie")}<input name="followUp" maxLength={120}/></label>
      <button className="button primary" type="submit">{msg("Add lead","Dodaj lead")}</button>
    </form><label className="search-field">{msg("Search customers","Szukaj klientów")}<input type="search" value={search} onChange={e=>setSearch(e.target.value)}/></label>
    <Table columns={[msg("Contact","Kontakt"),msg("Company","Firma"),msg("Value","Wartość"),msg("Stage","Etap")]} rows={leads.filter(l=>`${l.name} ${l.company}`.toLowerCase().includes(search.trim().toLowerCase())).map(l=>({id:l.id,cells:[l.name,l.company,money(lang,l.value),stageSelect(l)]}))} empty={msg("No matching records.","Brak pasujących rekordów.")}/></>}
    {tab===2 && <><h2>{msg("Sales pipeline","Lejek sprzedaży")}</h2><div className="pipeline">{stages.map((s,i)=><section key={s[0]} className="panel"><h3>{tr(lang,s)}</h3>{leads.filter(l=>l.stage===i).map(l=><div key={l.id} className="pipeline-deal"><strong>{l.company}</strong><small>{money(lang,l.value)}</small>{stageSelect(l)}</div>)}</section>)}</div></>}
    {tab===3 && <><h2>{msg("Follow-up reminders","Przypomnienia o zadaniach")}</h2><Table columns={[msg("Contact","Kontakt"),msg("Reminder","Przypomnienie"),msg("Action","Działanie")]} rows={reminders.map(l=>({id:l.id,cells:[l.name,l.followUp,<button className="button secondary" key="done" onClick={()=>setLeads(list=>list.map(x=>x.id===l.id?{...x,followUp:""}:x))}>{msg("Mark complete","Oznacz jako wykonane")}</button>]}))} empty={msg("All caught up.","Brak zadań do wykonania.")}/></>}
  </>}</Tabs>;
}
