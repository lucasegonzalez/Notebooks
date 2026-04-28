"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";

const MonitorCRT = forwardRef(function MonitorCRT({ episodio, onPrev, onNext }, ref) {
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
          px.style.cssText = `width:2.5%;height:3.34%;background:rgb(${v},${v},${v});opacity:${(Math.random()*0.9+0.1).toFixed(2)};`;
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

  return (
    <>
      <div className="wt">
        <div className="wt-x"/>
        <div className="wt-t">Episodios · EP.{episodio.ch} de 48</div>
      </div>

      <div style={{flex:1,position:"relative",overflow:"hidden",margin:8,border:"3px solid #000",background:"#222"}}>
        <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(transparent,transparent 3px,rgba(0,0,0,0.18) 3px,rgba(0,0,0,0.18) 4px)",pointerEvents:"none",zIndex:6}}/>
        <div style={{position:"absolute",inset:0,boxShadow:"inset 0 0 70px rgba(0,0,0,0.65)",pointerEvents:"none",zIndex:5}}/>
        <div ref={staticRef} style={{position:"absolute",inset:0,zIndex:10,display:"none",flexWrap:"wrap",overflow:"hidden"}}/>
        <svg
          width="100%" height="100%" viewBox="0 0 340 240"
          preserveAspectRatio="xMidYMid slice"
          style={{position:"absolute",inset:0,zIndex:1,opacity:0.18}}
          dangerouslySetInnerHTML={{ __html: episodio.pixelArt }}
        />
        {episodio.img && (
          <div style={{position:"absolute",inset:0,zIndex:2,backgroundImage:`url(${episodio.img})`,backgroundSize:"cover",backgroundPosition:"center top",filter:"grayscale(100%) contrast(1.5) brightness(0.65)",opacity:0.6}}/>
        )}
        <div style={{position:"absolute",inset:0,zIndex:3,background:"linear-gradient(to top,rgba(0,0,0,0.96) 30%,rgba(0,0,0,0.2) 70%,transparent 100%)"}}/>
        <div style={{position:"absolute",inset:0,zIndex:4,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,fontWeight:500,letterSpacing:"0.2em",color:"#fff",background:"#C0392B",padding:"2px 8px",display:"inline-block"}}>{episodio.ep}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#fff",background:"rgba(0,0,0,0.6)",padding:"1px 5px"}}>{episodio.tc}</div>
          </div>
          <div>
            <div
              style={{fontFamily:"'DM Mono',monospace",fontWeight:500,fontSize:"clamp(22px,4.5vw,34px)",lineHeight:0.88,color:"#fff",textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:8}}
              dangerouslySetInnerHTML={{ __html: episodio.title.split("\n").join("<br/>") }}
            />
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:10,fontStyle:"italic",color:"#aaa",lineHeight:1.5}}>{episodio.sub}</div>
          </div>
        </div>
      </div>

      <div style={{flexShrink:0,borderTop:"2px solid #000",background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 8px"}}>
        <div style={{display:"flex",gap:4}}>
          <div className="cbtn" onClick={onPrev}>◂ ANT</div>
          <div className="cbtn" onClick={onNext}>SIG ▸</div>
        </div>
        <div style={{fontSize:9,color:"#000",letterSpacing:"0.1em"}}>CH {episodio.ch} · DATA EN CRIOLLO</div>
        <div className="cbtn cbtn-on" onClick={onNext}>● REC</div>
      </div>
    </>
  );
});

export default MonitorCRT;
