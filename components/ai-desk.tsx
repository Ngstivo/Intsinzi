"use client";
import { useState, type FormEvent } from "react";
import { tr, type Lang } from "../lib/content";
import { articles } from "../lib/demo-data";
import { Tabs } from "./demo-ui";

type Answer={prompt:string;article:typeof articles[number]|undefined};
const documents=[
  ["Order CF-1042. The item is unused and I would like to return it.","Zamówienie CF-1042. Produkt jest nieużywany i chcę go zwrócić."],
  ["Order CF-2081. Tracking has not updated and my delivery is overdue.","Zamówienie CF-2081. Śledzenie nie zostało zaktualizowane, a dostawa jest opóźniona."],
  ["I cannot sign in. The password reset email has not arrived.","Nie mogę się zalogować. Wiadomość z linkiem do resetowania hasła nie dotarła."],
] as const;
export function AiDesk({lang}:{lang:Lang}) {
  const [answers,setAnswers]=useState<Answer[]>([]);
  const [query,setQuery]=useState("");
  const [document,setDocument]=useState(0);
  const [analysis,setAnalysis]=useState<{id:number;article:typeof articles[number]}>();
  const [tickets,setTickets]=useState<{id:number;approved:boolean}[]>([]);
  const queued=analysis && tickets.some(ticket=>ticket.id===analysis.id);
  const msg=(en:string,pl:string)=>tr(lang,[en,pl]);
  const documentText=documents.map(item=>tr(lang,item));
  function ask(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget;
    const prompt=String(new FormData(form).get("prompt")).trim();
    if(!prompt) return;
    setAnswers(list=>[...list,{prompt,article:articles.find(a=>a.keywords.test(prompt))}]);
    form.reset();
  }
  return <><p className="simulation-note">{msg("This simulation uses local rules and sample documents. It makes no AI requests.","Symulacja korzysta z lokalnych reguł i przykładowych dokumentów. Nie wysyła zapytań do AI.")}</p><Tabs lang={lang} items={[["Assistant","Asystent"],["Knowledge base","Baza wiedzy"],["Documents","Dokumenty"],["Support queue","Kolejka wsparcia"]]}>{tab=><>
    {tab===0&&<><h2>{msg("Support assistant","Asystent wsparcia")}</h2><p className="muted">{msg("Try asking about a return, delivery or password reset.","Zapytaj o zwrot, dostawę lub resetowanie hasła.")}</p>
      <div className="chat-thread" role="log" aria-label={msg("Conversation","Rozmowa")}>{answers.map(({prompt,article},i)=><div key={i}><div className="chat-prompt">{prompt}</div><div className="panel chat-answer">{article?<><strong>{tr(lang,article.title)}</strong><p>{tr(lang,article.body)}</p></>:msg("No matching article. Route this question to a support agent.","Brak pasującego artykułu. Przekaż pytanie pracownikowi wsparcia.")}</div></div>)}</div>
      <form className="demo-form" onSubmit={ask}><label>{msg("Sample question","Przykładowe pytanie")}<input name="prompt" required maxLength={260}/></label><button className="button primary" type="submit">{msg("Ask assistant","Zapytaj asystenta")}</button></form>
    </>}
    {tab===1&&<><h2>{msg("Knowledge base","Baza wiedzy")}</h2><label className="search-field">{msg("Search articles","Szukaj artykułów")}<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="knowledge">{articles.filter(a=>`${tr(lang,a.title)} ${tr(lang,a.body)}`.toLowerCase().includes(query.trim().toLowerCase())).map(a=><details className="panel" key={a.title[0]}><summary>{tr(lang,a.title)}</summary><p>{tr(lang,a.body)}</p></details>)}</div>{!articles.some(a=>`${tr(lang,a.title)} ${tr(lang,a.body)}`.toLowerCase().includes(query.trim().toLowerCase()))&&<p>{msg("No matching articles.","Brak pasujących artykułów.")}</p>}</>}
    {tab===2&&<><h2>{msg("Document processing","Przetwarzanie dokumentów")}</h2><label className="search-field">{msg("Sample document","Przykładowy dokument")}<select value={document} onChange={e=>{setDocument(Number(e.target.value));setAnalysis(undefined);}}>{articles.map((a,i)=><option value={i} key={a.title[0]}>{tr(lang,a.title)}</option>)}</select></label><blockquote className="panel document">{documentText[document]}</blockquote><button type="button" className="button primary" onClick={()=>setAnalysis({id:document,article:articles.find(a=>a.keywords.test(documents[document][0]))??articles[document]})}>{msg("Process sample","Przetwórz próbkę")}</button>
      {analysis&&<div className="panel document"><p>{msg("Category","Kategoria")} <strong>{tr(lang,analysis.article.title)}</strong></p><p>{msg("Order reference","Numer zamówienia")} <strong>{documents[analysis.id][0].match(/CF-\d+/)?.[0]??"—"}</strong></p><p>{tr(lang,analysis.article.body)}</p><button className="button secondary" type="button" disabled={queued} onClick={()=>setTickets(list=>list.some(ticket=>ticket.id===analysis.id)?list:[...list,{id:analysis.id,approved:false}])}>{msg("Queue draft for review","Dodaj szkic do kolejki")}</button><p role="status">{queued&&msg("Draft is in the support queue.","Szkic znajduje się w kolejce wsparcia.")}</p></div>}
    </>}
    {tab===3&&<><h2>{msg("Support queue","Kolejka wsparcia")}</h2>{tickets.length?tickets.map(ticket=><div className="panel document" key={ticket.id}><h3>{tr(lang,articles[ticket.id].title)}</h3><p>{tr(lang,articles[ticket.id].body)}</p><p role="status">{ticket.approved?msg("Approved in this demo.","Zatwierdzono w demonstracji."):msg("Waiting for human review.","Oczekuje na weryfikację.")}</p>{!ticket.approved&&<button type="button" className="button primary" onClick={()=>setTickets(list=>list.map(item=>item.id===ticket.id?{...item,approved:true}:item))}>{msg("Approve draft","Zatwierdź szkic")}</button>}</div>):<p>{msg("Process a sample document and queue its draft to try the review workflow.","Przetwórz przykładowy dokument i dodaj szkic do kolejki, aby przetestować weryfikację.")}</p>}</>}
  </>}</Tabs></>;
}
