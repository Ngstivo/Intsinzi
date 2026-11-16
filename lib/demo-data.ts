export const stages=[["New","Nowy"],["Qualified","Zakwalifikowany"],["Proposal","Oferta"],["Won","Wygrany"]] as const;
export const initialLeads=[
  {id:1,name:"Marta Zielińska",company:"Example Company A",stage:2,value:24000,followUp:"Review proposal"},
  {id:2,name:"Tomasz Nowak",company:"Example Company B",stage:1,value:18500,followUp:"Schedule discovery"},
  {id:3,name:"Anika Weber",company:"Example Company C",stage:0,value:12000,followUp:"Send introduction"},
  {id:4,name:"Piotr Kowalski",company:"Example Company D",stage:3,value:30000,followUp:""},
];
export const appointmentTypes=[["Consultation","Konsultacja"],["Project review","Przegląd projektu"],["Intro call","Rozmowa wstępna"]] as const;
export const timeSlots=["09:00","10:00","11:30","13:00","14:30","16:00"];
export const initialAppointments=[
  {id:1,day:13,time:"09:00",name:"Marta Zielińska",type:0},
  {id:2,day:13,time:"14:30",name:"Adam Krawiec",type:1},
  {id:3,day:16,time:"10:00",name:"Anika Weber",type:2},
  {id:4,day:21,time:"11:30",name:"Tomasz Nowak",type:0},
];
export const initialProducts=[
  {id:1,sku:"ACC-014",name:["USB-C Dock","Stacja dokująca USB-C"] as const,stock:48,reorder:12},
  {id:2,sku:"ACC-027",name:["Monitor Arm","Uchwyt do monitora"] as const,stock:7,reorder:10},
  {id:3,sku:"CAB-110",name:["Display Cable","Przewód do monitora"] as const,stock:112,reorder:25},
  {id:4,sku:"ACC-091",name:["Wireless Keyboard","Klawiatura bezprzewodowa"] as const,stock:4,reorder:8},
];
export const articles=[
  {title:["Returns policy","Zasady zwrotów"],body:["Unused sample orders can be returned within 30 days. Ask for an order number and preferred resolution.","Nieużywane produkty można zwrócić w ciągu 30 dni. Poproś o numer zamówienia i preferowane rozwiązanie."],keywords:/return|refund|zwrot|odda|money/i},
  {title:["Delivery windows","Terminy dostaw"],body:["Standard delivery takes 2–4 business days. Ask for the tracking reference if the package is overdue.","Standardowa dostawa trwa 2–4 dni robocze. Poproś o numer śledzenia, jeśli przesyłka jest opóźniona."],keywords:/delivery|ship|track|dostaw|przesył/i},
  {title:["Account access","Dostęp do konta"],body:["Use the password reset link on the sign-in page. A support agent can review cases where the reset email fails.","Skorzystaj z linku resetowania hasła na stronie logowania. Pracownik wsparcia może sprawdzić przypadki, gdy e-mail nie dociera."],keywords:/account|login|password|konto|hasł/i},
] as const;
