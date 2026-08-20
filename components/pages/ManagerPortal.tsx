"use client";

import { ArrowRight, ClipboardCheck, FileSearch, UsersRound } from "lucide-react";

const titles: Record<string, string> = {
  overview: "Team workspace",
  team: "Team records",
  skills: "Skill intelligence",
  readiness: "Readiness review",
  idps: "Development plans",
  mentoring: "Mentoring",
  talent: "Talent map",
};

export function ManagerPortal({ section }: { section: string }) {
  const title = titles[section] ?? titles.overview;

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span>REPORTING OFFICER VIEW</span>
          <h1>{title}</h1>
          <p>No team records are loaded. Connect the approved employee register to review staff development, skill gaps, and plan status.</p>
        </div>
        <button className="primary-action">Import employee register<ArrowRight size={15} /></button>
      </div>
      <div className="government-quick-actions">
        <article className="panel"><UsersRound size={20} /><strong>Employee register</strong><span>Waiting for verified department records.</span></article>
        <article className="panel"><ClipboardCheck size={20} /><strong>Approval queue</strong><span>No pending development approvals.</span></article>
        <article className="panel"><FileSearch size={20} /><strong>Review history</strong><span>Audit records will appear after first review.</span></article>
      </div>
      <section className="empty-state-panel panel">
        <div className="empty-state-icon"><UsersRound size={30} /></div>
        <div>
          <span className="section-kicker">NO TEAM DATA</span>
          <h2>Connect official records to begin</h2>
          <p>This page is intentionally empty because all demonstration names, scores, and charts have been removed.</p>
        </div>
        <button className="secondary-action">Open setup checklist<ArrowRight size={15} /></button>
      </section>
    </div>
  );
}
