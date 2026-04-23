"use client";

import { useState } from "react";

const GF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}`;

const C = {
  papel:   "#E9E4D8",
  papelOsc:"#DDD8CB",
  tinta:   "#1A1A18",
  tintaMed:"#3D3D38",
  tintaSua:"#888880",
  rojo:    "#C0392B",
  amarillo:"#E8B84B",
};

function Noise() {
  return (
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feBlend in="SourceGraphic" mode="multiply"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill={C.papel} filter="url(#gr)" opacity="0.07"/>
    </svg>
  );
}

function Wordmark({ scale=0.52 }) {
  return (
    <svg width={320*scale} height={90*scale} viewBox="0 0 320 90" style={{display:"block"}}>
      <text x="16" y="66" fontFamily="'Playfair Display',serif" fontWeight="900" fontSize="50" fill={C.tinta}>DATA</text>
      <rect x="165" y="28" width="1.5" height="38" fill={C.rojo}/>
      <text x="172" y="66" fontFamily="'Playfair Display',serif" fontWeight="400" fontSize="42" fill={C.tinta} fontStyle="italic">en Criollo</text>
      <rect x="0" y="76" width="28" height="3" fill={C.rojo}/>
      <rect x="28" y="76" width="292" height="3" fill={C.tinta}/>
    </svg>
  );
}

function Calendario() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [sel, setSel] = useState(null);
  const [hora, setHora] = useState(null);
  const [enviado, setEnviado] = useState(false);

  const disponibles = [3,7,8,12,14,15,19,21,22,26,28];
  const horas = ["10:00","11:00","14:00","15:00","16:00","17:00"];
  const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const DS = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];

  const offset = (() => { const d = new Date(anio,mes,1).getDay(); return d===0?6:d-1; })();
  const total = new Date(anio,mes+1,0).getDate();
  const celdas = [...Array(offset).fill(null), ...Array.from({length:total},(_,i)=>i+1)];
  while(celdas.length%7!==0) celdas.push(null);

  const pMes = () => { if(mes===0){setMes(11);setAnio(a=>a-1);}else setMes(m=>m-1); setSel(null);setHora(null); };
  const nMes = () => { if(mes===11){setMes(0);setAnio(a=>a+1);}else setMes(m=>m+1); setSel(null);setHora(null); };

  const mono = {fontFamily:"'DM Mono',monospace"};
  const serif = {fontFamily:"'Playfair Display',serif"};

  if(enviado) return (
    <div style={{padding:"24px 0",textAlign:"center"}}>
      <div style={{...serif,fontWeight:900,fontSize:26,color:C.tinta,marginBottom:8}}>Anotado.</div>
      <div style={{fontFamily:"'Source Serif 4',serif",fontStyle:"italic",fontSize:13,color:C.tintaMed,lineHeight:1.6}}>
        Te llega un mail con el link.<br/>Si no aparece, revisá spam. Como siempre.
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <button onClick={pMes} style={{...mono,background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.tinta,padding:"4px 8px"}}>←</button>
        <div style={{...serif,fontWeight:700,fontSize:15,color:C.tinta}}>{MESES[mes]} {anio}</div>
        <button onClick={nMes} style={{...mono,background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.tinta,padding:"4px 8px"}}>→</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
        {DS.map(d=><div key={d} style={{...mono,fontSize:8,color:C.tintaSua,textAlign:"center",letterSpacing:"0.1em",paddingBottom:6}}>{d}</div>)}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {celdas.map((d,i)=>{
          if(!d) return <div key={i}/>;
          const disp = disponibles.includes(d);
          const pasado = d<hoy.getDate()&&mes===hoy.getMonth()&&anio===hoy.getFullYear();
          const activo = disp&&!pasado;
          const elegido = sel===d;
          return (
            <button key={i} onClick={()=>{if(activo){setSel(d);setHora(null);}}}
              style={{
                ...mono, fontSize:11, padding:"7px 0",
                background: elegido ? C.tinta : "transparent",
                border: activo ? `1.5px solid ${elegido?C.tinta:C.tinta+"55"}` : "1.5px solid transparent",
                color: elegido ? C.papel : pasado ? C.tintaSua+"55" : C.tinta,
                cursor: activo?"pointer":"default",
                position:"relative",
              }}>
              {d}
              {activo&&!elegido&&<div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",width:3,height:3,borderRadius:"50%",background:C.rojo}}/>}
            </button>
          );
        })}
      </div>

      {sel && (
        <div style={{marginTop:16,borderTop:`1px solid ${C.tinta}22`,paddingTop:14}}>
          <div style={{...mono,fontSize:8,color:C.tintaSua,letterSpacing:"0.2em",marginBottom:10}}>HORARIOS</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
            {horas.map(h=>(
              <button key={h} onClick={()=>setHora(h)} style={{
                ...mono, fontSize:10, padding:"7px 0",
                background: hora===h ? C.tinta : "transparent",
                border:`1.5px solid ${C.tinta}`,
                color: hora===h ? C.papel : C.tinta,
                cursor:"pointer", letterSpacing:"0.05em",
              }}>{h}</button>
            ))}
          </div>
        </div>
      )}

      {sel&&hora&&(
        <div style={{marginTop:14}}>
          <div style={{
            background:C.papelOsc, border:`1px solid ${C.tinta}22`,
            padding:"8px 12px", marginBottom:10,
            fontFamily:"'Source Serif 4',serif", fontStyle:"italic",
            fontSize:12, color:C.tintaMed,
          }}>
            {DS[(new Date(anio,mes,sel).getDay()+6)%7]} {sel} de {MESES[mes]} · {hora} hs
          </div>
          <button onClick={()=>setEnviado(true)} style={{
            ...mono, width:"100%", background:C.rojo,
            border:"none", color:"#fff",
            fontSize:10, letterSpacing:"0.2em",
            padding:"11px 0", cursor:"pointer",
          }}>CONFIRMAR LLAMADA</button>
        </div>
      )}
    </div>
  );
}

function Newsletter() {
  const [mail, setMail] = useState("");
  const [ok, setOk] = useState(false);
  const mono = {fontFamily:"'DM Mono',monospace"};
  const serif = {fontFamily:"'Playfair Display',serif"};

  if(ok) return (
    <div style={{paddingTop:4}}>
      <div style={{...serif,fontWeight:700,fontStyle:"italic",fontSize:20,color:C.tinta,marginBottom:8}}>Bien jugado.</div>
      <div style={{fontFamily:"'Source Serif 4',serif",fontStyle:"italic",fontSize:12,color:C.tintaMed,lineHeight:1.6}}>
        Cada semana un dato que no sabías que necesitabas saber.
      </div>
    </div>
  );

  return (
    <div>
      <div style={{...mono,fontSize:8,color:C.tintaSua,letterSpacing:"0.22em",marginBottom:12}}>NEWSLETTER SEMANAL</div>
      <div style={{...serif,fontWeight:700,fontSize:17,color:C.tinta,marginBottom:4,lineHeight:1.2}}>Un dato por semana.</div>
      <div style={{fontFamily:"'Source Serif 4',serif",fontStyle:"italic",fontSize:12,color:C.tintaMed,marginBottom:16,lineHeight:1.55}}>
        Sin relleno. Sin curso que vender.<br/>Solo el número que te hace pensar.
      </div>
      <input value={mail} onChange={e=>setMail(e.target.value)}
        placeholder="tu@mail.com"
        style={{
          ...mono, width:"100%",
          border:`2px solid ${C.tinta}`,
          background:"transparent", padding:"9px 12px",
          fontSize:11, color:C.tinta,
          outline:"none", marginBottom:8, borderRadius:0,
        }}/>
      <button onClick={()=>mail&&setOk(true)} style={{
        ...mono, width:"100%",
        background:C.tinta, border:"none",
        color:C.papel, fontSize:10,
        letterSpacing:"0.2em", padding:"11px 0", cursor:"pointer",
      }}>ANOTAME</button>
    </div>
  );
}

const CARR = [
  { num:"01", label:"EL SÍNTOMA", h1:"Decisiones de $10.000", h2:"con datos de ████.", body:"Toda pyme tiene información. El problema es que vive en la cabeza del dueño.", bg:C.tinta, fg:C.papel, ac:C.rojo },
  { num:"02", label:"EL PROBLEMA", h1:"El 80% de los emprendedores", h2:"fija precios a ojo.", body:"No porque sean irresponsables. Porque nadie les enseñó a leer sus propios números.", bg:C.papel, fg:C.tinta, ac:C.amarillo },
  { num:"03", label:"LA HERRAMIENTA", h1:"Excel no es el problema.", h2:"El problema es la pregunta.", body:"Con la pregunta correcta, una planilla vale más que un dashboard de $500/mes.", bg:C.papelOsc, fg:C.tinta, ac:C.rojo },
  { num:"04", label:"LA PROMESA", h1:"Conceptos de analista.", h2:"En criollo.", body:"Sin fórmulas vacías. Sin jerga de consultora. Solo el dato que te sirve hoy.", bg:C.rojo, fg:C.papel, ac:C.papel },
];

function CarruselIlustrativo() {
  const [cur, setCur] = useState(0);
  const s = CARR[cur];
  return (
    <div>
      <div style={{
        background:s.bg, border:`2px solid ${C.tinta}`,
        padding:"32px 28px 28px",
        position:"relative", overflow:"hidden",
        minHeight:230, transition:"background 0.25s",
      }}>
        {/* Número fantasma */}
        <div style={{
          position:"absolute", bottom:-28, right:8,
          fontFamily:"'Playfair Display',serif",
          fontWeight:900, fontSize:190, lineHeight:1,
          color:s.fg, opacity:0.06, userSelect:"none",
          letterSpacing:"-0.05em",
        }}>{s.num}</div>

        <div style={{position:"relative",zIndex:1}}>
          <div style={{
            display:"inline-block",
            border:`1.5px solid ${s.ac}`,
            padding:"2px 10px",
            fontFamily:"'DM Mono',monospace",
            fontSize:8, letterSpacing:"0.22em",
            color:s.ac, marginBottom:18,
          }}>{s.label}</div>

          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:28,lineHeight:1.05,letterSpacing:"-0.02em",color:s.fg,marginBottom:4}}>
            {s.h1}
          </div>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:400,fontStyle:"italic",fontSize:23,lineHeight:1.1,color:s.ac,marginBottom:16}}>
            {s.h2}
          </div>
          <div style={{width:36,height:2,background:s.ac,marginBottom:14}}/>
          <p style={{fontFamily:"'Source Serif 4',serif",fontStyle:"italic",fontSize:12.5,lineHeight:1.65,color:s.fg,opacity:0.75}}>
            {s.body}
          </p>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
        <button onClick={()=>setCur(c=>Math.max(0,c-1))}
          style={{background:"none",border:`1.5px solid ${C.tinta}44`,color:C.tinta,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.1em",padding:"5px 12px",cursor:"pointer",opacity:cur===0?0.3:1}}>
          ← PREV
        </button>
        <div style={{display:"flex",gap:6}}>
          {CARR.map((_,i)=>(
            <button key={i} onClick={()=>setCur(i)} style={{
              width:i===cur?20:6,height:6,
              background:i===cur?C.rojo:`${C.tinta}44`,
              border:"none",cursor:"pointer",
              transition:"width 0.2s",padding:0,
            }}/>
          ))}
        </div>
        <button onClick={()=>setCur(c=>Math.min(CARR.length-1,c+1))}
          style={{background:"none",border:`1.5px solid ${C.tinta}44`,color:C.tinta,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.1em",padding:"5px 12px",cursor:"pointer",opacity:cur===CARR.length-1?0.3:1}}>
          NEXT →
        </button>
      </div>
    </div>
  );
}

function Stats() {
  const items=[{l:"EPISODIOS",v:"48"},{l:"PAÍSES",v:"12"},{l:"COMUNIDAD",v:"14K"}];
  return (
    <div style={{borderTop:`1.5px solid ${C.tinta}22`,paddingTop:20,marginTop:22}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:C.tintaSua,letterSpacing:"0.22em",marginBottom:14}}>EN NÚMEROS</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {items.map(it=>(
          <div key={it.l} style={{borderLeft:`2px solid ${C.tinta}`,paddingLeft:10}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:28,color:C.tinta,lineHeight:1}}>{it.v}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:C.tintaSua,letterSpacing:"0.15em",marginTop:3}}>{it.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const [rev, setRev] = useState(false);

  return (
    <div style={{background:C.papel,minHeight:"100vh",position:"relative",overflow:"hidden"}}>
      <style>{GF}</style>
      <Noise/>

      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"0 28px"}}>

        {/* MASTHEAD */}
        <div style={{paddingTop:24}}>
          <div style={{height:3,background:C.tinta,marginBottom:2}}/>
          <div style={{height:1,background:C.tinta,opacity:0.35,marginBottom:14}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <Wordmark/>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:C.tintaSua,letterSpacing:"0.15em",textAlign:"right",lineHeight:2}}>
              VOL. 1 · EP. 48<br/>
              {new Date().toLocaleDateString("es-AR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}).toUpperCase()}
            </div>
          </div>
          <div style={{height:1,background:C.tinta,opacity:0.12}}/>
        </div>

        {/* HERO */}
        <div style={{paddingTop:60,paddingBottom:56,position:"relative"}}>
          <div style={{
            position:"absolute",top:-10,right:-10,
            fontFamily:"'Playfair Display',serif",
            fontWeight:900,fontSize:320,lineHeight:1,
            color:C.tinta,opacity:0.04,
            userSelect:"none",letterSpacing:"-0.05em",zIndex:0,
          }}>48</div>

          <div style={{position:"relative",zIndex:1,maxWidth:700}}>
            <div style={{
              display:"inline-block",
              border:`1.5px solid ${C.tinta}`,
              padding:"3px 12px",
              fontFamily:"'DM Mono',monospace",
              fontSize:8,letterSpacing:"0.25em",
              color:C.tinta,marginBottom:28,
            }}>DIAGNÓSTICO · ANÁLISIS DE DATOS PARA PYMES LATAM</div>

            <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(38px,6vw,76px)",lineHeight:1.0,letterSpacing:"-0.03em",color:C.tinta,marginBottom:8}}>
              Síntoma:
            </h1>

            <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(32px,5.5vw,70px)",lineHeight:1.0,letterSpacing:"-0.03em",color:C.tinta,marginBottom:8,display:"flex",alignItems:"baseline",gap:14,flexWrap:"wrap"}}>
              tomás decisiones de&nbsp;
              <span style={{fontFamily:"'DM Mono',monospace",fontWeight:500,background:C.amarillo,padding:"0 8px",fontSize:"clamp(26px,4vw,54px)",letterSpacing:"0.02em"}}>$$$</span>
            </h1>

            <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:400,fontStyle:"italic",fontSize:"clamp(28px,4.8vw,64px)",lineHeight:1.05,letterSpacing:"-0.02em",color:C.tintaMed,marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              con información de&nbsp;
              <span
                onMouseEnter={()=>setRev(true)}
                onMouseLeave={()=>setRev(false)}
                style={{
                  display:"inline-block",
                  background: rev ? "transparent" : C.tinta,
                  color: rev ? C.rojo : C.tinta,
                  padding:"0 10px",
                  fontFamily: rev ? "'Playfair Display',serif" : "'DM Mono',monospace",
                  fontWeight: rev ? 700 : 400,
                  fontStyle: rev ? "italic" : "normal",
                  fontSize: rev ? "clamp(28px,4.8vw,64px)" : "clamp(20px,3vw,42px)",
                  letterSpacing: rev ? "-0.02em" : "0.04em",
                  cursor:"pointer",
                  transition:"all 0.18s",
                  userSelect:"none",
                  border: rev ? `2px solid ${C.rojo}` : "none",
                }}>
                {rev ? "lo que se te ocurre" : "████████████"}
              </span>.
            </h1>

            {!rev && (
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:C.tintaSua,letterSpacing:"0.15em",marginBottom:20}}>
                ↑ PASÁ EL MOUSE ENCIMA PARA EL DIAGNÓSTICO COMPLETO
              </div>
            )}

            <div style={{width:56,height:3,background:C.rojo,marginTop:rev?16:4,marginBottom:22,transition:"margin 0.2s"}}/>

            <p style={{fontFamily:"'Source Serif 4',serif",fontStyle:"italic",fontSize:16,lineHeight:1.75,color:C.tintaMed,maxWidth:540}}>
              Data en Criollo aterra conceptos de analista para emprendedores latinoamericanos. Sin maestría. Sin consultora. Sin que te traten de idiota.
            </p>
          </div>
        </div>

        {/* REGLA */}
        <div style={{height:1,background:C.tinta,opacity:0.13,marginBottom:52}}/>

        {/* CUERPO 2 COLUMNAS */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:44,marginBottom:52,alignItems:"start"}}>

          {/* IZQ */}
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:C.tintaSua,letterSpacing:"0.22em",marginBottom:16}}>DE QUÉ VA ESTO</div>
            <CarruselIlustrativo/>
            <Stats/>
          </div>

          {/* DER */}
          <div>
            <div style={{border:`2px solid ${C.tinta}`,padding:"24px 22px",marginBottom:22,background:C.papel,position:"relative"}}>
              <div style={{position:"absolute",top:0,right:0,width:0,height:0,borderStyle:"solid",borderWidth:"0 30px 30px 0",borderColor:`transparent ${C.rojo} transparent transparent`}}/>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:C.tintaSua,letterSpacing:"0.22em",marginBottom:14}}>AGENDÁ UNA LLAMADA</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:C.tinta,marginBottom:4}}>30 minutos.</div>
              <div style={{fontFamily:"'Source Serif 4',serif",fontStyle:"italic",fontSize:12,color:C.tintaMed,marginBottom:20,lineHeight:1.5}}>
                Analizamos tus números juntos. Sin venderte nada. Solo para ver si el canal te sirve.
              </div>
              <Calendario/>
            </div>

            <div style={{border:`2px solid ${C.tinta}`,padding:"24px 22px",background:C.papelOsc}}>
              <Newsletter/>
            </div>
          </div>
        </div>

        {/* REGLA */}
        <div style={{height:1,background:C.tinta,opacity:0.13,marginBottom:40}}/>

        {/* CIERRE */}
        <div style={{textAlign:"center",paddingBottom:52}}>
          <p style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(16px,2.8vw,30px)",lineHeight:1.4,color:C.tintaMed,maxWidth:560,margin:"0 auto 18px"}}>
            "El dato no miente.<br/>Pero hay que saber leerlo."
          </p>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:C.tintaSua,letterSpacing:"0.2em",display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <span>@dataencriollo</span>
            <span style={{color:C.rojo}}>|</span>
            <span>YOUTUBE</span>
            <span style={{color:C.rojo}}>|</span>
            <span>INSTAGRAM</span>
            <span style={{color:C.rojo}}>|</span>
            <span>TIKTOK</span>
          </div>
        </div>

        {/* FOOTER RULES */}
        <div style={{height:1,background:C.tinta,opacity:0.2,marginBottom:2}}/>
        <div style={{height:3,background:C.tinta,marginBottom:24}}/>
      </div>
    </div>
  );
}
