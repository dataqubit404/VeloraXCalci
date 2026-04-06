import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Google Fonts ─────────────────────────────────────────── */
const _link = Object.assign(document.createElement("link"), {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&display=swap",
});
document.head.appendChild(_link);

const _style = document.createElement("style");
_style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #0f0f10; overflow: hidden; height: 100vh; }
  #root { height: 100vh; overflow: hidden; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  input { background: none; border: none; outline: none; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
`;
document.head.appendChild(_style);

/* ── Audio ────────────────────────────────────────────────── */
let _ctx = null;
const beep = (f = 880, t = 0.07) => {
  try {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = _ctx.createOscillator(), g = _ctx.createGain();
    o.connect(g); g.connect(_ctx.destination);
    o.frequency.value = f; o.type = "sine";
    g.gain.setValueAtTime(0.06, _ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, _ctx.currentTime + t);
    o.start(); o.stop(_ctx.currentTime + t);
  } catch {}
};

/* ════════════════════════════════════════════════════════════
   1. SCIENTIFIC CALCULATOR  — Deep purple/indigo dark theme
════════════════════════════════════════════════════════════ */
function ScientificCalc() {
  const [expr, setExpr]         = useState("");
  const [display, setDisplay]   = useState("0");
  const [evaled, setEvaled]     = useState(false);
  const [mem, setMem]           = useState(0);
  const [rad, setRad]           = useState(true);

  const evaluate = (s) => {
    if (!s) return "0";
    try {
      const toRad = rad ? (x) => x : (x) => (x * Math.PI) / 180;
      const prepared = s
        .replace(/sin\((-?[\d.]+)\)/g,  (_, v) => String(Math.sin(toRad(+v))))
        .replace(/cos\((-?[\d.]+)\)/g,  (_, v) => String(Math.cos(toRad(+v))))
        .replace(/tan\((-?[\d.]+)\)/g,  (_, v) => String(Math.tan(toRad(+v))))
        .replace(/log\(/g,  "(Math.log10(")
        .replace(/ln\(/g,   "(Math.log(")
        .replace(/√\(/g,    "(Math.sqrt(")
        .replace(/π/g,      String(Math.PI))
        .replace(/ℇ/g,      String(Math.E))
        .replace(/\^/g,     "**")
        .replace(/×/g, "*").replace(/÷/g, "/");
      // eslint-disable-next-line no-new-func
      const r = Function('"use strict";return(' + prepared + ')')();
      if (typeof r !== "number" || !isFinite(r)) return "Error";
      return String(parseFloat(r.toPrecision(12)));
    } catch { return "Error"; }
  };

  const press = (k) => {
    beep(1000, 0.05);
    if (k === "AC")  { setExpr(""); setDisplay("0"); setEvaled(false); return; }
    if (k === "⌫")  {
      if (evaled) { setExpr(""); setDisplay("0"); setEvaled(false); return; }
      const ne = expr.slice(0, -1);
      setExpr(ne); setDisplay(ne || "0");
      return;
    }
    if (k === "=")   {
      const r = evaluate(expr);
      setDisplay(r); setExpr(expr); setEvaled(true);
      return;
    }
    if (k === "M+")  { setMem(m => m + parseFloat(display || 0)); return; }
    if (k === "MR")  { const s = (evaled ? "" : expr) + mem; setExpr(s); setDisplay(s); setEvaled(false); return; }
    if (k === "MC")  { setMem(0); return; }
    if (k === "RAD") { setRad(r => !r); return; }

    const isOp = ["+", "-", "×", "÷", "^", "(", ")"].includes(k);
    const base = evaled && !isOp ? "" : (evaled ? display : expr);
    const append = k === "x²" ? "^2" : k === "1/x" ? "^(-1)" : k;
    const ne = base + append;
    setExpr(ne); setDisplay(ne || "0"); setEvaled(false);
  };

  const layout = [
    ["RAD","M+","MR","MC","AC"],
    ["sin(","cos(","tan(","ln(","log("],
    ["√(","x²","1/x","(",")"],
    ["π","ℇ","^","⌫","÷"],
    ["7","8","9","×",""],
    ["4","5","6","−",""],
    ["1","2","3","+","="],
    ["0","00",".","",""],
  ];

  // cleaner: flat unique buttons
  const btns = [
    ["RAD","M+","MR","MC","AC"],
    ["sin(","cos(","tan(","ln(","log("],
    ["√(","x²","1/x","(",")"],
    ["π","ℇ","^","⌫","÷"],
    ["7","8","9","×",null],
    ["4","5","6","−",null],
    ["1","2","3","+","="],
    ["0","00",".",null,null],
  ];

  const bColor = (k) => {
    if (k === "=")    return { bg: "#6366f1", fg: "#fff" };
    if (["÷","×","−","+","^"].includes(k)) return { bg: "rgba(99,102,241,0.22)", fg: "#a5b4fc" };
    if (["AC","⌫"].includes(k))            return { bg: "rgba(239,68,68,0.15)", fg: "#fca5a5" };
    if (["sin(","cos(","tan(","ln(","log(","√(","x²","1/x","π","ℇ"].includes(k)) return { bg: "rgba(167,139,250,0.13)", fg: "#c4b5fd" };
    if (["M+","MR","MC"].includes(k))       return { bg: "rgba(251,191,36,0.13)", fg: "#fde68a" };
    if (k === "RAD")                        return { bg: "rgba(52,211,153,0.13)", fg: "#6ee7b7" };
    return { bg: "rgba(255,255,255,0.07)", fg: "rgba(255,255,255,0.88)" };
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:"linear-gradient(145deg,#1a1a2e,#16213e,#0f3460)", borderRadius:"24px", overflow:"hidden" }}>
      {/* Screen */}
      <div style={{ padding:"18px 18px 10px", background:"linear-gradient(180deg,rgba(99,102,241,0.12),transparent)", borderBottom:"1px solid rgba(99,102,241,0.18)", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
          <span style={{ fontSize:"9px", color:"#6366f1", letterSpacing:"0.14em", fontWeight:"700" }}>SCIENTIFIC</span>
          <div style={{ display:"flex", gap:"6px" }}>
            <span style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"6px", background: rad?"rgba(99,102,241,0.2)":"rgba(52,211,153,0.15)", color: rad?"#a5b4fc":"#6ee7b7", fontWeight:"600" }}>
              {rad ? "RAD" : "DEG"}
            </span>
            {mem !== 0 && <span style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"6px", background:"rgba(251,191,36,0.15)", color:"#fde68a" }}>M:{mem}</span>}
          </div>
        </div>
        {evaled && <div className="mono" style={{ fontSize:"10px", color:"rgba(99,102,241,0.5)", textAlign:"right", marginBottom:"4px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{expr} =</div>}
        <div className="mono" style={{
          fontSize: display.length > 14 ? "13px" : display.length > 10 ? "17px" : display.length > 7 ? "22px" : "28px",
          color:"#e0e7ff", textAlign:"right", lineHeight:1.2, wordBreak:"break-all", minHeight:"32px",
          display:"flex", alignItems:"flex-end", justifyContent:"flex-end",
        }}>{display}</div>
      </div>

      {/* Buttons — 5 cols, 8 rows */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"repeat(5,1fr)", gridTemplateRows:"repeat(8,1fr)", gap:"4px", padding:"8px" }}>
        {btns.flat().map((k, i) => {
          if (k === null) return <div key={i}/>;
          const { bg, fg } = bColor(k);
          const isEq = k === "=";
          return (
            <motion.button key={i} onClick={() => press(k)} whileTap={{ scale: 0.86 }}
              style={{
                background: bg, color: fg,
                borderRadius:"9px", fontSize: ["sin(","cos(","tan(","ln(","log("].includes(k) ? "10px" : "12px",
                fontWeight:"500", border:"1px solid rgba(255,255,255,0.05)",
                fontFamily: ["sin(","cos(","tan(","ln(","log(","√("].includes(k) ? "'JetBrains Mono',monospace" : "'Inter',sans-serif",
                gridRow: isEq ? "span 2" : undefined,
                cursor:"pointer", transition:"background 0.12s",
              }}
            >{k}</motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   2. CLASSIC IOS CALCULATOR — True black + amber orange
════════════════════════════════════════════════════════════ */
function ClassicCalc() {
  const [display, setDisplay] = useState("0");
  const [stored,  setStored]  = useState(null);
  const [op,      setOp]      = useState(null);
  const [fresh,   setFresh]   = useState(false);
  const [lastOp,  setLastOp]  = useState(null);
  const [lastVal, setLastVal] = useState(null);

  const calc = (a, b, o) => {
    if (o === "+") return a + b;
    if (o === "−") return a - b;
    if (o === "×") return a * b;
    if (o === "÷") return b === 0 ? null : a / b;
    return b;
  };
  const fmt = (n) => {
    if (n === null) return "Error";
    if (!isFinite(n)) return "Error";
    if (Math.abs(n) >= 1e10 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4);
    return String(parseFloat(n.toPrecision(10)));
  };

  const press = (k) => {
    beep(720, 0.06);
    if ("0123456789".includes(k)) {
      if (fresh) { setDisplay(k); setFresh(false); }
      else setDisplay(d => (d === "0" ? k : d.length < 10 ? d + k : d));
      return;
    }
    if (k === ".") {
      if (fresh) { setDisplay("0."); setFresh(false); return; }
      if (!display.includes(".")) setDisplay(d => d + ".");
      return;
    }
    if (k === "AC") {
      setDisplay("0"); setStored(null); setOp(null);
      setFresh(false); setLastOp(null); setLastVal(null);
      return;
    }
    if (k === "+/-") { setDisplay(d => d === "0" ? "0" : d.startsWith("-") ? d.slice(1) : "-" + d); return; }
    if (k === "%")   { setDisplay(d => fmt(parseFloat(d) / 100)); return; }
    if (["+","−","×","÷"].includes(k)) {
      if (stored !== null && op && !fresh) {
        const r = calc(parseFloat(stored), parseFloat(display), op);
        const s = fmt(r);
        setDisplay(s); setStored(s);
      } else {
        setStored(display);
      }
      setOp(k); setLastOp(k); setLastVal(display); setFresh(true);
      return;
    }
    if (k === "=") {
      if (op && stored !== null) {
        const b = fresh ? lastVal : display;
        const r = calc(parseFloat(stored), parseFloat(b), op);
        const s = fmt(r);
        setDisplay(s); setStored(s); setLastVal(b); setFresh(true); setOp(null);
      } else if (lastOp && lastVal !== null) {
        const r = calc(parseFloat(display), parseFloat(lastVal), lastOp);
        setDisplay(fmt(r)); setFresh(true);
      }
      return;
    }
  };

  const rows = [
    ["AC", "+/-", "%", "÷"],
    ["7","8","9","×"],
    ["4","5","6","−"],
    ["1","2","3","+"],
    ["0",".","="],
  ];

  const bColor = (k) => {
    if (k === "=")              return { bg:"#ff9f0a", fg:"#fff" };
    if (["+","−","×","÷"].includes(k)) return { bg: op===k ? "#fff" : "#ff9f0a", fg: op===k ? "#ff9f0a" : "#fff" };
    if (["AC","+/-","%"].includes(k))  return { bg:"#d4d4d2", fg:"#1c1c1e" };
    return { bg:"#333335", fg:"#fff" };
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:"#000", borderRadius:"24px", overflow:"hidden" }}>
      {/* Display */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"20px 20px 12px" }}>
        {op && stored && (
          <div className="mono" style={{ fontSize:"12px", color:"rgba(255,159,10,0.4)", textAlign:"right", marginBottom:"4px" }}>
            {stored} {op}
          </div>
        )}
        <div className="mono" style={{
          fontSize: display.length > 9 ? "30px" : display.length > 6 ? "44px" : "62px",
          color:"#fff", textAlign:"right", lineHeight:1,
          fontWeight:"200", letterSpacing:"-0.03em", transition:"font-size 0.1s",
        }}>{display}</div>
      </div>

      {/* Buttons */}
      <div style={{ padding:"12px", flexShrink:0, display:"flex", flexDirection:"column", gap:"10px" }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display:"grid", gridTemplateColumns: ri === 4 ? "2fr 1fr 1fr" : "repeat(4,1fr)", gap:"10px" }}>
            {row.map(k => {
              const { bg, fg } = bColor(k);
              return (
                <motion.button key={k} onClick={() => press(k)} whileTap={{ scale: 0.91 }}
                  style={{
                    background:bg, color:fg, borderRadius:"50%",
                    height:"58px", aspectRatio: k==="0" ? "unset" : "1",
                    fontSize: k==="AC" ? "16px" : "24px",
                    fontWeight:"400", fontFamily:"'Inter',sans-serif",
                    boxShadow:"0 4px 20px rgba(0,0,0,0.5)",
                    border:"none", cursor:"pointer",
                    transition:"background 0.12s, color 0.12s",
                    textAlign: k==="0" ? "left" : "center",
                    paddingLeft: k==="0" ? "20px" : "0",
                  }}
                >{k}</motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   3. DAILY LIFE TOOLS — Slate-blue frosted card theme
════════════════════════════════════════════════════════════ */
const Field = ({ label, value, onChange, unit, type = "number" }) => (
  <div>
    <div style={{ fontSize:"10px", color:"#64748b", fontWeight:"600", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"5px" }}>{label}</div>
    <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.05)", borderRadius:"11px", padding:"9px 13px", border:"1px solid rgba(255,255,255,0.07)" }}>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ flex:1, fontSize:"14px", color:"#f1f5f9", width:"100%", fontFamily:"'JetBrains Mono',monospace" }}
      />
      {unit && <span style={{ fontSize:"11px", color:"#475569", fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{unit}</span>}
    </div>
  </div>
);

const Res = ({ label, value, accent = "#38bdf8" }) => (
  <div style={{ background:`linear-gradient(135deg,${accent}15,${accent}06)`, border:`1px solid ${accent}28`, borderRadius:"11px", padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
    <span style={{ fontSize:"10px", color:"#64748b", fontWeight:"600", letterSpacing:"0.06em", textTransform:"uppercase" }}>{label}</span>
    <span className="mono" style={{ fontSize:"15px", color:"#f1f5f9", fontWeight:"500" }}>{value}</span>
  </div>
);

const GoBtn = ({ label, onClick, color }) => (
  <motion.button onClick={onClick} whileTap={{ scale: 0.95 }}
    style={{
      width:"100%", padding:"11px", borderRadius:"11px", fontSize:"12px", fontWeight:"600",
      background:`linear-gradient(135deg,${color}dd,${color}88)`,
      color:"#fff", letterSpacing:"0.05em", boxShadow:`0 4px 18px ${color}35`,
      border:"none", cursor:"pointer",
    }}
  >{label}</motion.button>
);

function BMI() {
  const [h,setH] = useState("170"); const [w,setW] = useState("70"); const [res,setRes] = useState(null);
  const go = () => {
    beep(900,0.06);
    const hm = parseFloat(h)/100, wk = parseFloat(w);
    if (!hm||!wk||hm<=0||wk<=0) { setRes({err:true}); return; }
    const bmi = wk/(hm*hm);
    const cat = bmi<18.5?"Underweight":bmi<25?"Normal Weight":bmi<30?"Overweight":"Obese";
    const ideal = [+(18.5*hm*hm).toFixed(1), +(24.9*hm*hm).toFixed(1)];
    setRes({bmi:bmi.toFixed(1),cat,ideal:`${ideal[0]}–${ideal[1]} kg`});
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
      <Field label="Height" value={h} onChange={setH} unit="cm"/>
      <Field label="Weight" value={w} onChange={setW} unit="kg"/>
      <GoBtn label="Calculate BMI →" onClick={go} color="#38bdf8"/>
      {res&&!res.err&&<>
        <Res label="BMI" value={res.bmi} accent="#38bdf8"/>
        <Res label="Status" value={res.cat} accent="#818cf8"/>
        <Res label="Ideal Range" value={res.ideal} accent="#34d399"/>
      </>}
      {res?.err && <div style={{color:"#f87171",fontSize:"12px",textAlign:"center"}}>Please enter valid values</div>}
    </div>
  );
}

function SI() {
  const [p,setP]=useState("50000");const [r,setR]=useState("8");const [t,setT]=useState("3");const [res,setRes]=useState(null);
  const fmt = n => n>=10000000?`₹${(n/10000000).toFixed(2)}Cr`:n>=100000?`₹${(n/100000).toFixed(2)}L`:`₹${n.toFixed(2)}`;
  const go = () => {
    beep(900,0.06);
    const P=parseFloat(p),R=parseFloat(r),T=parseFloat(t);
    if(!P||!R||!T||P<=0||R<=0||T<=0) return;
    const si=(P*R*T)/100;
    setRes({si,total:P+si,monthly:si/(T*12)});
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
      <Field label="Principal (₹)" value={p} onChange={setP}/>
      <Field label="Annual Rate" value={r} onChange={setR} unit="%"/>
      <Field label="Time" value={t} onChange={setT} unit="yrs"/>
      <GoBtn label="Calculate Interest →" onClick={go} color="#f59e0b"/>
      {res&&<>
        <Res label="Simple Interest" value={fmt(res.si)} accent="#f59e0b"/>
        <Res label="Total Amount" value={fmt(res.total)} accent="#34d399"/>
        <Res label="Monthly Interest" value={fmt(res.monthly)} accent="#818cf8"/>
      </>}
    </div>
  );
}

function SIP() {
  const [m,setM]=useState("5000");const [r,setR]=useState("12");const [y,setY]=useState("10");const [res,setRes]=useState(null);
  const fmt = n => n>=10000000?`₹${(n/10000000).toFixed(2)}Cr`:n>=100000?`₹${(n/100000).toFixed(2)}L`:`₹${Math.round(n).toLocaleString()}`;
  const go = () => {
    beep(900,0.06);
    const M=parseFloat(m),rate=parseFloat(r)/100/12,months=parseFloat(y)*12;
    if(!M||!rate||!months||M<=0||rate<=0||months<=0) return;
    const fv=M*((Math.pow(1+rate,months)-1)/rate)*(1+rate);
    const invested=M*months;
    setRes({fv,invested,gain:fv-invested,mult:(fv/invested).toFixed(2)});
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
      <Field label="Monthly SIP (₹)" value={m} onChange={setM}/>
      <Field label="Expected Return" value={r} onChange={setR} unit="% p.a."/>
      <Field label="Duration" value={y} onChange={setY} unit="yrs"/>
      <GoBtn label="Calculate Returns →" onClick={go} color="#34d399"/>
      {res&&<>
        <Res label="Future Value" value={fmt(res.fv)} accent="#34d399"/>
        <Res label="Total Invested" value={fmt(res.invested)} accent="#94a3b8"/>
        <Res label="Est. Gains" value={fmt(res.gain)} accent="#f59e0b"/>
        <Res label="Return Multiple" value={`${res.mult}×`} accent="#818cf8"/>
      </>}
    </div>
  );
}

function AGE() {
  const [dob,setDob]=useState("2000-01-15");const [res,setRes]=useState(null);
  const go = () => {
    beep(900,0.06);
    const b=new Date(dob),n=new Date();
    if(isNaN(b.getTime())||b>=n) return;
    let y=n.getFullYear()-b.getFullYear(), mo=n.getMonth()-b.getMonth(), d=n.getDate()-b.getDate();
    if(d<0){mo--;d+=new Date(n.getFullYear(),n.getMonth(),0).getDate();}
    if(mo<0){y--;mo+=12;}
    const totalDays=Math.floor((n-b)/86400000);
    const next=new Date(n.getFullYear(),b.getMonth(),b.getDate());
    if(next<=n) next.setFullYear(n.getFullYear()+1);
    const daysLeft=Math.floor((next-n)/86400000);
    setRes({y,mo,d,totalDays,daysLeft,totalHours:Math.floor(totalDays*24)});
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
      <Field label="Date of Birth" value={dob} onChange={setDob} type="date"/>
      <GoBtn label="Calculate Age →" onClick={go} color="#818cf8"/>
      {res&&<>
        <Res label="Age" value={`${res.y}y ${res.mo}m ${res.d}d`} accent="#818cf8"/>
        <Res label="Days Lived" value={res.totalDays.toLocaleString()} accent="#38bdf8"/>
        <Res label="Next Birthday" value={`${res.daysLeft} days`} accent="#f472b6"/>
        <Res label="Hours Lived" value={res.totalHours.toLocaleString()} accent="#f59e0b"/>
      </>}
    </div>
  );
}

const TABS = [
  {id:"bmi",label:"BMI",    color:"#38bdf8", Comp:BMI},
  {id:"si", label:"SI",     color:"#f59e0b", Comp:SI},
  {id:"sip",label:"SIP",    color:"#34d399", Comp:SIP},
  {id:"age",label:"Age",    color:"#818cf8", Comp:AGE},
];

function DailyCalc() {
  const [tab,setTab] = useState(0);
  const T = TABS[tab];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:"linear-gradient(145deg,#0f172a,#1e293b)", borderRadius:"24px", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"14px 14px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <div style={{ fontSize:"9px", color:"#334155", fontWeight:"700", letterSpacing:"0.16em", marginBottom:"10px" }}>DAILY TOOLS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"5px", marginBottom:"12px" }}>
          {TABS.map((t,i) => (
            <motion.button key={t.id} onClick={() => { beep(800,0.05); setTab(i); }} whileTap={{ scale:0.92 }}
              style={{
                padding:"7px 2px", borderRadius:"9px", fontSize:"11px", fontWeight:"600",
                background: tab===i ? t.color : "rgba(255,255,255,0.04)",
                color: tab===i ? "#fff" : "#475569",
                border: tab===i ? "none" : "1px solid rgba(255,255,255,0.05)",
                transition:"all 0.2s", cursor:"pointer",
              }}
            >{t.label}</motion.button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 14px 14px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            transition={{duration:0.18}}
          >
            <T.Comp/>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CARDS CONFIG
════════════════════════════════════════════════════════════ */
const CARDS = [
  { id:"sci",   label:"Scientific",  sub:"Advanced Math & Trig",    emoji:"∑",  accent:"#6366f1", Comp:ScientificCalc },
  { id:"ios",   label:"Classic",     sub:"iOS-style Calculator",     emoji:"◎",  accent:"#ff9f0a", Comp:ClassicCalc   },
  { id:"daily", label:"Daily Tools", sub:"BMI · SI · SIP · Age",     emoji:"◈",  accent:"#38bdf8", Comp:DailyCalc     },
];

/* ════════════════════════════════════════════════════════════
   CARD COMPONENT
════════════════════════════════════════════════════════════ */
function Card({ data, offset, expanded, onExpand, onFocus }) {
  const isFar    = Math.abs(offset) > 1;
  const isCenter = offset === 0;
  const { Comp } = data;

  return (
    <motion.div
      onClick={() => {
        if (expanded) return;
        if (isCenter) onExpand();
        else onFocus();
      }}
      animate={{
        x:       expanded ? 0 : offset * 310,
        rotateY: expanded ? 0 : offset * -24,
        scale:   expanded ? 1.03 : isCenter ? 1 : Math.abs(offset)===1 ? 0.80 : 0.65,
        opacity: expanded ? 1   : isCenter ? 1 : Math.abs(offset)===1 ? 0.50 : 0.20,
        filter:  `blur(${expanded ? 0 : isCenter ? 0 : Math.abs(offset)===1 ? 2 : 5}px)`,
        y: expanded ? 0 : isCenter ? [0,-8,0] : 0,
        zIndex: expanded ? 60 : isCenter ? 20 : 5,
      }}
      transition={{
        x:       { type:"spring", stiffness:270, damping:28 },
        rotateY: { type:"spring", stiffness:270, damping:28 },
        scale:   { type:"spring", stiffness:290, damping:26 },
        opacity: { duration:0.32 },
        filter:  { duration:0.28 },
        y: (isCenter && !expanded)
          ? { duration:3.8, repeat:Infinity, ease:"easeInOut" }
          : { type:"spring", stiffness:280, damping:24 },
      }}
      style={{
        position:"absolute",
        width:300, height:520,
        borderRadius:"24px",
        cursor: expanded ? "default" : "pointer",
        transformStyle:"preserve-3d",
        pointerEvents: (isFar && !expanded) ? "none" : "auto",
        boxShadow: expanded
          ? "0 48px 100px rgba(0,0,0,0.7), 0 12px 32px rgba(0,0,0,0.5)"
          : isCenter
            ? "0 24px 60px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.35)"
            : "0 6px 20px rgba(0,0,0,0.4)",
      }}
    >
      {/* Calculator content */}
      <div style={{ width:"100%", height:"100%", borderRadius:"24px", overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
        <Comp/>
      </div>

      {/* Frosted side-card overlay with label */}
      {!expanded && !isCenter && (
        <div style={{
          position:"absolute", inset:0, borderRadius:"24px",
          background:"rgba(0,0,0,0.25)", backdropFilter:"blur(2px)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"10px",
          pointerEvents:"none",
        }}>
          <div style={{ fontSize:"40px", opacity:0.6 }}>{data.emoji}</div>
          <div style={{ fontSize:"14px", fontWeight:"600", color:"rgba(255,255,255,0.65)" }}>{data.label}</div>
          <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", letterSpacing:"0.06em" }}>{data.sub}</div>
          <div style={{ fontSize:"9px", color:`${data.accent}aa`, letterSpacing:"0.1em", fontWeight:"600" }}>← SWIPE TO CENTER →</div>
        </div>
      )}

      {/* "Tap to open" ring on center */}
      {!expanded && isCenter && (
        <motion.div
          animate={{ opacity:[0.4,0.8,0.4] }}
          transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
          style={{
            position:"absolute", bottom:"12px", left:"50%", transform:"translateX(-50%)",
            fontSize:"9px", color:`${data.accent}99`, letterSpacing:"0.1em", fontWeight:"600",
            background:"rgba(0,0,0,0.35)", padding:"4px 14px", borderRadius:"20px",
            pointerEvents:"none", whiteSpace:"nowrap", border:`1px solid ${data.accent}33`,
          }}
        >TAP TO INTERACT</motion.div>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════════════ */
export default function App() {
  const [current,  setCurrent]  = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Pointer-drag for swipe (works on both mouse and touch)
  const drag = useRef({ active:false, startX:0, moved:false });

  const onPointerDown = (e) => {
    if (expanded) return;
    drag.current = { active:true, startX:e.clientX, moved:false };
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    if (Math.abs(e.clientX - drag.current.startX) > 6) drag.current.moved = true;
  };
  const onPointerUp = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = drag.current.startX - e.clientX;
    if (Math.abs(dx) < 40) return;
    if (dx > 0 && current < CARDS.length-1) { beep(580,0.06); setCurrent(c=>c+1); }
    if (dx < 0 && current > 0)              { beep(580,0.06); setCurrent(c=>c-1); }
  };

  // Keyboard
  useEffect(() => {
    const h = (e) => {
      if (expanded) { if (e.key==="Escape") setExpanded(false); return; }
      if (e.key==="ArrowRight" && current < CARDS.length-1) { beep(580,0.06); setCurrent(c=>c+1); }
      if (e.key==="ArrowLeft"  && current > 0)              { beep(580,0.06); setCurrent(c=>c-1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [current, expanded]);

  const acc = CARDS[current].accent;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        width:"100%", height:"100vh",
        background:"#0a0a0c",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        overflow:"hidden", position:"relative",
        userSelect:"none", touchAction:"none",
      }}
    >
      {/* Background ambient blobs */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <motion.div animate={{ background:`radial-gradient(ellipse at 25% 30%, ${acc}12, transparent 60%)` }} transition={{ duration:0.8 }}
          style={{ position:"absolute", inset:0 }}/>
        <div style={{ position:"absolute", bottom:"5%", right:"10%", width:"400px", height:"400px",
          background:"radial-gradient(circle,rgba(30,41,59,0.8),transparent 70%)" }}/>
      </div>

      {/* Header */}
      <motion.div
        animate={{ opacity: expanded?0:1, y: expanded?-24:0 }}
        transition={{ duration:0.3 }}
        style={{ position:"absolute", top:"28px", left:0, right:0, textAlign:"center", pointerEvents:"none" }}
      >
        <motion.div
          animate={{ color: acc }}
          style={{ fontSize:"10px", letterSpacing:"0.22em", fontWeight:"700", textTransform:"uppercase", marginBottom:"6px" }}
        >{CARDS[current].label}</motion.div>
        <div style={{ fontSize:"24px", fontWeight:"700", color:"#f9fafb", letterSpacing:"-0.03em", lineHeight:1.1 }}>
          Calculator Studio
        </div>
        <div style={{ fontSize:"11px", color:"#374151", marginTop:"5px", letterSpacing:"0.04em" }}>
          Swipe · Arrow keys · Click to open
        </div>
      </motion.div>

      {/* Backdrop when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="bd"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            transition={{duration:0.3}}
            onClick={() => setExpanded(false)}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(16px)", zIndex:50, cursor:"pointer" }}
          />
        )}
      </AnimatePresence>

      {/* Close button */}
      <AnimatePresence>
        {expanded && (
          <motion.button
            key="cls"
            initial={{opacity:0,scale:0.6}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.6}}
            onClick={() => setExpanded(false)}
            style={{
              position:"fixed", top:"18px", right:"18px", zIndex:110,
              width:"38px", height:"38px", borderRadius:"50%",
              background:"rgba(255,255,255,0.1)", backdropFilter:"blur(10px)",
              border:"1px solid rgba(255,255,255,0.12)",
              color:"#fff", fontSize:"20px", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
          >✕</motion.button>
        )}
      </AnimatePresence>

      {/* 3D Carousel stage */}
      <div style={{
        position:"relative", width:300, height:520,
        perspective:"1300px",
        zIndex: expanded ? 60 : 10,
      }}>
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            data={card}
            offset={i - current}
            expanded={expanded && i === current}
            onExpand={() => setExpanded(true)}
            onFocus={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Dot navigation */}
      <motion.div
        animate={{ opacity: expanded?0:1 }}
        style={{ position:"absolute", bottom:"34px", display:"flex", gap:"8px", alignItems:"center", zIndex:10, pointerEvents: expanded?"none":"auto" }}
      >
        {CARDS.map((c,i) => (
          <motion.button key={c.id}
            onClick={() => { beep(640,0.05); setCurrent(i); }}
            animate={{ width: i===current?"28px":"8px", background: i===current ? c.accent : "rgba(255,255,255,0.18)" }}
            transition={{ type:"spring", stiffness:320, damping:28 }}
            style={{ height:"8px", borderRadius:"4px", border:"none", cursor:"pointer" }}
          />
        ))}
      </motion.div>
    </div>
  );
}