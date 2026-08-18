"use client";

import Link from "next/link";
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
          <button
            key={node.id}
            className={`network-node network-node--${node.kind} ${active === node.id ? "is-active" : ""}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onMouseEnter={() => setActive(node.id)}
            onFocus={() => setActive(node.id)}
            onClick={() => setActive(node.id)}
            aria-pressed={active === node.id}
          >
            <span className="node-dot" />
            <span>{node.label}</span>
          </button>
        ))}
        <div className="network-detail" aria-live="polite">
          <span>SELECTED SIGNAL</span>
          <strong>{byId[active].label}</strong>
          <p>{byId[active].detail}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-system-line" aria-hidden="true">
          <span>COREALIGN / TALENT.OS</span>
          <span>INDIVIDUAL → TEAM → WORKFORCE</span>
          <span>SYS.01 / ACTIVE</span>
        </div>
        <div className="hero-identity">
          <p className="eyebrow">TALENT INTELLIGENCE OPERATING SYSTEM</p>
          <h1 className="hero-wordmark" aria-label="CoreAlign"><span>Core</span><span>Align</span></h1>
          <p className="hero-summary">Align people, skills and opportunity.</p>
          <div className="hero-actions">
            <Link prefetch={false} className="button button-primary" href="/login" onClick={(event) => { event.preventDefault(); window.location.assign("/login"); }}>Explore CoreAlign <span aria-hidden="true">↗</span></Link>
            <Link prefetch={false} className="button button-secondary" href="/hr" onClick={(event) => { event.preventDefault(); window.location.assign("/hr"); }}>View workforce intelligence <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="hero-coordinate" aria-hidden="true"><span>18.5204° N</span><span>73.8567° E</span></div>
      </section>

      <section className="talent-map-section" id="intelligence">
        <header>
          <div><span>02 / SIGNAL ARCHITECTURE</span><h2>Talent is not a profile.<br/>It is a living system.</h2></div>
          <p>CoreAlign maps verified capability to roles, development actions and organizational opportunity—then shows the evidence behind every connection.</p>
        </header>
        <TalentNetwork />
        <div className="hero-metrics">
          <div><strong>2,486</strong><span>Employees mapped</span></div>
          <div><strong>78%</strong><span>Average readiness</span></div>
          <div><strong>326</strong><span>Active IDPs</span></div>
          <div><strong>84%</strong><span>Succession coverage</span></div>
        </div>
      </section>
      <section className="platform-story" id="platform">
        <div className="story-intro">
          <span>THE COREALIGN MODEL</span>
          <h2>Understand the person.<br />Explain the path forward.</h2>
          <p>Capability intelligence becomes useful only when it connects evidence, opportunity and measurable development.</p>
        </div>
        <div className="story-sequence">
          {[
            ["01","Understand","Employee capability becomes measurable.","PROFILE"],
            ["02","Align","Map verified strengths against future opportunities.","SKILL INTELLIGENCE"],
            ["03","Develop","Build a personalized 70/20/10 pathway.","PERSONALIZED IDP"],
            ["04","Evolve","Monitor growth and continuously reassess readiness.","CAREER DEVELOPMENT"],
          ].map(([index,title,copy,signal]) => <article key={title}><span>{index}</span><div><small>{signal}</small><h3>{title}</h3><p>{copy}</p></div><i aria-hidden="true">↓</i></article>)}
        </div>
      </section>
      <section className="landing-role-entry" id="about">
        <div><span>THREE PERSPECTIVES · ONE TALENT SYSTEM</span><h2>Move from individual potential to organizational readiness.</h2></div>
        <div className="entry-links">
          <Link href="/employee"><small>EMPLOYEE</small><strong>My development</strong><span>→</span></Link>
          <Link href="/manager"><small>MANAGER</small><strong>Team intelligence</strong><span>→</span></Link>
          <Link href="/hr"><small>HR / TALENT</small><strong>Workforce intelligence</strong><span>→</span></Link>
        </div>
      </section>
      <footer className="landing-footer"><strong>CoreAlign</strong><span>Talent Intelligence Operating System</span><small>SIH · ENTERPRISE PROTOTYPE · 2026</small></footer>
    </main>
  );
}
