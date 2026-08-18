"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from "@xyflow/react";
import {
  ArrowRight, BookOpen, CalendarDays, Check, ChevronRight, CircleCheck, Clock3,
  FileCheck2, Info, Network, Plus, RotateCcw, Sparkles, Target, TrendingUp, UserRoundCheck, X,
} from "lucide-react";
import { idpTimeline, learning, mentors, projects, readinessFactors, skillProfile } from "@/data/mock-data";
import { MiniBars, ProgressChart, ReadinessRing, SkillRadar } from "@/components/visuals/Charts";

function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="page-header"><div><span>{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

function Overview() {
  return <div className="page-stack">
    <PageHeader eyebrow="EMPLOYEE DEVELOPMENT" title="Good morning, Aarav." subtitle="Here is how your development is progressing toward Project Manager." action={<button className="primary-action">Review development plan <ArrowRight size={16}/></button>} />
    <section className="readiness-hero panel">
      <div className="readiness-primary"><div><span className="section-kicker">ROLE READINESS</span><h2>What is moving you toward readiness?</h2><p>Strong technical depth continues to offset leadership and project-governance gaps.</p></div><ReadinessRing /></div>
      <div className="readiness-breakdown"><MiniBars data={[{name:"Technical",value:84},{name:"Leadership",value:61},{name:"Management",value:58},{name:"Experience",value:82},{name:"Training",value:68}]} /><div className="insight-inline"><TrendingUp size={16}/><span><strong>+6% over 90 days</strong> after completing Project Governance Fundamentals.</span></div></div>
    </section>
    <div className="overview-grid">
      <section className="panel progress-card"><div className="panel-title"><div><span className="section-kicker">READINESS OVER TIME</span><h2>Momentum is sustained</h2></div><span className="quiet-badge">6 months</span></div><ProgressChart compact /><div className="chart-note"><CircleCheck size={15}/><span>Next milestone: Cross-functional grid project · 35% complete</span></div></section>
      <section className="panel development-summary"><div className="panel-title"><div><span className="section-kicker">DEVELOPMENT SUMMARY</span><h2>Two gaps require attention</h2></div></div><div className="metric-strip"><Metric label="Critical gaps" value="2"/><Metric label="IDP completion" value="64%"/><Metric label="Active mentor" value="1"/><Metric label="Current learning" value="3"/></div><div className="ai-insight"><Sparkles size={16}/><p><strong>Highest-impact focus</strong>Leadership and project governance remain your highest-impact development opportunities.</p></div></section>
    </div>
  </div>;
}

function Skills() {
  const [skill, setSkill] = useState<(typeof skillProfile)[0] | null>(null);
  return <div className="page-stack"><PageHeader eyebrow="VERIFIED CAPABILITY" title="Skill architecture" subtitle="A consolidated view of proficiency, evidence confidence, and target-role expectations." />
    <section className="panel skill-architecture"><div className="skill-legend"><span><i className="current-key"/>Current</span><span><i className="target-key"/>Target role</span></div>{skillProfile.map((item) => <button className="skill-row" key={item.name} onClick={() => setSkill(item)}><div><strong>{item.name}</strong><small>{item.category} · {item.evidence} evidence sources</small></div><div className="skill-track"><i className="skill-target-marker" style={{left:`${item.target/5*100}%`}}/><span style={{width:`${item.value/5*100}%`}}/></div><b>{item.value.toFixed(1)}</b><span className="confidence">{item.confidence}% confidence</span><ChevronRight size={16}/></button>)}</section>
    <AnimatePresence>{skill && <motion.aside className="context-drawer" initial={{x:420}} animate={{x:0}} exit={{x:420}} role="dialog" aria-modal="true" aria-label={`${skill.name} evidence`}><div className="drawer-head"><div><span>SKILL EVIDENCE</span><h2>{skill.name}</h2></div><button className="icon-button" onClick={()=>setSkill(null)} aria-label="Close skill evidence"><X size={18}/></button></div><div className="drawer-body"><div className="evidence-score"><strong>{skill.value}</strong><span>/ 5 proficiency</span><small>{skill.confidence}% confidence</small></div><h3>Evidence timeline</h3>{["Manager assessment","Cross-functional grid project","Leadership workshop","Peer feedback","Performance review"].map((e,i)=><div className="evidence-item" key={e}><i/><div><strong>{e}</strong><small>{i===0?"2 weeks ago":`${i+1} months ago`} · verified signal</small></div></div>)}<div className="timeline-mini"><span style={{height:"54%"}}/><span style={{height:"63%"}}/><span style={{height:"70%"}}/><span style={{height:`${skill.value/5*100}%`}}/></div></div></motion.aside>}</AnimatePresence>
  </div>;
}

function Gaps() {
  const [filter,setFilter]=useState("All");
  const gaps=[{name:"Leadership",from:2.4,to:4.1,type:"Critical",gap:1.7},{name:"Project Management",from:2.7,to:4.3,type:"Critical",gap:1.6},{name:"Stakeholder Management",from:3,to:4.4,type:"Important",gap:1.4},{name:"Risk Management",from:3.1,to:4,type:"Important",gap:.9}].filter(g=>filter==="All"||g.type===filter);
  return <div className="page-stack"><PageHeader eyebrow="TARGET ROLE · PROJECT MANAGER" title="Where are your largest capability gaps?" subtitle="Current verified capability compared with the competency profile required for your target role." />
    <div className="two-column-main"><section className="panel radar-panel"><div className="panel-title"><div><span className="section-kicker">CAPABILITY COMPARISON</span><h2>Current profile vs target role</h2></div><div className="legend"><span><i className="dot navy"/>Current</span><span><i className="dot brick"/>Required</span></div></div><SkillRadar/><div className="chart-table-alt">Technical capability exceeds the requirement. Leadership and project management are the widest gaps.</div></section>
    <section className="panel gap-list"><div className="filter-row">{["All","Critical","Important"].map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}</div>{gaps.map(g=><div className="gap-item" key={g.name}><div><span className={`severity ${g.type.toLowerCase()}`}>{g.type}</span><strong>{g.name}</strong></div><div className="comparison-bars"><span>Current <i><b style={{width:`${g.from/5*100}%`}}/></i>{g.from}</span><span>Target <i><b style={{width:`${g.to/5*100}%`}}/></i>{g.to}</span></div><small>Gap {g.gap.toFixed(1)} · high projected IDP impact</small></div>)}</section></div>
  </div>;
}

const careerNodes: Node[] = [
  { id:"1",position:{x:40,y:150},data:{label:"Electrical Engineer\n100% · Current"},className:"flow-node current" },
  { id:"2",position:{x:250,y:150},data:{label:"Senior Electrical Engineer\n94% · Current role"},className:"flow-node current" },
  { id:"3",position:{x:500,y:35},data:{label:"Technical Lead\n87% · 3–5 months"},className:"flow-node recommended" },
  { id:"4",position:{x:500,y:150},data:{label:"Project Manager\n72% · 4–6 months"},className:"flow-node recommended" },
  { id:"5",position:{x:500,y:265},data:{label:"Smart Grid Specialist\n83% · 3–4 months"},className:"flow-node stretch" },
  { id:"6",position:{x:760,y:150},data:{label:"Engineering Manager\n61% · 12–18 months"},className:"flow-node longterm" },
];
const careerEdges: Edge[] = [["1","2"],["2","3"],["2","4"],["2","5"],["3","6"],["4","6"],["5","6"]].map(([source,target],i)=>({id:`e${i}`,source,target,markerEnd:{type:MarkerType.ArrowClosed,color:"#a8aaa6"},style:{stroke:"#bfc1bd",strokeWidth:1.4}}));

function Career() {
  const [selected,setSelected]=useState("4"); const node=careerNodes.find(n=>n.id===selected)!;
  return <div className="page-stack"><PageHeader eyebrow="CAREER INTELLIGENCE" title="Explore where your capability can lead" subtitle="Role relationships are based on skill adjacency, experience evidence, and organizational opportunities." action={<button className="secondary-action"><RotateCcw size={15}/>Reset graph</button>} />
    <section className="panel career-panel"><div className="flow-legend"><span><i className="line-solid"/>Current</span><span><i className="line-double"/>Recommended</span><span><i className="line-dashed"/>Stretch</span></div><div className="career-flow"><ReactFlow nodes={careerNodes} edges={careerEdges} fitView onNodeClick={(_,n)=>setSelected(n.id)} nodesDraggable panOnDrag zoomOnScroll><Background color="#e5e5df" gap={24}/><Controls showInteractive={false}/></ReactFlow></div><div className="role-detail"><span>SELECTED PATH</span><h3>{String(node.data.label).split("\n")[0]}</h3><p>{selected==="4"?"Your operational depth transfers strongly. Leadership and project governance are the primary constraints.":"This role shares strong skill adjacency with your verified profile."}</p><div><Metric label="Role match" value={String(node.data.label).match(/\d+%/)?.[0]||"72%"}/><Metric label="Critical gaps" value={selected==="4"?"2":"3"}/></div><button className="primary-action">Explore role <ArrowRight size={15}/></button></div></section>
  </div>;
}

function Readiness() { return <div className="page-stack"><PageHeader eyebrow="EXPLAINABLE ROLE READINESS" title="Why is my readiness 72%?" subtitle="A transparent breakdown of the evidence increasing readiness and the constraints holding it back." />
  <div className="readiness-layout"><section className="panel readiness-score-panel"><ReadinessRing/><div className="confidence-block"><span>MODEL CONFIDENCE</span><strong>88%</strong><p>Based on 42 verified profile and role signals.</p></div></section><section className="panel factor-panel"><div className="panel-title"><div><span className="section-kicker">FACTOR CONTRIBUTION</span><h2>What contributes to readiness?</h2></div></div>{readinessFactors.map(f=><div className="factor-row" key={f.name}><span>{f.name}</span><div className={f.kind}><i style={{width:`${Math.abs(f.value)/18*100}%`}}/></div><b>{f.value>0?"+":""}{f.value}</b></div>)}<div className="explain-callout"><Info size={16}/><p><strong>Decision-support explanation</strong>Strong technical competency and operational experience contribute most. Leadership remains the largest constraint.</p></div></section></div>
  </div>; }

function IDP() {
  const [regenerating,setRegenerating]=useState(false);
  return <div className="page-stack"><PageHeader eyebrow="6-MONTH PATHWAY · PROJECT MANAGER" title="Personal Development Plan" subtitle="A personalized 70/20/10 pathway targeting your highest-impact role-readiness gaps." action={<button disabled={regenerating} className="secondary-action" onClick={()=>{setRegenerating(true);setTimeout(()=>setRegenerating(false),900)}}><Sparkles size={15}/>{regenerating?"Rebuilding plan...":"Regenerate plan"}</button>} />
    <section className="panel idp-composition"><div><span>70</span><strong>Experience</strong><p>Stretch project · cross-functional assignment · project ownership</p></div><div><span>20</span><strong>Social</strong><p>Mentoring · peer learning · leadership shadowing</p></div><div><span>10</span><strong>Formal</strong><p>Courses · certification · assessment workshop</p></div></section>
    <section className="panel idp-roadmap"><div className="panel-title"><div><span className="section-kicker">DEVELOPMENT ROADMAP</span><h2>From action to reassessment</h2></div><span className="progress-pill">64% complete</span></div><div className="timeline">{idpTimeline.map((item,i)=><div className="timeline-item" key={item.month}><div className="timeline-marker">{item.status==="Complete"?<Check size={14}/>:i+1}</div><div className="timeline-copy"><span>{item.month} · {item.status}</span><h3>{item.title}</h3><p>{item.skill}</p></div><div className="timeline-progress"><div><i style={{width:`${item.progress}%`}}/></div><span>{item.progress}%</span></div><b>{item.impact}</b></div>)}</div></section>
  </div>;
}

function Learning() { const [selected,setSelected]=useState<string|null>(null); return <div className="page-stack"><PageHeader eyebrow="CURATED DEVELOPMENT" title="Learning recommendations" subtitle="Resources are ranked by skill-gap relevance, evidence strength, and projected readiness impact." />
  <div className="horizontal-cards">{learning.map((item,i)=><article className="learning-card panel" key={item.title}><div className="card-top"><span>0{i+1}</span><b>{item.match}% relevance</b></div><BookOpen size={22}/><h2>{item.title}</h2><p>{item.provider}</p><div className="course-meta"><span>{item.duration}</span><span>{item.level}</span></div><strong>{item.skills}</strong><button className="text-action" onClick={()=>setSelected(selected===item.title?null:item.title)}>Why recommended <ChevronRight size={15}/></button>{selected===item.title&&<motion.div className="why-box" initial={{height:0}} animate={{height:"auto"}}>Builds your Leadership and Project Management constraints with strong evidence transfer to the target role.</motion.div>}</article>)}</div></div>; }

function Mentors() { const [requested,setRequested]=useState<string[]>([]); return <div className="page-stack"><PageHeader eyebrow="SOCIAL DEVELOPMENT" title="Mentor matches" subtitle="Compatibility is based on your capability gaps, mentor expertise, outcomes, and available capacity." />
  <div className="mentor-grid">{mentors.map(m=><article className="panel mentor-card" key={m.name}><div className="mentor-head"><div className="avatar avatar--mentor">{m.initials}</div><div><h2>{m.name}</h2><p>{m.role}</p></div><div className="match-score"><strong>{m.match}%</strong><span>match</span></div></div><div className="overlap-label"><span>Your gaps</span><span>Mentor strength</span></div>{m.expertise.map((s,i)=><div className="overlap-bar" key={s}><span>{s}</span><i><b style={{width:`${58+i*9}%`}}/><em style={{width:`${84-i*5}%`}}/></i></div>)}<div className="mentor-stats"><Metric label="Capacity" value={`${m.capacity} h/mo`}/><Metric label="Outcomes" value={`${m.success}%`}/></div><button className={requested.includes(m.name)?"secondary-action full":"primary-action full"} onClick={()=>setRequested(v=>v.includes(m.name)?v:[...v,m.name])}>{requested.includes(m.name)?<><Check size={15}/>Request sent</>:<>Request mentorship <ArrowRight size={15}/></>}</button></article>)}</div></div>; }

function Projects() { const [added,setAdded]=useState<string[]>([]); return <div className="page-stack"><PageHeader eyebrow="70% EXPERIENCE" title="Stretch assignments" subtitle="Internal opportunities ranked by skill development impact and target-role relevance." />
  <div className="project-grid">{projects.map(p=><article className="panel project-card" key={p.title}><div className="project-signal"><span>{p.impact} career impact</span><b>{p.readiness}% readiness required</b></div><h2>{p.title}</h2><p>{p.team}</p><div className="project-duration"><CalendarDays size={15}/>{p.duration}</div><div className="skill-chips">{p.skills.map(s=><span key={s}>{s}</span>)}</div><div className="impact-strip">{p.skills.map((s,i)=><i key={s} style={{width:`${28+i*8}%`}}/>)}</div><button className={added.includes(p.title)?"secondary-action full":"primary-action full"} onClick={()=>setAdded(v=>v.includes(p.title)?v.filter(x=>x!==p.title):[...v,p.title])}>{added.includes(p.title)?<><Check size={15}/>Added to IDP</>:<><Plus size={15}/>Add to IDP</>}</button></article>)}</div></div>; }

function Simulator() {
  const actions=[{name:"Complete Project Management Certification",gain:6},{name:"Join mentor program",gain:8},{name:"Lead cross-functional project",gain:6},{name:"Complete leadership assessment",gain:5}];
  const [selected,setSelected]=useState([true,true,true,false]); const readiness=62+selected.reduce((sum,on,i)=>sum+(on?actions[i].gain:0),0);
  return <div className="page-stack"><PageHeader eyebrow="CAREER SCENARIO LAB" title="What changes your career trajectory?" subtitle="Explore how development actions could influence readiness. Projections support planning; they are not promotion decisions." action={<button className="secondary-action" onClick={()=>setSelected([false,false,false,false])}><RotateCcw size={15}/>Reset</button>} />
    <section className="panel simulator"><div className="sim-score"><span>SCENARIO READINESS</span><motion.strong key={readiness} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>{readiness}%</motion.strong><div className="sim-comparison"><span><b>62%</b>Before</span><ArrowRight/><span><b>{readiness}%</b>Scenario</span><span className="improvement"><b>+{readiness-62}%</b>Improvement</span></div><div className="time-shift"><Clock3 size={17}/><div><span>Estimated readiness</span><strong>{readiness>=80?"5 months":readiness>=72?"7 months":"10 months"}</strong></div></div></div><div className="scenario-actions"><h2>Development actions</h2><p>Toggle actions to update the projection.</p>{actions.map((a,i)=><button key={a.name} className={selected[i]?"selected":""} onClick={()=>setSelected(v=>v.map((x,j)=>j===i?!x:x))}><span className="checkbox">{selected[i]&&<Check size={14}/>}</span><span><strong>{a.name}</strong><small>Projected readiness impact +{a.gain}%</small></span></button>)}<div className="responsible-note"><Info size={15}/>Scenario estimates use current evidence and are not guarantees.</div></div></section>
  </div>;
}

function DigitalTwin() {
  const nodes:Node[]=[{id:"a",position:{x:330,y:170},data:{label:"Aarav Mehta\nSkill Digital Twin"},className:"flow-node twin-core"},{id:"s",position:{x:40,y:50},data:{label:"Skills\n6 verified"},className:"flow-node"},{id:"p",position:{x:40,y:280},data:{label:"Projects\n7 signals"},className:"flow-node"},{id:"as",position:{x:650,y:30},data:{label:"Assessments\n4 signals"},className:"flow-node"},{id:"c",position:{x:670,y:170},data:{label:"Certifications\n3 verified"},className:"flow-node"},{id:"f",position:{x:650,y:310},data:{label:"Feedback\n12 signals"},className:"flow-node"}];
  const edges:Edge[]=["s","p","as","c","f"].map((source,i)=>({id:`t${i}`,source,target:"a",animated:i===2,style:{stroke:"#9ca9a2"}}));
  return <div className="page-stack"><PageHeader eyebrow="EVIDENCE GRAPH" title="Your skill digital twin" subtitle="Explore the evidence explaining why CoreAlign believes each capability exists." /><section className="panel twin-panel"><div className="twin-flow"><ReactFlow nodes={nodes} edges={edges} fitView><Background color="#e3e3de" gap={24}/><Controls showInteractive={false}/></ReactFlow></div><div className="twin-caption"><Network size={17}/><p><strong>42 evidence signals connected</strong>Select a node to inspect proficiency, confidence, source, and recency.</p></div></section></div>;
}

function Progress() { return <div className="page-stack"><PageHeader eyebrow="DEVELOPMENT OUTCOMES" title="Readiness over time" subtitle="Milestones, evidence updates, and verified capability improvement across your development journey." /><section className="panel progress-large"><div className="panel-title"><div><span className="section-kicker">JANUARY — JUNE</span><h2>Readiness increased 14 percentage points</h2></div><span className="positive-badge"><TrendingUp size={14}/>+24% relative growth</span></div><ProgressChart/><div className="milestone-row"><span><FileCheck2 size={15}/>Course completed · Mar</span><span><UserRoundCheck size={15}/>Mentor assigned · Apr</span><span><Target size={15}/>Project completed · Jun</span></div></section><div className="metric-strip panel"><Metric label="Skills improved" value="7"/><Metric label="IDP completion" value="64%"/><Metric label="Courses completed" value="3"/><Metric label="Projects completed" value="2"/></div></div>; }

export function EmployeePortal({ section }: { section: string }) {
  switch(section){case"skills":return <Skills/>;case"gaps":return <Gaps/>;case"career":return <Career/>;case"readiness":return <Readiness/>;case"idp":return <IDP/>;case"learning":return <Learning/>;case"mentors":return <Mentors/>;case"projects":return <Projects/>;case"simulator":return <Simulator/>;case"digital-twin":return <DigitalTwin/>;case"progress":return <Progress/>;default:return <Overview/>;}
}
