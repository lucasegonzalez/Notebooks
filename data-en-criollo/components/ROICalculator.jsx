"use client";
import { useState } from "react";
import { PLANES_DEF } from "@/data/planes";

function parseMiles(s) {
  return parseFloat(String(s).replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
}
function fmtARS(n) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}
function fmtVentas(raw) {
  const n = parseInt(raw.replace(/\./g, "").replace(/\D/g, "")) || 0;
  return n.toLocaleString("es-AR");
}

export default function ROICalculator({ onOpenPlan }) {
  const [ventas, setVentas] = useState("5.000.000");
  const [tc, setTc] = useState("1380");
  const [churn, setChurn] = useState(8);

  const ventasNum = parseMiles(ventas);
  const tcNum = parseFloat(tc) || 1380;
  const churnPct = churn / 100;

  const d1 = ventasNum * 0.020;
  const d2 = ventasNum * churnPct * 0.25;
  const d3 = ventasNum * 0.015;
  const d4 = ventasNum * 0.008;
  const total = d1 + d2 + d3 + d4;

  const costos = PLANES_DEF.map(p => p.precio * tcNum);
  const rois   = costos.map(c => total / c);

  let recIdx = 0;
  for (let i = PLANES_DEF.length - 1; i >= 0; i--) {
    if (rois[i] >= 1) { recIdx = i; break; }
  }

  const recPlan = PLANES_DEF[recIdx];
  let nota = "";
  if (rois[0] < 1) {
    nota = `Con ${fmtARS(ventasNum)} en ventas el análisis genera ${fmtARS(total)}/mes. El Starter (USD ${PLANES_DEF[0].precio}) se justifica a partir de ${fmtARS(PLANES_DEF[0].precio * tcNum / 0.043)} en ventas mensuales.`;
  } else {
    nota = `Con ${fmtARS(ventasNum)} en ventas estás dejando ir ${fmtARS(total)}/mes. El plan ${recPlan.nombre} (USD ${recPlan.precio}) se recupera solo en ${Math.round(30 / rois[recIdx])} días del mes.`;
  }

  return (
    <div className="panel-body">
      {/* INPUTS */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,flexShrink:0}}>
        <div>
          <div style={{fontSize:8,letterSpacing:"0.1em",color:"var(--tinta)",opacity:0.6,marginBottom:2}}>VENTAS MENSUALES (ARS)</div>
          <input
            className="roi-inp"
            value={ventas}
            onChange={e => setVentas(fmtVentas(e.target.value))}
          />
        </div>
        <div>
          <div style={{fontSize:8,letterSpacing:"0.1em",color:"var(--tinta)",opacity:0.6,marginBottom:2}}>TIPO DE CAMBIO USD/ARS</div>
          <input
            className="roi-inp"
            type="number"
            value={tc}
            onChange={e => setTc(e.target.value)}
          />
        </div>
      </div>

      {/* CHURN SLIDER */}
      <div style={{flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
          <div style={{fontSize:8,letterSpacing:"0.1em",color:"var(--tinta)",opacity:0.6}}>CLIENTES QUE PERDÉS POR MES</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"var(--tinta)"}}>{churn}%</div>
        </div>
        <input
          type="range" className="roi-slider"
          min={1} max={20} value={churn}
          onChange={e => setChurn(Number(e.target.value))}
        />
        <div style={{fontSize:7,color:"var(--tinta)",opacity:0.38,marginTop:1,fontStyle:"italic"}}>La mayoría de los negocios pierde entre 5% y 12% por mes sin saberlo.</div>
      </div>

      {/* KPI BLOCK */}
      <div className="kpi-bloque">
        <div style={{fontSize:7,letterSpacing:"0.18em",color:"rgba(232,223,200,0.4)",marginBottom:3}}>💸 LO QUE PROBABLEMENTE ESTÁS DEJANDO IR CADA MES</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:34,lineHeight:1,color:"var(--terracota)",marginBottom:6}}>{fmtARS(total)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,borderTop:"1px solid rgba(232,223,200,0.08)",paddingTop:6}}>
          {[
            { label: "PRODUCTO\nSIN MARGEN",  val: d1 },
            { label: "CLIENTES\nPERDIDOS",    val: d2 },
            { label: "DECISIONES\nTARDÍAS",   val: d3 },
            { label: "CAJA\nSORPRESA",        val: d4 },
          ].map((item, i) => (
            <div key={i} style={{textAlign:"center",borderLeft: i > 0 ? "1px solid rgba(232,223,200,0.08)" : "none"}}>
              <div style={{fontSize:6,color:"rgba(232,223,200,0.3)",letterSpacing:"0.06em",marginBottom:2,lineHeight:1.3,whiteSpace:"pre-line"}}>{item.label}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:11,color:"rgba(232,223,200,0.65)"}}>{fmtARS(item.val)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PLAN COMPARE */}
      <div style={{fontSize:7,color:"var(--tinta)",opacity:0.4,letterSpacing:"0.1em",textAlign:"center",flexShrink:0}}>¿QUÉ PLAN RECUPERA ESTA PÉRDIDA? — HACÉ CLICK PARA VER EL DETALLE</div>
      <div className="plan-compare">
        {PLANES_DEF.map((plan, i) => {
          const roi = rois[i];
          const esRec = i === recIdx;
          const color = roi >= 1.5 ? "#7A8C5A" : roi >= 1 ? "#C8843A" : "#C0392B";
          const icon  = roi >= 1.5 ? "✓" : roi >= 1 ? "◐" : "✕";
          const lbl   = roi >= 1.5 ? "ROI positivo" : roi >= 1 ? "Cubre el costo" : "ROI negativo";
          return (
            <div key={i} className={`pc ${esRec ? "rec" : ""} ${roi < 1 ? "neg" : ""}`} onClick={() => onOpenPlan(i)}>
              {esRec && <div className="pc-badge">RECOMENDADO</div>}
              <div style={{fontSize:12}}>{plan.emoji}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:11,color:"var(--tinta)"}}>{plan.nombre}</div>
              <div style={{fontSize:7,color:"var(--burdeos)",fontWeight:500}}>USD {plan.precio}/mes</div>
              <div style={{fontSize:7,color:"var(--tinta)",opacity:0.5}}>{fmtARS(costos[i])} ARS</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color,marginTop:2}}>{icon} {roi.toFixed(1)}x</div>
              <div style={{fontSize:6,letterSpacing:"0.08em",color}}>{lbl}</div>
              <div style={{marginTop:4,fontSize:6,color:"var(--tinta)",opacity:0.4,letterSpacing:"0.06em"}}>VER DETALLE →</div>
            </div>
          );
        })}
      </div>

      {/* NOTA */}
      <div style={{fontFamily:"'Source Serif 4',serif",fontStyle:"italic",fontSize:7.5,color:"var(--tinta)",opacity:0.45,lineHeight:1.5,flexShrink:0}}>{nota}</div>
    </div>
  );
}
