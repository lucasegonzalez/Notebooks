"use client";
import { useState, useEffect, useRef } from "react";
import Mac84Shell   from "@/components/Mac84Shell";
import MonitorCRT   from "@/components/MonitorCRT";
import FileRow      from "@/components/FileRow";
import ROICalculator from "@/components/ROICalculator";
import AgendaWindow  from "@/components/AgendaWindow";
import { EPISODIOS } from "@/data/episodios";

export default function Landing() {
  const [cur,         setCur]         = useState(0);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [curPlan,     setCurPlan]     = useState(0);
  const monitorRef = useRef(null);

  function navEp(dir) {
    if (overlayOpen) closeOverlay();
    monitorRef.current?.showStatic(() =>
      setCur(c => (c + dir + EPISODIOS.length) % EPISODIOS.length)
    );
  }

  function openPlanOverlay(idx) {
    setCurPlan(idx ?? 0);
    setOverlayOpen(true);
  }

  function closeOverlay() {
    setOverlayOpen(false);
  }

  function navPlan(dir) {
    setCurPlan(c => (c + dir + 3) % 3);
  }

  // Auto-advance episodes when overlay is closed
  useEffect(() => {
    const t = setInterval(() => {
      if (!overlayOpen) {
        monitorRef.current?.showStatic(() =>
          setCur(c => (c + 1) % EPISODIOS.length)
        );
      }
    }, 9000);
    return () => clearInterval(t);
  }, [overlayOpen]);

  return (
    <Mac84Shell>
      <div className="body">

        {/* ── LEFT: MONITOR ── */}
        <div className="col-left">
          <MonitorCRT
            ref={monitorRef}
            episodio={EPISODIOS[cur]}
            epIdx={cur}
            epTotal={48}
            onPrev={() => navEp(-1)}
            onNext={() => navEp(1)}
            overlayOpen={overlayOpen}
            curPlan={curPlan}
            onNavPlan={navPlan}
            onCloseOverlay={closeOverlay}
            onOpenPlan={openPlanOverlay}
          />
          <FileRow
            episodios={EPISODIOS}
            cur={cur}
            onSelect={i => {
              if (overlayOpen) closeOverlay();
              monitorRef.current?.showStatic(() => setCur(i));
            }}
          />
        </div>

        {/* ── RIGHT: ROI + AGENDA ── */}
        <div className="col-right">
          <div className="right-top" style={{flex:58}}>
            <div className="pt">
              <div className="pt-dot"/>
              <div className="pt-txt">¿Cuánto te cuesta no tener tus números?</div>
              <div className="pt-dot"/>
            </div>
            <ROICalculator onOpenPlan={openPlanOverlay} />
          </div>

          <div className="right-bot" style={{flex:42}}>
            <div className="pt">
              <div className="pt-dot"/>
              <div className="pt-txt">Agenda — Reservar llamada</div>
              <div className="pt-dot"/>
            </div>
            <AgendaWindow />
          </div>
        </div>

      </div>
    </Mac84Shell>
  );
}
