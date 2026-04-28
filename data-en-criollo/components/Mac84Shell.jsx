"use client";
import { useState, useEffect, useRef } from "react";

const CSS = `
  .os { background-image: repeating-conic-gradient(#aaa 0% 25%, #ccc 0% 50%); background-size: 4px 4px; font-family: 'DM Mono', monospace; user-select: none; position: relative; }
  .mb { background: #fff; border-bottom: 2px solid #000; height: 22px; display: flex; align-items: center; padding: 0 6px; }
  .mb-item { padding: 0 10px; height: 22px; display: flex; align-items: center; font-size: 11px; font-weight: 500; color: #000; cursor: pointer; }
  .mb-item:hover { background: #000; color: #fff; }
  .ticker-wrap { background: #000; overflow: hidden; border-bottom: 2px solid #000; height: 18px; display: flex; align-items: center; }
  .ticker-inner { white-space: nowrap; font-size: 8px; color: #fff; letter-spacing: 0.18em; padding: 0 12px; will-change: transform; }
  .wt { background: #fff; border-bottom: 2px solid #000; height: 20px; display: flex; align-items: center; padding: 0 6px; gap: 5px; position: relative; flex-shrink: 0; }
  .wt::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 4px); pointer-events: none; }
  .wt-x { width: 12px; height: 12px; border: 2px solid #000; background: #fff; cursor: pointer; flex-shrink: 0; z-index: 1; position: relative; }
  .wt-t { font-size: 11px; font-weight: 500; color: #000; flex: 1; text-align: center; z-index: 1; position: relative; letter-spacing: 0.04em; }
  .cbtn { background: #fff; border: 2px solid #000; padding: 2px 10px; font-size: 9px; font-family: 'DM Mono', monospace; font-weight: 500; cursor: pointer; color: #000; }
  .cbtn:active, .cbtn-on { background: #000; color: #fff; }
  .fi { flex-shrink: 0; width: 54px; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 4px 2px; cursor: pointer; border-right: 1px solid #000; }
  .fi-img { width: 20px; height: 18px; background: #fff; border: 1.5px solid #000; display: flex; align-items: center; justify-content: center; }
  .fi-lbl { font-size: 7px; color: #000; text-align: center; font-family: 'DM Mono', monospace; line-height: 1.1; width: 100%; }
  .fi-sel .fi-img { background: #000; }
  .fi-sel .fi-lbl { background: #000; color: #fff; }
  .cd { font-size: 8px; text-align: center; padding: 3px 0; position: relative; font-family: 'DM Mono', monospace; color: #000; cursor: default; }
  .cd-av { cursor: pointer; }
  .cd-av:hover, .cd-sel { background: #000; color: #fff; }
  .tslot { font-size: 8px; text-align: center; padding: 3px 0; border: 2px solid #000; cursor: pointer; font-family: 'DM Mono', monospace; color: #000; background: #fff; }
  .tslot:hover, .tslot-sel { background: #000; color: #fff; }
  .alink { border: 2px solid #000; padding: 2px 8px; font-size: 8px; font-family: 'DM Mono', monospace; color: #000; cursor: pointer; text-align: center; text-decoration: none; display: block; letter-spacing: 0.08em; }
  .alink:hover { background: #000; color: #fff; }
`;

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
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="os">
        <div className="mb">
          <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,borderRight:"2px solid #000",marginRight:2,cursor:"pointer"}}>&#63743;</div>
          {["File","Edit","View","Special"].map(m => (
            <div key={m} className="mb-item">{m}</div>
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:11,fontWeight:500,color:"#000",letterSpacing:"0.05em"}}>Data en Criollo</span>
            <span style={{fontSize:11,color:"#000"}}>{clock}</span>
          </div>
        </div>

        <div className="ticker-wrap">
          <div className="ticker-inner" ref={tickerRef}>
            SÍNTOMA: TOMÁS DECISIONES DE $$$ CON INFORMACIÓN DE ████████ &nbsp;·&nbsp; EP.48 — ELASTICIDAD PRECIO-DEMANDA &nbsp;·&nbsp; 14K EMPRENDEDORES YA LO SABEN &nbsp;·&nbsp; ¿VOS TODAVÍA NO? &nbsp;·&nbsp; AGENDÁ UNA LLAMADA HOY &nbsp;·&nbsp;
          </div>
        </div>

        <div style={{position:"relative"}}>
          <div style={{position:"absolute",right:6,top:28,display:"flex",flexDirection:"column",gap:8,zIndex:50}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"}}>
              <svg width="30" height="26" viewBox="0 0 30 26">
                <rect x="1" y="2" width="28" height="20" fill="#fff" stroke="#000" strokeWidth="2"/>
                <rect x="3" y="4" width="9" height="7" fill="none" stroke="#000" strokeWidth="1.5"/>
                <rect x="17" y="13" width="8" height="6" fill="#000"/>
              </svg>
              <div style={{fontSize:8,color:"#fff",textAlign:"center",fontFamily:"'DM Mono',monospace",lineHeight:1.1,textShadow:"1px 1px 0 #000",background:"rgba(0,0,0,0.45)",padding:"0 2px"}}>Data en<br/>Criollo HD</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",marginTop:6}}>
              <svg width="26" height="30" viewBox="0 0 26 30">
                <rect x="2" y="2" width="22" height="20" fill="#fff" stroke="#000" strokeWidth="2"/>
                <rect x="8" y="22" width="10" height="5" fill="none" stroke="#000" strokeWidth="2"/>
                <rect x="5" y="27" width="16" height="2" fill="#000"/>
                <line x1="6" y1="7" x2="20" y2="17" stroke="#000" strokeWidth="2"/>
                <line x1="20" y1="7" x2="6" y2="17" stroke="#000" strokeWidth="2"/>
              </svg>
              <div style={{fontSize:8,color:"#fff",textAlign:"center",fontFamily:"'DM Mono',monospace",lineHeight:1.1,textShadow:"1px 1px 0 #000",background:"rgba(0,0,0,0.45)",padding:"0 2px"}}>Trash</div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
