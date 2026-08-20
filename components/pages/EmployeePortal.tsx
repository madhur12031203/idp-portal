"use client";

import { ArrowRight, ClipboardList, FilePlus2, FolderOpen, ShieldCheck } from "lucide-react";

const sectionCopy: Record<string, { title: string; subtitle: string; action: string }> = {
  overview: {
    title: "Employee workspace",
    subtitle: "Your official development records will appear here after HR connects verified service, training, and assessment data.",
    action: "Start employee intake",
  },
  skills: {
    title: "Skill profile",
    subtitle: "No verified skill records are connected yet. Add approved certificates, role assessments, or department skill reviews.",
    action: "Add skill record",
  },
  gaps: {
    title: "Skill gaps",
    subtitle: "Gap analysis will be available after a current role and target role are approved by the department.",
    action: "Request role mapping",
  },
  career: {
    title: "Career explorer",
    subtitle: "Career paths will be shown only after official role families are configured.",
    action: "View role catalogue",
  },
  readiness: {
    title: "Readiness",
    subtitle: "Readiness calculations are empty until verified evidence and approval rules are connected.",
    action: "Connect evidence",
  },
  idp: {
    title: "Development plan",
    subtitle: "No individual development plan has been created for this workspace.",
    action: "Create plan",
  },
  learning: {
    title: "Learning",
    subtitle: "Approved learning recommendations will appear here after your department publishes courses.",
    action: "Browse courses",
  },
  mentors: {
    title: "Mentors",
    subtitle: "Mentor matching is empty until mentors are nominated and approved by HR.",
    action: "Request mentor",
  },
  projects: {
    title: "Projects",
    subtitle: "Stretch assignments will appear here after departments publish eligible opportunities.",
    action: "View opportunities",
  },
  simulator: {
    title: "Planning simulator",
    subtitle: "Scenario planning is disabled until official role criteria and development actions are configured.",
    action: "Configure criteria",
  },
  "digital-twin": {
    title: "Skill records",
    subtitle: "This page will show auditable evidence records once employee data sources are connected.",
    action: "Upload evidence",
  },
  progress: {
    title: "Progress",
    subtitle: "Progress tracking starts after an approved development plan is assigned.",
    action: "Review plan status",
  },
};

function EmptyPanel({ title, subtitle, action }: { title: string; subtitle: string; action: string }) {
  return (
    <section className="empty-state-panel panel">
      <div className="empty-state-icon"><FolderOpen size={30} /></div>
      <div>
        <span className="section-kicker">NO OFFICIAL RECORDS</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <button className="primary-action">{action}<ArrowRight size={15} /></button>
    </section>
  );
}

export function EmployeePortal({ section }: { section: string }) {
  const copy = sectionCopy[section] ?? sectionCopy.overview;

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span>EMPLOYEE SERVICES</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <button className="secondary-action"><ShieldCheck size={15} />Official data only</button>
      </div>
      <div className="government-quick-actions">
        <article className="panel"><ClipboardList size={20} /><strong>Submit records</strong><span>Upload approved documents and certificates.</span></article>
        <article className="panel"><FilePlus2 size={20} /><strong>Request review</strong><span>Send updates to the reporting officer.</span></article>
        <article className="panel"><ShieldCheck size={20} /><strong>Audit ready</strong><span>Every change should have a verifiable source.</span></article>
      </div>
      <EmptyPanel {...copy} />
    </div>
  );
}
