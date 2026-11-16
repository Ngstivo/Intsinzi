"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { email, services, tr, type Lang, type Pair } from "../lib/content";

export function ContactForm({lang}: {lang: Lang}) {
  const [draft,setDraft] = useState("");
  const labels: Record<string, Pair> = {
    name:["Name", "Imię i nazwisko"], email:["Email", "E-mail"], company:["Company", "Firma"],
    type:["Project type", "Typ projektu"], budget:["Estimated budget", "Szacunkowy budżet"],
    language:["Preferred language", "Preferowany język"], description:["Project description", "Opis projektu"],
  };
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = Object.entries(labels).map(([key,label]) => `${tr(lang,label)}: ${(key === "language" ? (data.get(key) === "pl" ? "Polski" : "English") : String(data.get(key) ?? "")).trim()}`).join("\r\n\r\n");
    const source = new URLSearchParams(window.location.search).get("demo") ?? "";
    const ref = source ? `\r\n\r\n${tr(lang,["Reference demo","Demonstracja referencyjna"])}: ${source.slice(0,80)}` : "";
    const url = `mailto:${email}?subject=${encodeURIComponent(tr(lang,["New project enquiry","Zapytanie o projekt"]))}&body=${encodeURIComponent(body + ref)}`;
    setDraft(url);
    window.location.href = url;
  }
  const label = (key: string) => tr(lang,labels[key]);
  return <form className="contact-form panel" onSubmit={submit}>
    <div className="field-grid">
      <label>{label("name")}<input name="name" autoComplete="name" required maxLength={100}/></label>
      <label>{label("email")}<input name="email" type="email" autoComplete="email" required maxLength={150}/></label>
      <label>{label("company")}<input name="company" autoComplete="organization" maxLength={120}/></label>
      <label>{label("type")}<select name="type" required defaultValue=""><option value="" disabled>{tr(lang,["Select project type","Wybierz typ projektu"])}</option>{services.map(s => <option key={s.icon}>{tr(lang,s.name)}</option>)}<option>{tr(lang,["Other","Inny"])}</option></select></label>
      <label>{label("budget")}<select name="budget" required defaultValue=""><option value="" disabled>{tr(lang,["Select a range","Wybierz przedział"])}</option><option>2,000–4,999 PLN</option><option>5,000–9,999 PLN</option><option>10,000+ PLN</option><option>{tr(lang,["To be discussed","Do ustalenia"])}</option></select></label>
      <label>{label("language")}<select name="language" defaultValue={lang}><option value="en">English</option><option value="pl">Polski</option></select></label>
    </div>
    <label>{label("description")}<textarea name="description" rows={6} maxLength={1400} required placeholder={tr(lang,["What should the product help you do?","Co ma umożliwiać Twój produkt?"])}/></label>
    <button className="button primary" type="submit">{tr(lang,["Open email draft","Otwórz szkic wiadomości"])}<ArrowUpRight size={17}/></button>
    <p className="muted">{tr(lang,["Your email app will open with a draft. Review and send it there.","Aplikacja pocztowa otworzy szkic wiadomości. Sprawdź i wyślij go w aplikacji."])}</p>
    <div role="status">{draft && <a href={draft}>{tr(lang,["Reopen the email draft","Otwórz szkic ponownie"])}</a>}</div>
  </form>;
}
