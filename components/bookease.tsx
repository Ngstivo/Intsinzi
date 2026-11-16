"use client";
import { useState, type FormEvent } from "react";
import { tr, type Lang } from "../lib/content";
import { appointmentTypes, initialAppointments, timeSlots } from "../lib/demo-data";
import { Stats, Table, Tabs } from "./demo-ui";

export function BookEase({lang}:{lang:Lang}) {
  const [bookings,setBookings]=useState(initialAppointments);
  const [day,setDay]=useState(13);
  const [status,setStatus]=useState("");
  const msg=(en:string,pl:string)=>tr(lang,[en,pl]);
  const month=new Intl.DateTimeFormat(lang==="pl"?"pl-PL":"en-GB",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(2026,7,1)));
  const fullDate=(d:number)=>new Intl.DateTimeFormat(lang==="pl"?"pl-PL":"en-GB",{day:"numeric",month:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2026,7,d)));
  const available=timeSlots.filter(t=>!bookings.some(b=>b.day===day&&b.time===t));
  const weekdays=lang==="pl"?["Pn","Wt","Śr","Cz","Pt","So","Nd"]:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  function reserve(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget;
    const data=new FormData(form);
    const name=String(data.get("name")).trim(),time=String(data.get("time"));
    if(!name||!available.includes(time)) return;
    setBookings(list=>list.some(b=>b.day===day&&b.time===time)?list:[...list,{id:Math.max(0,...list.map(b=>b.id))+1,day,time,name,type:Number(data.get("type"))}]);
    setStatus(msg("Sample appointment booked.","Zapisano przykładową wizytę."));
    form.reset();
  }
  return <Tabs lang={lang} items={[["Calendar","Kalendarz"],["Appointments","Wizyty"],["Admin overview","Panel administracyjny"]]}>{tab=><>
    <div role="status" className="demo-status">{status}</div>
    {tab===0&&<><h2>{msg("Booking calendar","Kalendarz rezerwacji")}</h2><div className="booking-grid">
      <section className="panel calendar"><h3>{month}</h3><div className="calendar-grid">{weekdays.map(d=><small key={d}>{d}</small>)}{Array.from({length:5},(_,i)=><span key={`gap-${i}`}/>)}{Array.from({length:31},(_,i)=>i+1).map(d=><button type="button" key={d} aria-pressed={d===day} aria-label={fullDate(d)} onClick={()=>{setDay(d);setStatus("");}}>{d}</button>)}</div></section>
      <section className="panel booking-form"><h3>{fullDate(day)}</h3>{available.length ? <form key={day} onSubmit={reserve}><label>{msg("Available time","Dostępna godzina")}<select name="time" required>{available.map(t=><option key={t}>{t}</option>)}</select></label><label>{msg("Appointment type","Rodzaj wizyty")}<select name="type">{appointmentTypes.map((p,i)=><option key={p[0]} value={i}>{tr(lang,p)}</option>)}</select></label><label>{msg("Sample customer name","Przykładowa nazwa klienta")}<input name="name" required maxLength={60}/></label><button className="button primary" type="submit">{msg("Reserve slot","Zarezerwuj termin")}</button></form> : <p>{msg("This date is fully booked.","Brak wolnych terminów w tym dniu.")}</p>}</section>
    </div></>}
    {tab!==0&&<><h2>{tab===1?msg("Manage appointments","Zarządzaj wizytami"):msg("Admin overview","Panel administracyjny")}</h2>{tab===2&&<Stats items={[{label:msg("Reservations","Rezerwacje"),value:bookings.length},{label:msg("Days with reservations","Dni z rezerwacjami"),value:new Set(bookings.map(b=>b.day)).size},{label:msg("Open slots this month","Wolne terminy w miesiącu"),value:31*timeSlots.length-bookings.length}]}/>}
    <Table columns={[msg("Date","Data"),msg("Time","Godzina"),msg("Customer","Klient"),msg("Type","Rodzaj"),msg("Action","Działanie")]} rows={[...bookings].sort((a,b)=>a.day-b.day||a.time.localeCompare(b.time)).map(b=>({id:b.id,cells:[fullDate(b.day),b.time,b.name,tr(lang,appointmentTypes[b.type]),<button className="button secondary" key="cancel" onClick={()=>{setBookings(list=>list.filter(x=>x.id!==b.id));setStatus(msg("Sample appointment cancelled.","Anulowano przykładową wizytę."));}}>{msg("Cancel","Anuluj")}</button>]}))} empty={msg("No reservations yet.","Brak rezerwacji.")}/></>}
  </>}</Tabs>;
}
