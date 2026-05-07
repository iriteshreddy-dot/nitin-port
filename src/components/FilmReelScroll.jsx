import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── REEL SVG ─────────────────────────────────────────────────────────────────
function ReelSVG({ reelRef }) {
  const spokes = [0,60,120,180,240,300];
  return (
    <div ref={reelRef} style={{ width:200, height:200, transformOrigin:'center', willChange:'transform', filter:'drop-shadow(0 0 24px rgba(232,213,163,0.25))' }}>
      <svg viewBox="0 0 100 100" width="200" height="200">
        <circle cx="50" cy="50" r="48" fill="#161616" stroke="#2a2a2a" strokeWidth="2"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(232,213,163,0.1)" strokeWidth="0.5"/>
        {spokes.map(deg => {
          const r = deg*Math.PI/180;
          return <line key={deg} x1={50+9*Math.cos(r)} y1={50+9*Math.sin(r)} x2={50+44*Math.cos(r)} y2={50+44*Math.sin(r)} stroke="#2e2e2e" strokeWidth="5" strokeLinecap="round"/>;
        })}
        {[30,90,150,210,270,330].map(deg => {
          const r=deg*Math.PI/180, cx=50+30*Math.cos(r), cy=50+30*Math.sin(r);
          return <ellipse key={deg} cx={cx} cy={cy} rx="8" ry="11" transform={`rotate(${deg+90},${cx},${cy})`} fill="#0a0a0a" stroke="#252525" strokeWidth="0.8"/>;
        })}
        {Array.from({length:24}).map((_,i)=>{
          const a=(i/24)*Math.PI*2;
          return <line key={i} x1={50+45*Math.cos(a)} y1={50+45*Math.sin(a)} x2={50+48*Math.cos(a)} y2={50+48*Math.sin(a)} stroke="rgba(232,213,163,0.12)" strokeWidth="0.8"/>;
        })}
        <circle cx="50" cy="50" r="10" fill="#1a1a1a" stroke="rgba(232,213,163,0.35)" strokeWidth="1.2"/>
        <circle cx="50" cy="50" r="4"  fill="rgba(232,213,163,0.55)"/>
      </svg>
    </div>
  );
}

// ─── SPROCKET ROW ─────────────────────────────────────────────────────────────
function SprocketRow() {
  return (
    <div style={{ display:'flex', justifyContent:'space-around', padding:'5px 6px', background:'#060606', flexShrink:0 }}>
      {Array.from({length:8}).map((_,i)=>(
        <div key={i} style={{ width:14, height:18, borderRadius:3, background:'#000', border:'1px solid #1a1a1a', boxShadow:'inset 0 0 6px #000', flexShrink:0 }}/>
      ))}
    </div>
  );
}

// ─── FRAME DATA ───────────────────────────────────────────────────────────────
const FRAME_HEIGHT = 560;

const FRAME_DATA = [
  {
    id:'reel', label:'01 / REEL', title:'THE WORK',
    render:()=>(
      <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:0}}>
        {[['01','Pushpa 2: The Rule','VFX'],['02','Martin','VFX'],['03','HIT: The Third Case','VFX'],['04','Thug Life','VFX']].map(([n,t,r])=>(
          <div key={n} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #161616'}}>
            <span style={{fontFamily:'var(--font-body)',fontSize:9,letterSpacing:'0.25em',color:'rgba(232,213,163,0.35)'}}>{n}</span>
            <span style={{fontFamily:'var(--font-body)',fontSize:13,color:'rgba(245,240,232,0.85)',letterSpacing:'0.03em'}}>{t}</span>
            <span style={{fontFamily:'var(--font-body)',fontSize:9,letterSpacing:'0.2em',color:'rgba(232,213,163,0.4)',textTransform:'uppercase'}}>{r}</span>
          </div>
        ))}
        <button style={{fontFamily:'var(--font-display)',fontSize:14,letterSpacing:'0.2em',padding:'11px 0',background:'var(--gold)',color:'#000',border:'none',cursor:'none',marginTop:16,width:'100%'}}>▶ WATCH SHOWREEL</button>
      </div>
    ),
  },
  {
    id:'about', label:'02 / ABOUT', title:'THE DIRECTOR',
    render:()=>(
      <div style={{padding:'16px'}}>
        <blockquote style={{fontFamily:'var(--font-accent)',fontStyle:'italic',fontSize:13,color:'var(--gold)',lineHeight:1.65,borderLeft:'2px solid rgba(232,213,163,0.3)',paddingLeft:12,marginBottom:20}}>
          "A hybrid creative who understands both art and execution."
        </blockquote>
        <div style={{display:'flex',justifyContent:'space-around',marginBottom:20}}>
          {[['2','Years VFX'],['2','Years Direction'],['4','Major Films']].map(([n,l])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:40,color:'var(--gold)',lineHeight:1}}>{n}</div>
              <div style={{fontFamily:'var(--font-body)',fontSize:9,letterSpacing:'0.15em',color:'rgba(245,240,232,0.35)',textTransform:'uppercase',marginTop:4,lineHeight:1.4}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center'}}>
          {['Haarika & Hassine','Halohues Studio','Pixelloid VFX','GITAM · B.Tech CSE'].map(b=>(
            <span key={b} style={{fontFamily:'var(--font-body)',fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',padding:'5px 9px',border:'1px solid #222',color:'rgba(245,240,232,0.3)'}}>{b}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id:'pipeline', label:'03 / PIPELINE', title:'THE CRAFT',
    render:()=>(
      <div style={{padding:'12px 16px'}}>
        {[['🎬','ASSOCIATE DIRECTOR','Set coordination · Shot planning · On-set execution · DOP liaison'],
          ['🤖','AI GENERALIST','Previs · AI pipelines · Look development · Audio cleanup'],
          ['✨','VFX ARTIST','Compositing · Light matching · Plate prep · Pipeline QC'],
        ].map(([icon,role,desc])=>(
          <div key={role} style={{display:'flex',gap:12,padding:'13px 0',borderBottom:'1px solid #161616'}}>
            <span style={{fontSize:22,flexShrink:0,lineHeight:1.3}}>{icon}</span>
            <div>
              <div style={{fontFamily:'var(--font-display)',fontSize:15,letterSpacing:'0.1em',marginBottom:5}}>{role}</div>
              <div style={{fontFamily:'var(--font-body)',fontSize:10,color:'rgba(245,240,232,0.38)',lineHeight:1.55}}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id:'credits', label:'04 / CREDITS', title:'EXPERIENCE',
    render:()=>(
      <div style={{padding:'8px 16px'}}>
        {[
          {role:'ASSOCIATE DIRECTOR',studio:'Haarika & Hassine Creations',year:'2025 — Present'},
          {role:'FX ARTIST',studio:'Halohues Studio',year:'2023 — 2025'},
          {role:'VFX TRAINING',studio:'Pixelloid Studios',year:'2023'},
        ].map((c,i)=>(
          <React.Fragment key={i}>
            <div style={{padding:'14px 0',borderBottom:'1px solid #161616',textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:19,letterSpacing:'0.12em',color:'var(--text)',marginBottom:3}}>{c.role}</div>
              <div style={{fontFamily:'var(--font-accent)',fontStyle:'italic',fontSize:13,color:'var(--gold)',marginBottom:2}}>{c.studio}</div>
              <div style={{fontFamily:'var(--font-body)',fontSize:10,color:'rgba(245,240,232,0.28)',letterSpacing:'0.15em'}}>{c.year}</div>
            </div>
            {i<2 && <div style={{textAlign:'center',padding:'5px',color:'rgba(232,213,163,0.18)',fontSize:11}}>— ◆ —</div>}
          </React.Fragment>
        ))}
        <div style={{marginTop:14,textAlign:'center',fontFamily:'var(--font-body)',fontSize:9,letterSpacing:'0.22em',color:'rgba(245,240,232,0.18)',textTransform:'uppercase'}}>B.Tech CSE · GITAM University · 2022</div>
      </div>
    ),
  },
  {
    id:'contact', label:'05 / CONTACT', title:'COLLABORATE',
    render:()=>(
      <div style={{padding:'16px',textAlign:'center'}}>
        <div style={{border:'1px solid #2a2a2a',overflow:'hidden',width:150,margin:'0 auto 18px'}}>
          <div style={{height:22,background:'repeating-linear-gradient(-45deg,#E8D5A3 0px,#E8D5A3 7px,#111 7px,#111 14px)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 10px'}}>
            <span style={{fontFamily:'var(--font-script)',fontSize:9,color:'#000'}}>NITIN</span>
            <span style={{fontFamily:'var(--font-script)',fontSize:9,color:'#000'}}>2025</span>
          </div>
          <div style={{padding:'8px',background:'#111',textAlign:'center'}}>
            <span style={{fontFamily:'var(--font-script)',fontSize:11,color:'rgba(255,255,255,0.55)'}}>PORTFOLIO</span>
          </div>
        </div>
        <div style={{fontFamily:'var(--font-display)',fontSize:19,letterSpacing:'0.1em',marginBottom:14,lineHeight:1.15}}>
          LET'S BUILD<br/><span style={{color:'var(--gold)'}}>SOMETHING CINEMATIC</span>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          {[['LinkedIn','https://linkedin.com/in/nitingadila'],['Email','mailto:contact@nitingadila.com'],['Instagram','https://instagram.com/nitingadila']].map(([l,h])=>(
            <a key={l} href={h} target="_blank" rel="noreferrer" style={{fontFamily:'var(--font-body)',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',padding:'7px 12px',border:'1px solid rgba(232,213,163,0.2)',color:'rgba(245,240,232,0.55)',textDecoration:'none',cursor:'none',display:'block'}}>{l}</a>
          ))}
        </div>
        <a href="mailto:contact@nitingadila.com" style={{display:'inline-block',fontFamily:'var(--font-display)',fontSize:15,letterSpacing:'0.15em',padding:'12px 28px',background:'var(--gold)',color:'#000',textDecoration:'none',cursor:'none'}}>COLLABORATE →</a>
      </div>
    ),
  },
];

// ─── FILM FRAME ───────────────────────────────────────────────────────────────
function FilmFrame({ data, active }) {
  return (
    <div style={{
      height: FRAME_HEIGHT, flexShrink:0,
      display:'flex', flexDirection:'column',
      filter: active ? 'brightness(1) saturate(1)' : 'brightness(0.32) saturate(0)',
      transition:'filter 0.55s ease, border-color 0.55s ease, box-shadow 0.55s ease',
      border: active ? '1.5px solid rgba(232,213,163,0.5)' : '1.5px solid #1c1c1c',
      boxShadow: active ? '0 0 32px rgba(232,213,163,0.14), inset 0 0 24px rgba(0,0,0,0.5)' : 'none',
    }}>
      {/* Header */}
      <div style={{padding:'7px 12px',background:'#060606',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #111',flexShrink:0}}>
        <span style={{fontFamily:'var(--font-display)',fontSize:12,letterSpacing:'0.35em',color:'rgba(232,213,163,0.5)'}}>{data.label}</span>
        <span style={{fontFamily:'var(--font-body)',fontSize:8,letterSpacing:'0.2em',color:'rgba(245,240,232,0.18)',textTransform:'uppercase'}}>NG · 2025</span>
      </div>
      <SprocketRow/>
      {/* Title */}
      <div style={{padding:'10px 14px 6px',background:'#080808',borderBottom:'1px solid #111',flexShrink:0}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:26,letterSpacing:'0.08em',color:'var(--gold)',lineHeight:1}}>{data.title}</div>
      </div>
      {/* Content */}
      <div style={{flex:1,background:'#0a0a0a',overflowY:'hidden'}}>
        {data.render()}
      </div>
      <SprocketRow/>
    </div>
  );
}

// ─── STRIP TAIL ───────────────────────────────────────────────────────────────
function StripTail({ tailRef }) {
  return (
    <div ref={tailRef} style={{ transformOrigin:'top center', background:'linear-gradient(to bottom,#0a0a0a,transparent)', flexShrink:0 }}>
      <SprocketRow/>
      <div style={{height:50,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-body)',fontSize:9,letterSpacing:'0.4em',color:'rgba(245,240,232,0.1)',textTransform:'uppercase'}}>end</div>
    </div>
  );
}

// ─── FRAME COUNTER ────────────────────────────────────────────────────────────
function FrameCounter({ active, visible }) {
  if (!visible) return null;
  return (
    <div style={{ position:'fixed',right:'2.5vw',top:'50%',transform:'translateY(-50%)',display:'flex',flexDirection:'column',gap:10,zIndex:200,pointerEvents:'none' }}>
      {FRAME_DATA.map((_,i)=>(
        <div key={i} style={{
          width:6,height:6,borderRadius:'50%',
          background: i===active ? 'var(--gold)' : '#2a2a2a',
          boxShadow: i===active ? '0 0 8px rgba(232,213,163,0.6)' : 'none',
          transform: i===active ? 'scale(1.6)' : 'scale(1)',
          transition:'all 0.35s ease',
        }}/>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FilmReelScroll() {
  const sectionRef   = useRef(null);
  const reelRef      = useRef(null);
  const stripInnerRef = useRef(null);
  const tailRef      = useRef(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [counterVisible, setCounterVisible] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const kills = [];

    // Reel entrance (before section pins)
    const entryTween = gsap.fromTo(reelRef.current,
      { x:'22vw', y:'-18vh', opacity:0, rotation:-200 },
      { x:0, y:0, opacity:1, rotation:0, ease:'power2.out',
        scrollTrigger:{ trigger:sectionRef.current, start:'top 85%', end:'top top', scrub:1.5 }
      }
    );
    if (entryTween.scrollTrigger) kills.push(entryTween.scrollTrigger);

    // Main scrubbed timeline
    const main = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.8,
      onEnter:     () => setCounterVisible(true),
      onLeave:     () => setCounterVisible(false),
      onEnterBack: () => setCounterVisible(true),
      onLeaveBack: () => setCounterVisible(false),
      onUpdate: (self) => {
        const p = self.progress;

        // Reel rotation: 0 → 1080°
        gsap.set(reelRef.current, { rotation: p * 1080 });

        // Strip sliding: frame 1 at p=0.12, frame 5 at p=0.97
        const slideP = Math.max(0, Math.min(1, (p - 0.12) / 0.85));
        const maxSlide = (FRAME_DATA.length - 1) * FRAME_HEIGHT;
        gsap.set(stripInnerRef.current, { y: -slideP * maxSlide });

        // Active frame
        const fi = Math.min(FRAME_DATA.length - 1, Math.floor(slideP * FRAME_DATA.length));
        setActiveFrame(fi);

        // Tail flap near end
        if (p > 0.93) {
          const tp = (p - 0.93) / 0.07;
          gsap.set(tailRef.current, { rotation: Math.sin(tp * Math.PI * 5) * 7 * (1 - tp) });
        }
      },
    });
    kills.push(main);

    return () => kills.forEach(k => k.kill());
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="reel-section"
        style={{ position:'relative', background:'#080808', minHeight:'620vh' }}
      >
        {/* Full-viewport sticky stage */}
        <div style={{ position:'sticky', top:0, height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>

          {/* Ambient bg gradient */}
          <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, background:'radial-gradient(ellipse at 50% 40%, rgba(232,213,163,0.03) 0%, transparent 70%)', pointerEvents:'none' }}/>

          {/* Reel — upper right */}
          <div style={{ position:'absolute', right:'8vw', top:'12vh', pointerEvents:'none' }}>
            <ReelSVG reelRef={reelRef}/>
          </div>

          {/* Film strip viewport — centered */}
          <div style={{
            overflow:'hidden', height:FRAME_HEIGHT, width:280,
            background:'linear-gradient(to right,#0a0a0a 0%,#111 8%,#0d0d0d 50%,#111 92%,#0a0a0a 100%)',
            borderLeft:'3px solid #1e1e1e', borderRight:'3px solid #1e1e1e',
            boxShadow:'0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(232,213,163,0.04)',
            position:'relative', zIndex:2,
          }}>
            <div ref={stripInnerRef} style={{ willChange:'transform' }}>
              {FRAME_DATA.map((data,i)=>(
                <FilmFrame key={data.id} data={data} active={i===activeFrame}/>
              ))}
              <StripTail tailRef={tailRef}/>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position:'absolute', bottom:'7vh', left:'50%', transform:'translateX(-50%)', fontFamily:'var(--font-body)', fontSize:9, letterSpacing:'0.4em', color:'rgba(232,213,163,0.2)', textTransform:'uppercase', pointerEvents:'none' }}>
            scroll to advance
          </div>
        </div>
      </section>

      <FrameCounter active={activeFrame} visible={counterVisible}/>
    </>
  );
}
