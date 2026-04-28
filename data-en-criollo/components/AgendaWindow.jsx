"use client";
import { useState } from "react";

const MN    = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
const DS    = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];
const AVAIL = [3,7,8,12,14,15,19,21,22,26,28];
const HORAS = ["10:00","11:00","14:00","15:00","16:00","17:00"];

export default function AgendaWindow() {
  const [cm, setCm] = useState(new Date().getMonth());
  const [cy, setCy] = useState(new Date().getFullYear());
  const [sd, setSd] = useState(null);
  const [sh, setSh] = useState(null);
  const [mail, setMail] = useState("");
  const [agendado, setAgendado] = useState(false);

  const offset    = (new Date(cy, cm, 1).getDay() + 6) % 7;
  const totalDias = new Date(cy, cm + 1, 0).getDate();
  const celdas    = [...Array(offset).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)];

  function prevMes() { if (cm === 0) { setCm(11); setCy(y => y-1); } else setCm(m => m-1); setSd(null); setSh(null); setAgendado(false); }
  function nextMes() { if (cm === 11) { setCm(0); setCy(y => y+1); } else setCm(m => m+1); setSd(null); setSh(null); setAgendado(false); }
  function confirmar() { setAgendado(true); }

  return (
    <div className="panel-body">
      {/* CALENDARIO */}
      <div style={{flexShrink:0}}>
        <div className="sec-lbl">DISPONIBILIDAD</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <button className="key" style={{padding:"1px 8px",fontSize:10}} onClick={prevMes}>◂</button>
          <span style={{fontSize:10,fontWeight:500,color:"var(--tinta)",letterSpacing:"0.06em"}}>{MN[cm]} {cy}</span>
          <button className="key" style={{padding:"1px 8px",fontSize:10}} onClick={nextMes}>▸</button>
        </div>
        <div className="cal-grid">
          {DS.map(d => <div key={d} className="cal-dh">{d}</div>)}
          {celdas.map((d, i) => {
            if (!d) return <div key={i} className="cal-d"/>;
            const av  = AVAIL.includes(d);
            const sel = sd === d;
            return (
              <div
                key={i}
                className={`cal-d ${av ? "av" : ""} ${sel ? "sel" : ""}`}
                onClick={() => { if (!av) return; setSd(d); setSh(null); setAgendado(false); }}>
                {d}
                {av && !sel && <div className="cal-dot"/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* HORARIOS */}
      {sd && (
        <div style={{flexShrink:0}}>
          <div className="sec-lbl">HORARIOS · {sd} DE {MN[cm]}</div>
          <div className="t-grid">
            {HORAS.map(h => (
              <div
                key={h}
                className={`tslot ${sh === h ? "sel" : ""}`}
                onClick={() => { setSh(h); setAgendado(false); }}>
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONFIRMAR */}
      {sd && sh && !agendado && (
        <div style={{display:"flex",flexDirection:"column",gap:3,flexShrink:0}}>
          <div style={{border:"1.5px solid var(--tinta)",padding:"3px 7px",fontSize:9,color:"var(--tinta)",background:"var(--papel2)",borderRadius:2}}>
            {DS[(new Date(cy, cm, sd).getDay() + 6) % 7]} {sd} de {MN[cm]} · {sh} hs
          </div>
          <div className="key key-dark" style={{width:"100%",justifyContent:"center",fontSize:9,letterSpacing:"0.18em",padding:5,display:"flex"}} onClick={confirmar}>
            CONFIRMAR LLAMADA
          </div>
        </div>
      )}

      {/* CONFIRMADO */}
      {agendado && (
        <div style={{border:"2px solid var(--tinta)",padding:6,textAlign:"center",background:"var(--tinta)",borderRadius:2,flexShrink:0}}>
          <div style={{fontSize:9,color:"var(--papel)",letterSpacing:"0.1em",fontWeight:500}}>✓ LLAMADA AGENDADA</div>
          <div style={{fontSize:8,color:"rgba(232,223,200,0.6)",marginTop:2}}>
            {mail ? `Confirmación a ${mail}.` : "Revisá tu casilla."} Sino: spam.
          </div>
        </div>
      )}

      {/* MAIL */}
      <div style={{borderTop:"1.5px solid rgba(0,0,0,0.1)",paddingTop:4,flexShrink:0}}>
        <div className="sec-lbl">MAIL PARA CONFIRMAR</div>
        <div style={{display:"flex"}}>
          <input
            className="mail-inp"
            placeholder="tu@mail.com"
            type="email"
            value={mail}
            onChange={e => setMail(e.target.value)}
          />
          <div className="key key-mos" style={{borderRadius:"0 3px 3px 0",padding:"4px 10px"}} onClick={() => { if (sd && sh) confirmar(); }}>
            AGENDAME
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{borderTop:"1.5px solid rgba(0,0,0,0.08)",paddingTop:4,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,marginTop:"auto"}}>
        <div style={{fontSize:7,color:"var(--tinta)",opacity:0.55,lineHeight:1.6}}>
          <strong>Data en Criollo™</strong> · Análisis LATAM · © 2026
        </div>
        <div style={{display:"flex",gap:4}}>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="key key-red" style={{padding:"2px 8px",fontSize:8}}>YT</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="key" style={{padding:"2px 8px",fontSize:8,background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)",color:"#fff",borderColor:"#8B0050",boxShadow:"0 2px 0 #600035"}}>IG</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="key" style={{padding:"2px 8px",fontSize:8,background:"linear-gradient(to bottom,#5599DD,#0077B5,#004F7C)",color:"#fff",borderColor:"#003355",boxShadow:"0 2px 0 #002244"}}>IN</a>
        </div>
      </div>
    </div>
  );
}
