"use client";
import { useState, type FormEvent } from "react";
import { tr, type Lang } from "../lib/content";
import { initialProducts } from "../lib/demo-data";
import { Bars, Stats, Table, Tabs } from "./demo-ui";

type Product={id:number;sku:string;name:readonly [string,string];stock:number;reorder:number};
type Movement={id:number;sku:string;change:number};
export function StockPilot({lang}:{lang:Lang}) {
  const [products,setProducts]=useState<Product[]>(initialProducts);
  const [movements,setMovements]=useState<Movement[]>([{id:1,sku:"CAB-110",change:24},{id:2,sku:"ACC-027",change:-3}]);
  const [edit,setEdit]=useState<Product|null>(null);
  const [status,setStatus]=useState("");
  const msg=(en:string,pl:string)=>tr(lang,[en,pl]);
  const low=products.filter(p=>p.stock<=p.reorder);
  const columns=["SKU",msg("Product","Produkt"),msg("In stock","Stan magazynowy"),msg("Reorder point","Próg zamówienia")];
  const rows=(list:Product[],editable=false)=>list.map(p=>({id:p.id,cells:[p.sku,tr(lang,p.name),p.stock,p.reorder,...(editable?[<button className="button secondary" key="edit" onClick={()=>{setEdit(p);setStatus("");}}>{msg("Edit","Edytuj")}</button>]:[])]}));
  function save(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget;
    const d=new FormData(form);
    const sku=String(d.get("sku")).trim().toUpperCase(),name=String(d.get("name")).trim();
    if(!sku||!name) return;
    if(products.some(p=>p.sku===sku&&p.id!==edit?.id)) {
      setStatus(msg("This SKU already exists.","Ten kod SKU już istnieje."));
      return;
    }
    const reorder=Number(d.get("reorder"));
    if(edit) {
      setProducts(list=>list.map(p=>p.id===edit.id?{...p,sku,name:name===tr(lang,p.name)?p.name:[name,name],reorder}:p));
      setMovements(list=>list.map(m=>m.sku===edit.sku?{...m,sku}:m));
    } else {
      setProducts(list=>[...list,{id:Math.max(0,...list.map(p=>p.id))+1,sku,name:[name,name],stock:0,reorder}]);
    }
    setEdit(null);
    form.reset();
    setStatus(msg("Sample product saved.","Zapisano przykładowy produkt."));
  }
  function move(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const p=products.find(item=>item.id===Number(data.get("product")));
    const change=Number(data.get("change"));
    if(!p||!change||p.stock+change<0) {
      setStatus(msg("Enter a nonzero movement that keeps stock at zero or above.","Podaj niezerowy ruch, po którym stan magazynowy będzie wynosił co najmniej zero."));
      return;
    }
    setProducts(list=>list.map(item=>item.id===p.id?{...item,stock:item.stock+change}:item));
    setMovements(list=>[{id:Math.max(0,...list.map(m=>m.id))+1,sku:p.sku,change},...list]);
    e.currentTarget.reset();
    setStatus(msg("Stock movement recorded.","Zarejestrowano ruch magazynowy."));
  }
  return <Tabs lang={lang} items={[["Overview","Przegląd"],["Products","Produkty"],["Movements","Ruchy"],["Reports","Raporty"]]}>{tab=><>
    <div className="demo-status" role="status">{status}</div>
    {tab===0&&<><h2>{msg("Inventory overview","Przegląd magazynu")}</h2><Stats items={[{label:msg("Products","Produkty"),value:products.length},{label:msg("Units in stock","Sztuki w magazynie"),value:products.reduce((n,p)=>n+p.stock,0)},{label:msg("Low-stock alerts","Ostrzeżenia o brakach"),value:low.length}]}/><h3>{msg("At or below reorder point","Na poziomie progu zamówienia lub poniżej")}</h3><Table columns={columns} rows={rows(low)} empty={msg("All products are above their reorder points.","Wszystkie produkty powyżej progu zamówienia.")}/></>}
    {tab===1&&<><h2>{msg("Manage products","Zarządzaj produktami")}</h2><form className="demo-form" key={edit?.id??"new"} onSubmit={save}>
      <label>SKU<input name="sku" defaultValue={edit?.sku} required maxLength={24}/></label>
      <label>{msg("Product name","Nazwa produktu")}<input name="name" defaultValue={edit?tr(lang,edit.name):""} required maxLength={60}/></label>
      <label>{msg("Reorder point","Próg zamówienia")}<input name="reorder" type="number" defaultValue={edit?.reorder??0} min={0} max={100000} required/></label>
      <button className="button primary" type="submit">{edit?msg("Save product","Zapisz produkt"):msg("Add product","Dodaj produkt")}</button>
      {edit&&<button type="button" className="button secondary" onClick={()=>setEdit(null)}>{msg("Cancel edit","Anuluj edycję")}</button>}
    </form><Table columns={[...columns,msg("Action","Działanie")]} rows={rows(products,true)} empty={msg("No products.","Brak produktów.")}/></>}
    {tab===2&&<><h2>{msg("Stock movements","Ruchy magazynowe")}</h2><form className="demo-form" onSubmit={move}>
      <label>{msg("Product","Produkt")}<select name="product">{products.map(p=><option value={p.id} key={p.id}>{p.sku} · {tr(lang,p.name)}</option>)}</select></label>
      <label>{msg("Quantity change (+ in, − out)","Zmiana ilości (+ przyjęcie, − wydanie)")}<input name="change" type="number" min={-100000} max={100000} required/></label>
      <button className="button primary" type="submit">{msg("Record movement","Zapisz ruch")}</button>
    </form><Table columns={["SKU",msg("Quantity change","Zmiana ilości")]} rows={movements.map(m=>({id:m.id,cells:[m.sku,m.change>0?`+${m.change}`:m.change]}))} empty={msg("No movements.","Brak ruchów.")}/></>}
    {tab===3&&<><h2>{msg("Inventory report","Raport magazynowy")}</h2><Bars items={products.map(p=>({name:`${tr(lang,p.name)} · ${p.sku}`,value:p.stock}))}/></>}
  </>}</Tabs>;
}
