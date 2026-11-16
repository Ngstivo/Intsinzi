import type { Lang } from "./localization";
export { tr, type Lang, type Pair } from "./localization";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const assetHref = (path: string) => basePath + path;
export const pageHref = (lang: Lang, page = "") => `${basePath}/${lang}/${page ? page + "/" : ""}`;
export const email = "nsteveintsinzi@gmail.com";
export const pages = [
  { id: "services", label: ["Services", "Usługi"] },
  { id: "work", label: ["Work", "Realizacje"] },
  { id: "about", label: ["About", "O studiu"] },
  { id: "pricing", label: ["Pricing", "Cennik"] },
  { id: "contact", label: ["Contact", "Kontakt"] },
] as const;
export const services = [
  { name: ["Custom Web Applications", "Dedykowane aplikacje webowe"], detail: ["Replace manual work with a browser-based tool built around your team's workflow. Typical projects include internal portals, reporting dashboards and customer-facing tools.", "Zastąp ręczną pracę aplikacją dopasowaną do procesów zespołu. Typowe projekty to portale wewnętrzne, panele raportowe i narzędzia dla klientów."], icon: "web" },
  { name: ["SaaS MVP Development", "Budowa MVP SaaS"], detail: ["Validate a product idea with a usable first release, from onboarding and core workflows to plans for billing and future iterations.", "Zweryfikuj pomysł na produkt dzięki pierwszej działającej wersji, od wdrożenia użytkowników po główne procesy, płatności i plan dalszego rozwoju."], icon: "saas" },
  { name: ["CRM and Business Management", "CRM i zarządzanie firmą"], detail: ["Bring contacts, sales stages and follow-up tasks into one shared workspace. Define roles and reports around the decisions your team makes every day.", "Połącz kontakty, etapy sprzedaży i zadania w jednym miejscu. Dopasuj role i raporty do codziennych decyzji zespołu."], icon: "crm" },
  { name: ["Booking and Reservation Systems", "Systemy rezerwacji"], detail: ["Let customers see availability and book a time online. Give your team a calendar for managing appointments, schedules and changes.", "Pozwól klientom sprawdzać dostępność i rezerwować terminy online. Zarządzaj wizytami, grafikami i zmianami we wspólnym kalendarzu."], icon: "booking" },
  { name: ["AI Integrations and Automation", "Integracje AI i automatyzacja"], detail: ["Use AI for document triage, knowledge search or support drafts. Define what the system can access and where a person reviews the result.", "Wykorzystaj AI do klasyfikacji dokumentów, wyszukiwania wiedzy i tworzenia szkiców odpowiedzi. Określ zakres dostępu i moment weryfikacji przez człowieka."], icon: "ai" },
  { name: ["API Integrations", "Integracje API"], detail: ["Connect systems such as payments, ecommerce and accounting. Plan reliable synchronization, error handling and operational visibility.", "Połącz systemy płatności, handlu i księgowości. Zadbaj o niezawodną synchronizację, obsługę błędów i monitoring."], icon: "api" },
  { name: ["WordPress Development", "Rozwój WordPress"], detail: ["Launch an editable website with tailored layouts and content types, or improve an existing installation's speed and publishing workflow.", "Uruchom samodzielnie edytowaną stronę z dopasowanymi układami i typami treści lub usprawnij szybkość i publikowanie w istniejącej witrynie."], icon: "wp" },
] as const;
export const projects = [
  { id: "clientflow", name: "ClientFlow CRM", type: ["Sales operations", "Procesy sprzedaży"], detail: ["Manage leads, customers and follow-ups in one sales workspace.", "Zarządzaj leadami, klientami i zadaniami w jednym panelu sprzedaży."], accent: "#9b88ff" },
  { id: "bookease", name: "BookEase", type: ["Scheduling", "Rezerwacje"], detail: ["Find open slots, book appointments and manage the calendar.", "Sprawdzaj wolne terminy, rezerwuj wizyty i zarządzaj kalendarzem."], accent: "#6a9eff" },
  { id: "stockpilot", name: "StockPilot", type: ["Inventory", "Magazyn"], detail: ["Track inventory, record movements and spot low stock.", "Kontroluj zapasy, rejestruj ruchy i wykrywaj braki."], accent: "#4fd4ba" },
  { id: "ai-desk", name: "AI Desk", type: ["Support automation", "Automatyzacja wsparcia"], detail: ["Explore support drafts, document review and knowledge retrieval.", "Sprawdź szkice odpowiedzi, przegląd dokumentów i wyszukiwanie wiedzy."], accent: "#ea99f1" },
] as const;
export type Project = typeof projects[number];
export const principles = [
  ["Direct communication with the developer", "Bezpośredni kontakt z programistą"],
  ["Clear scope and transparent milestones", "Jasny zakres i przejrzyste etapy"],
  ["Modern tools and practical AI integration", "Nowoczesne narzędzia i praktyczne integracje AI"],
  ["Ownership of the code and handover documentation", "Własność kodu i dokumentacja przekazania"],
] as const;
export const developmentSteps = [
  {title:["Discover", "Rozpoznanie"], text:["Clarify the problem, users and outcomes.", "Ustalamy problem, użytkowników i oczekiwane rezultaty."]},
  {title:["Define", "Planowanie"], text:["Agree on scope, milestones and acceptance criteria.", "Uzgadniamy zakres, etapy i kryteria odbioru."]},
  {title:["Build", "Budowa"], text:["Review working increments and refine with feedback.", "Przeglądamy działające wersje i wprowadzamy poprawki."]},
  {title:["Launch", "Wdrożenie"], text:["Verify the release and hand over code and documentation.", "Sprawdzamy wdrożenie i przekazujemy kod oraz dokumentację."]},
] as const;
