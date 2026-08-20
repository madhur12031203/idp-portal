"use client";

import { ArrowRight, Building2, FileCheck2, Scale, ShieldCheck } from "lucide-react";

const titles: Record<string, string> = {
  overview: "Workforce overview",
  workforce: "Workforce records",
  skills: "Skill intelligence",
  "nine-box": "Talent review",
  succession: "Succession planning",
  development: "Development analytics",
  mentors: "Mentor administration",
  "future-skills": "Future skills",
  fairness: "Responsible access",
  audit: "Audit trail",
};

export function HRPortal({ section }: { section: string }) {
  const title = titles[section] ?? titles.overview;

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span>HR ADMINISTRATION</span>
          <h1>{title}</h1>
          <p>Organization-wide reports will appear after HR connects verified employee, role, training, and approval data.</p>
        </div>
        <button className="primary-action">Configure data sources<ArrowRight size={15} /></button>
      </div>
      <div className="government-quick-actions">
        <article className="panel"><Building2 size={20} /><strong>Departments</strong><span>No department data connected.</span></article>
        <article className="panel"><Scale size={20} /><strong>Policy rules</strong><span>Approval rules need configuration.</span></article>
        <article className="panel"><FileCheck2 size={20} /><strong>Audit trail</strong><span>No official actions recorded yet.</span></article>
      </div>
      <section className="empty-state-panel panel">
        <div className="empty-state-icon"><ShieldCheck size={30} /></div>
        <div>
          <span className="section-kicker">NO MOCK DATA</span>
          <h2>Ready for official government records</h2>
          <p>The dashboards are cleared of sample people, sample scores, and sample workforce metrics. Add approved data sources to populate this view.</p>
        </div>
        <button className="secondary-action">Open governance checklist<ArrowRight size={15} /></button>
      </section>
    </div>
  );
}
