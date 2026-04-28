"use client";
import { useState, useEffect, useRef } from "react";
import { VHS_COLORS } from "@/data/planes";

export default function Mac84Shell({ children }) {
  const [clock, setClock] = useState("--:--");
  const tickerRef = useRef(null);
  const animRef = useRef(null);
  const tpRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setClock(
        d.getHours().toString().padStart(2, "0") + ":" +
        d.getMinutes().toString().padStart(2, "0")
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    const anim = () => {
      tpRef.current -= 0.5;
      if (tpRef.current < -el.scrollWidth / 2) tpRef.current = 0;
      el.style.transform = `translateX(${tpRef.current}px)`;
      animRef.current = requestAnimationFrame(anim);
    };
    animRef.current = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="app">
      <div className="header">
        <div className="header-top">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:18,color:"var(--papel)",letterSpacing:"-0.01em"}}>DATA</div>
            <div style={{width:2,height:20,background:"var(--terracota)"}}/>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:400,fontStyle:"italic",fontSize:15,color:"var(--papel)",opacity:0.85}}>en Criollo</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{background:"var(--papel)",color:"var(--tinta)",fontSize:8,fontWeight:500,letterSpacing:"0.15em",padding:"2px 7px",borderLeft:"3px solid var(--terracota)"}}>T-120 · DATA EN CRIOLLO</div>
            <div style={{fontSize:10,color:"var(--papel)",opacity:0.6}}>{clock}</div>
          </div>
        </div>
        <div className="vhs" style={{height:6}}>
          {VHS_COLORS.map(c => <div key={c} style={{background:c}}/>)}
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker-inner" ref={tickerRef}>
          SÍNTOMA: TOMÁS DECISIONES DE $$$ CON INFORMACIÓN DE ████████ &nbsp;·&nbsp; EP.48 — ELASTICIDAD PRECIO-DEMANDA &nbsp;·&nbsp; 14K EMPRENDEDORES YA LO SABEN &nbsp;·&nbsp; ¿VOS TODAVÍA NO? &nbsp;·&nbsp; AGENDÁ UNA LLAMADA HOY &nbsp;·&nbsp;
        </div>
      </div>

      {children}
    </div>
  );
}
