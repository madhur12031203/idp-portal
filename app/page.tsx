"use client";

import Link from "next/link";
import { BriefcaseBusiness, Boxes, UserRound } from "lucide-react";
import { useState } from "react";

const nodes = [
  { id: "profile", label: "Employee profile", detail: "Aarav Mehta · Senior Electrical Engineer", x: 46, y: 44, kind: "core" },
  { id: "leadership", label: "Leadership", detail: "2.4 current · 4.1 target", x: 15, y: 22, kind: "skill" },
  { id: "power", label: "Power systems", detail: "4.6 proficiency · verified", x: 69, y: 17, kind: "skill" },
  { id: "role", label: "Project Manager", detail: "72% readiness · 4–6 months", x: 74, y: 52, kind: "role" },
  { id: "mentor", label: "Mentor match", detail: "Ananya Rao · 92% compatibility", x: 18, y: 70, kind: "action" },
  { id: "idp", label: "Personalized IDP", detail: "6 months · 64% complete", x: 55, y: 79, kind: "action" },
];

const connections = [
  ["profile", "leadership"], ["profile", "power"], ["profile", "role"],
  ["profile", "mentor"], ["profile", "idp"], ["role", "idp"],
];

function TalentNetwork() {
  const [active, setActive] = useState("profile");
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  return (
    <div className="talent-network" aria-label="Interactive relationship map connecting an employee profile with skills, a target role, mentor, and development plan">
      <div className="network-kicker">LIVE TALENT MAP <span>06 SIGNALS</span></div>
      <div className="network-canvas">
        {connections.map(([from, to]) => {
          const a = byId[from]; const b = byId[to];
          const dx = b.x - a.x; const dy = b.y - a.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          return <span key={`${from}-${to}`} className={`network-line ${active === from || active === to ? "is-active" : ""}`} style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${length.toFixed(3)}%`, transform: `rotate(${angle.toFixed(3)}deg)` }} />;
        })}
        {nodes.map((node) => (
          <button key={node.id} className={`network-node network-node--${node.kind} ${active === node.id ? "is-active" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} onMouseEnter={() => setActive(node.id)} onFocus={() => setActive(node.id)} onClick={() => setActive(node.id)} aria-pressed={active === node.id}>
            <span className="node-dot" /><span>{node.label}</span>
          </button>
        ))}
        <div className="network-detail" aria-live="polite"><span>SELECTED SIGNAL</span><strong>{byId[active].label}</strong><p>{byId[active].detail}</p></div>
      </div>
    </div>
  );
}

function ReliableLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return <Link prefetch={false} href={href} className={className} onClick={(event) => { event.preventDefault(); window.location.assign(href); }}>{children}</Link>;
}

function SystemCard({ label, code, type }: { label: string; code: string; type: "employee" | "skill" | "role" }) {
  const Icon = type === "employee" ? UserRound : type === "skill" ? Boxes : BriefcaseBusiness;
  return <div className={`system-card system-card--${type}`}><span className="system-icon"><Icon size={31} strokeWidth={1.35} /></span><strong>{label}</strong><small>{code}</small></div>;
}

export default function Home() {
  return (
    <main className="landing landing-v3">
      <section className="hero blueprint-hero">
        <span className="blueprint-corner corner-tl" aria-hidden="true" /><span className="blueprint-corner corner-tr" aria-hidden="true" /><span className="blueprint-corner corner-bl" aria-hidden="true" /><span className="blueprint-corner corner-br" aria-hidden="true" />
        <div className="blueprint-meta meta-left"><strong>SYS.COORD / COREALIGN</strong><span>X: 0.00&nbsp;&nbsp;Y: 0.00&nbsp;&nbsp;Z: 0.00</span></div>
        <div className="blueprint-meta meta-right"><strong>GRID: 8PX&nbsp;&nbsp;UNIT: SYS</strong><span>MODE: RELATIONSHIP</span></div>
        <div className="axis-labels" aria-hidden="true">{[".00", ".10", ".20", ".30", ".40", ".50", ".60", ".70", ".80", ".90", "1.00"].map((value) => <span key={value}>{value}</span>)}</div>

        <div className="blueprint-identity">
          <div className="core-lockup"><h1 aria-label="CoreAlign"><span>Core</span><span>Align</span></h1><div className="signal-bars" aria-hidden="true"><i/><i/><i/><i/></div></div>
          <p>Talent Intelligence Operating System</p>
          <div className="blueprint-actions">
            <ReliableLink className="button button-primary" href="/login">Enter CoreAlign <span aria-hidden="true">↗</span></ReliableLink>
            <ReliableLink className="button button-secondary" href="/hr">Workspace intelligence <span aria-hidden="true">→</span></ReliableLink>
          </div>
        </div>

        <div className="hero-system-map" aria-label="CoreAlign connects employee, skill, and role intelligence">
          <div className="system-rail rail-top" /><div className="system-rail rail-bottom" />
          <SystemCard type="employee" label="Employee" code="E:01 — E:8562" />
          <SystemCard type="skill" label="Skill" code="S:01 — S:2746" />
          <SystemCard type="role" label="Role" code="R:01 — R:1240" />
        </div>
        <div className="blueprint-coordinate" aria-hidden="true">X: 1.00&nbsp;&nbsp;Y: 1.00&nbsp;&nbsp;Z: 0.00</div>
      </section>

      <section className="talent-map-section" id="intelligence">
        <header><div><span>02 / SIGNAL ARCHITECTURE</span><h2>Talent is not a profile.<br/>It is a living system.</h2></div><p>CoreAlign maps verified capability to roles, development actions and organizational opportunity—then shows the evidence behind every connection.</p></header>
        <TalentNetwork />
        <div className="hero-metrics"><div><strong>2,486</strong><span>Employees mapped</span></div><div><strong>78%</strong><span>Average readiness</span></div><div><strong>326</strong><span>Active IDPs</span></div><div><strong>84%</strong><span>Succession coverage</span></div></div>
      </section>

      <section className="platform-story" id="platform">
        <div className="story-intro"><span>THE COREALIGN MODEL</span><h2>Understand the person.<br />Explain the path forward.</h2><p>Capability intelligence becomes useful only when it connects evidence, opportunity and measurable development.</p></div>
        <div className="story-sequence">{[["01","Understand","Employee capability becomes measurable.","PROFILE"],["02","Align","Map verified strengths against future opportunities.","SKILL INTELLIGENCE"],["03","Develop","Build a personalized 70/20/10 pathway.","PERSONALIZED IDP"],["04","Evolve","Monitor growth and continuously reassess readiness.","CAREER DEVELOPMENT"]].map(([index,title,copy,signal]) => <article key={title}><span>{index}</span><div><small>{signal}</small><h3>{title}</h3><p>{copy}</p></div><i aria-hidden="true">↓</i></article>)}</div>
      </section>

      <section className="landing-role-entry" id="about">
        <div><span>THREE PERSPECTIVES · ONE TALENT SYSTEM</span><h2>One organization.<br/>Three intelligent perspectives.</h2></div>
        <div className="entry-links"><ReliableLink href="/employee"><small>EMPLOYEE</small><strong>My development</strong><span>→</span></ReliableLink><ReliableLink href="/manager"><small>MANAGER</small><strong>Team intelligence</strong><span>→</span></ReliableLink><ReliableLink href="/hr"><small>HR / TALENT</small><strong>Workforce intelligence</strong><span>→</span></ReliableLink></div>
      </section>
      <footer className="landing-footer"><strong>CoreAlign</strong><span>Talent Intelligence Operating System</span><small>SIH · ENTERPRISE PROTOTYPE · 2026</small></footer>
    </main>
  );
}
