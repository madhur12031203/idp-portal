"use client";

import Link from "next/link";
import { ArrowRight, Building2, FileCheck2, ShieldCheck, UserRound, UsersRound } from "lucide-react";

function ReliableLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return <Link prefetch={false} href={href} className={className} onClick={(event) => { event.preventDefault(); window.location.assign(href); }}>{children}</Link>;
}

export default function Home() {
  return (
    <main className="landing government-landing">
      <header className="government-topbar">
        <div>
          <span>Government Office</span>
          <strong>Individual Development Plan Portal</strong>
        </div>
        <ReliableLink href="/login" className="secondary-action">Sign in<ArrowRight size={15} /></ReliableLink>
      </header>

      <section className="government-hero">
        <div>
          <span className="section-kicker">OFFICIAL RECORDS WORKSPACE</span>
          <h1>Simple development planning for employees, reporting officers, and HR.</h1>
          <p>Use this portal to manage verified skill records, development plans, reviews, and approvals. No demonstration employee data is loaded.</p>
          <div className="hero-actions">
            <ReliableLink className="button button-primary" href="/login">Enter portal<ArrowRight size={16} /></ReliableLink>
            <ReliableLink className="button button-secondary" href="/hr">HR setup<Building2 size={16} /></ReliableLink>
          </div>
        </div>
        <aside className="government-status panel">
          <ShieldCheck size={28} />
          <h2>Ready for official setup</h2>
          <p>Connect approved registers and role catalogues to populate the workspace.</p>
          <ul>
            <li><FileCheck2 size={15} /> No mock data</li>
            <li><ShieldCheck size={15} /> Audit-focused workflow</li>
            <li><Building2 size={15} /> Department-ready structure</li>
          </ul>
        </aside>
      </section>

      <section className="government-role-entry">
        <ReliableLink href="/employee"><UserRound size={22} /><div><small>EMPLOYEE</small><strong>My development records</strong></div><ArrowRight size={16} /></ReliableLink>
        <ReliableLink href="/manager"><UsersRound size={22} /><div><small>REPORTING OFFICER</small><strong>Team review workspace</strong></div><ArrowRight size={16} /></ReliableLink>
        <ReliableLink href="/hr"><Building2 size={22} /><div><small>HR ADMIN</small><strong>Workforce administration</strong></div><ArrowRight size={16} /></ReliableLink>
      </section>
    </main>
  );
}
