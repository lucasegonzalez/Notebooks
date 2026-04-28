"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { PLANES_DEF, PLANES_ITEMS } from "@/data/planes";

const MonitorCRT = forwardRef(function MonitorCRT(
  { episodio, epIdx, epTotal, onPrev, onNext, overlayOpen, curPlan, onNavPlan, onCloseOverlay, onOpenPlan },
  ref
) {
  const staticRef = useRef(null);

  useImperativeHandle(ref, () => ({
    showStatic(cb) {
      const el = staticRef.current;
      if (!el) { cb(); return; }
      const build = () => {
        el.innerHTML = "";
        el.style.display = "flex";
        for (let i = 0; i < 40 * 30; i++) {
          const px = document.createElement("div");
          const v = Math.random() > 0.5 ? 255 : 0;
          px.style.cssText = `width:2.5%;height:3.34%;background:rgb(${v},${v},${v});opacity:${(Math.random()*0.85+0.1).toFixed(2)};`;
          el.appendChild(px);
        }
      };
      build();
      setTimeout(() => {
        build();
        setTimeout(() => { el.style.display = "none"; cb(); }, 150);
      }, 150);
    },
  }));

  const ptTitle = overlayOpen
    ? `${PLANES_DEF[curPlan].emoji} ${PLANES_DEF[curPlan].nombre} — USD ${PLANES_DEF[curPlan].precio}/mes`
    : `Episodios · EP.${episodio.ch} de ${epTotal}`;

  return (
    <>
      <div className="pt">
        <div className="pt-dot"/>
        <div className="pt-txt">{ptTitle}</div>
        <div className="pt-dot"/>
      </div>

      <div className="monitor-wrap">
        <div className="monitor-outer">
          <div className="monitor-screen">
            <div className="scanlines"/>
            <div className="vignette"/>
            <div ref={staticRef} className="static-lay"/>
            <div className="slide-grad"/>

            {/* EPISODE SLIDE */}
            <div className="slide-content">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{fontSize:7,fontWeight:500,letterSpacing:"0.22em",color:"#fff",background:"var(--terracota)",padding:"2px 7px"}}>{episodio.ep}</div>
                <div style={{fontSize:8,color:"rgba(255,255,255,0.7)",background:"rgba(0,0,0,0.5)",padding:"1px 5px"}}>{episodio.tc}</div>
              </div>
              <div>
                <div
                  style={{fontFamily:"'DM Mono',monospace",fontWeight:500,textTransform:"uppercase",lineHeight:0.88,color:"#fff",letterSpacing:"-0.02em",fontSize:"clamp(16px,2.8vw,26px)",marginBottom:7}}
                  dangerouslySetInnerHTML={{ __html: episodio.title.split("\n").join("<br/>") }}
                />
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:9,fontStyle:"italic",color:"rgba(255,255,255,0.65)",lineHeight:1.5}}>{episodio.sub}</div>
              </div>
            </div>

            {/* PLANES OVERLAY */}
            {overlayOpen && (
              <div className="mon-overlay">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px 6px",borderBottom:"1px solid rgba(255,255,255,0.1)",flexShrink:0}}>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <div
                      onClick={() => onNavPlan(-1)}
                      style={{fontSize:10,color:"rgba(255,255,255,0.5)",cursor:"pointer",padding:"2px 6px",border:"1px solid rgba(255,255,255,0.15)",borderRadius:2}}>◂</div>
                    <div style={{fontSize:8,letterSpacing:"0.15em",color:"rgba(255,255,255,0.5)"}}>PLAN {curPlan + 1} / {PLANES_DEF.length}</div>
                    <div
                      onClick={() => onNavPlan(1)}
                      style={{fontSize:10,color:"rgba(255,255,255,0.5)",cursor:"pointer",padding:"2px 6px",border:"1px solid rgba(255,255,255,0.15)",borderRadius:2}}>▸</div>
                  </div>
                  <div
                    className="key"
                    style={{fontSize:7,padding:"2px 8px",background:"rgba(255,255,255,0.06)",borderColor:"rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.5)",boxShadow:"none"}}
                    onClick={onCloseOverlay}>✕ VOLVER</div>
                </div>

                <div style={{flex:1,position:"relative",overflow:"hidden"}}>
                  {PLANES_DEF.map((plan, pi) => (
                    <div
                      key={pi}
                      className={`plan-slide ${pi === curPlan ? "active" : ""}`}
                      style={{background:"#0a0a0a",padding:"10px 12px",overflowY:"auto"}}>
                      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:2}}>
                        <span style={{fontSize:16}}>{plan.emoji}</span>
                        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:16,color:"rgba(232,223,200,0.9)"}}>{plan.nombre}</span>
                        {pi === 1 && <div style={{background:"var(--terracota)",color:"#fff",fontSize:6,fontWeight:500,letterSpacing:"0.12em",padding:"1px 8px",borderRadius:2,marginLeft:6}}>MÁS ELEGIDO</div>}
                        <span style={{fontSize:9,color:"var(--mostaza)",marginLeft:"auto",fontWeight:500}}>USD {plan.precio}/mes</span>
                      </div>
                      <div style={{fontSize:8,fontFamily:"'Source Serif 4',serif",fontStyle:"italic",color:"rgba(232,223,200,0.45)",marginBottom:10}}>
                        {["Ideal para: visibilidad básica de tu negocio","Ideal para: decisiones con datos, en crecimiento","Ideal para: CFO virtual — listo para escalar"][pi]}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginBottom:12}}>
                        {PLANES_ITEMS[pi].map((item, ii) => (
                          <div key={ii} style={{display:"flex",alignItems:"flex-start",gap:3,padding:"1.5px 0",fontSize:7,fontFamily:"'DM Mono',monospace",color:item.ok?"rgba(232,223,200,0.85)":"rgba(232,223,200,0.2)"}}>
                            <span style={{color:item.ok?"#7A8C5A":"rgba(232,223,200,0.15)",flexShrink:0}}>{item.ok?"✓":"—"}</span>
                            <span>{item.t}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{border:"1.5px dashed rgba(255,255,255,0.15)",borderRadius:2,aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                        <div style={{textAlign:"center",fontSize:7,color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>SCREENSHOT DEL DASHBOARD<br/>reemplazar con imagen real</div>
                      </div>
                      <div
                        className={`key ${pi === 1 ? "key-red" : "key-dark"}`}
                        style={{width:"100%",justifyContent:"center",fontSize:8,letterSpacing:"0.12em",padding:"6px 0",display:"flex"}}
                        onClick={onCloseOverlay}>
                        EMPEZAR CON {plan.nombre.toUpperCase()} →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="monitor-chin"><div className="power-led"/></div>
        </div>
      </div>

      <div className="ctrl-bar">
        <div style={{display:"flex",gap:5}}>
          <div className="key" onClick={onPrev}>◂ ANT</div>
          <div className="key" onClick={onNext}>SIG ▸</div>
        </div>
        <div style={{fontSize:8,color:"var(--tinta)",letterSpacing:"0.1em",opacity:0.55}}>CH {episodio.ch}</div>
        <div className="key key-planes" onClick={() => onOpenPlan(0)}>▶ PLANES</div>
      </div>
    </>
  );
});

export default MonitorCRT;
