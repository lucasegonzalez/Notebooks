export default function FileRow({ episodios, cur, onSelect }) {
  return (
    <div style={{borderTop:"2px solid #000",background:"#fff",display:"flex",flexShrink:0,overflowX:"auto"}}>
      {episodios.map((ep, i) => (
        <div key={i} className={`fi ${i === cur ? "fi-sel" : ""}`} onClick={() => onSelect(i)}>
          <div className="fi-img">
            <svg width="14" height="12" viewBox="0 0 14 12">
              <rect x="1" y="1" width="12" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="2" y="2" width="10" height="2" fill="currentColor"/>
              <rect x="2" y="6" width={5 + i * 2} height="1" fill="currentColor"/>
            </svg>
          </div>
          <div className="fi-lbl">EP.{ep.ch}<br/>{ep.ep.split("·")[1].trim().slice(0, 7)}</div>
        </div>
      ))}
      <div style={{flexShrink:0,width:38,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"4px 2px",opacity:0.45,cursor:"pointer"}}>
        <div style={{fontSize:11,color:"#000"}}>···</div>
        <div style={{fontSize:7,color:"#555",fontFamily:"'DM Mono',monospace"}}>+44</div>
      </div>
    </div>
  );
}
