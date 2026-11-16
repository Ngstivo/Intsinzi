"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { email, projects, services, tr, type Lang, type Pair } from "../lib/content";
import { isLanguage, languages, locales } from "../lib/localization";

const endpoint = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT;
const labels = {
  name:["Name", "Imię i nazwisko"], email:["Email", "E-mail"], company:["Company", "Firma"],
  type:["Project type", "Typ projektu"], budget:["Estimated budget", "Szacunkowy budżet"],
  language:["Preferred language", "Preferowany język"], description:["Project description", "Opis projektu"],
} as const satisfies Record<string, Pair>;

type Result = "idle" | "pending" | "saved" | "unavailable" | "invalid" | "rate";
const resultText = {
  pending:["Sending your enquiry…","Wysyłanie zapytania…"],
  saved:["Your enquiry was received. We’ll reply to the email address you provided.","Otrzymaliśmy Twoje zapytanie. Odpowiemy na podany adres e-mail."],
  unavailable:["We couldn’t confirm that your enquiry was received. Try again or email the studio.","Nie udało się potwierdzić odbioru zapytania. Spróbuj ponownie lub napisz do studia."],
  invalid:["Check your details and try again.","Sprawdź dane i spróbuj ponownie."],
  rate:["You’ve reached the sending limit. Try again later or email the studio.","Osiągnięto limit wysyłki. Spróbuj później lub napisz do studia."],
} as const satisfies Record<Exclude<Result, "idle">, Pair>;

export function ContactForm({lang}: {lang: Lang}) {
  const [draft,setDraft] = useState("");
  const [result,setResult] = useState<Result>("idle");
  const previous = useRef<{ id: string; signature: string } | null>(null);
  const sending = useRef(false);
  const number = new Intl.NumberFormat(locales[lang].region,{useGrouping:"always"});
  const budgets = [
    {id:"2000-4999", text:`${number.format(2000)}–${number.format(4999)} PLN`},
    {id:"5000-9999", text:`${number.format(5000)}–${number.format(9999)} PLN`},
    {id:"10000+", text:`${number.format(10000)}+ PLN`},
    {id:"discuss", text:tr(lang,["To be discussed","Do ustalenia"])},
  ];
  const types = [
    ...services.map(service=>({id:service.icon,text:tr(lang,service.name)})),
    {id:"other",text:tr(lang,["Other","Inny"])},
  ];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const preferredLanguage = field("language");
    const source = new URLSearchParams(window.location.search).get("demo");
    const demoReference = projects.find(project => project.name === source)?.name ?? null;
    const payload = {
      name:field("name"), email:field("email"), company:field("company"),
      projectType:field("type"), budget:field("budget"), description:field("description"),
      preferredLanguage, siteLanguage:lang, demoReference, website:field("website"),
    };

    if (!endpoint) {
      const fields = {
        name:payload.name, email:payload.email, company:payload.company,
        type:types.find(type=>type.id===payload.projectType)?.text ?? "",
        budget:budgets.find(budget=>budget.id===payload.budget)?.text ?? "",
        language:isLanguage(preferredLanguage) ? locales[preferredLanguage].name : preferredLanguage,
        description:payload.description,
      };
      const body = (Object.keys(fields) as (keyof typeof fields)[]).map(key => `${tr(lang,labels[key])}: ${fields[key]}`);
      if (demoReference) body.push(`${tr(lang,["Reference demo","Demonstracja referencyjna"])}: ${demoReference}`);
      const url = `mailto:${email}?subject=${encodeURIComponent(tr(lang,["New project enquiry","Zapytanie o projekt"]))}&body=${encodeURIComponent(body.join("\r\n\r\n"))}`;
      setDraft(url);
      window.location.href = url;
      return;
    }

    sending.current = true;
    setResult("pending");
    try {
      const signature = JSON.stringify(payload);
      const id = previous.current?.signature === signature ? previous.current.id : crypto.randomUUID();
      previous.current = { id, signature };
      const response = await fetch(endpoint,{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({...payload,id}),signal:AbortSignal.timeout(12_000),
      });
      if (response.ok && (await response.json()).id === id) {
        previous.current = null;
        form.reset();
        setResult("saved");
      } else {
        setResult(response.status === 429 ? "rate" : response.status === 400 ? "invalid" : "unavailable");
      }
    } catch {
      setResult("unavailable");
    } finally {
      sending.current = false;
    }
  }

  const label = (key: keyof typeof labels) => tr(lang,labels[key]);
  const pending = result === "pending";
  return <form className="contact-form panel" method="post" onSubmit={submit}>
    <fieldset className="enquiry-fields" disabled={pending}>
      <div className="field-grid">
        <label>{label("name")}<input name="name" autoComplete="name" required maxLength={100}/></label>
        <label>{label("email")}<input name="email" type="email" autoComplete="email" required maxLength={150}/></label>
        <label>{label("company")}<input name="company" autoComplete="organization" maxLength={120}/></label>
        <label>{label("type")}<select name="type" required defaultValue=""><option value="" disabled>{tr(lang,["Select project type","Wybierz typ projektu"])}</option>{types.map(type => <option key={type.id} value={type.id}>{type.text}</option>)}</select></label>
        <label>{label("budget")}<select name="budget" required defaultValue=""><option value="" disabled>{tr(lang,["Select a range","Wybierz przedział"])}</option>{budgets.map(budget => <option key={budget.id} value={budget.id}>{budget.text}</option>)}</select></label>
        <label>{label("language")}<select name="language" defaultValue={lang}>{languages.map(locale => <option key={locale} value={locale} lang={locale}>{locales[locale].name}</option>)}</select></label>
      </div>
      <label hidden style={{display:"none"}}>Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <label>{label("description")}<textarea name="description" rows={6} maxLength={1400} required placeholder={tr(lang,["What should the product help you do?","Co ma umożliwiać Twój produkt?"])}/></label>
      <button className="button primary" type="submit">{tr(lang,endpoint ? ["Send project enquiry","Wyślij zapytanie o projekt"] : ["Open email draft","Otwórz szkic wiadomości"])}<ArrowUpRight size={17}/></button>
    </fieldset>
    {endpoint
      ? <p className="muted">{tr(lang,["The studio uses these details to review and respond to your request.","Studio wykorzystuje te dane, aby rozpatrzyć zapytanie i na nie odpowiedzieć."])}</p>
      : <p className="muted">{tr(lang,["Your email app will open with a draft. Review and send it there.","Aplikacja pocztowa otworzy szkic wiadomości. Sprawdź i wyślij go w aplikacji."])}</p>}
    <div role="status" className="enquiry-status" data-result={result}>
      {result !== "idle" && tr(lang,resultText[result])}
      {draft && <a href={draft}>{tr(lang,["Reopen the email draft","Otwórz szkic ponownie"])}</a>}
    </div>
  </form>;
}
