"use client";

import { ArrowRight, Building2, FileCheck2, Scale, ShieldCheck, Upload, Users } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

type Skill = { id?: string; name: string; category?: string | null; current: number; target: number; gap?: number; evidence?: string | null };
type WorkforceEmployee = {
  id: string;
  employee_code: string;
  email: string;
  full_name: string;
  designation: string;
  grade: string | null;
  status: string;
  department: { name: string; code: string } | null;
  skills: Skill[];
};

const titles: Record<string, string> = {
  overview: "Workforce overview",
  workforce: "Workforce records",
  import: "Data import",
  skills: "Skill intelligence",
  "nine-box": "Talent review",
  succession: "Succession planning",
  development: "Development analytics",
  mentors: "Mentor administration",
  "future-skills": "Future skills",
  fairness: "Responsible access",
  audit: "Audit trail",
};

const sampleJson = JSON.stringify({
  employees: [
    {
      email: "employee.one@department.gov",
      full_name: "Employee One",
      password: "ChangeMe123!",
      employee_code: "EMP-001",
      designation: "Program Officer",
      grade: "Level 6",
      status: "active",
      joining_date: "2024-04-01",
      department: { code: "DPT-HR", name: "Human Resources" },
      roles: ["employee"],
      skills: [
        { name: "Policy analysis", category: "Governance", current: 68, target: 85, evidence: "Internal assessment" },
        { name: "Data reporting", category: "Digital", current: 54, target: 80, evidence: "Dashboard project" },
        { name: "Stakeholder communication", category: "Leadership", current: 76, target: 90 }
      ]
    },
    {
      email: "manager.one@department.gov",
      full_name: "Manager One",
      password: "ChangeMe123!",
      employee_code: "MGR-001",
      designation: "Reporting Officer",
      grade: "Level 9",
      status: "active",
      department: { code: "DPT-HR", name: "Human Resources" },
      roles: ["employee", "manager"],
      skills: [
        { name: "People review", category: "Leadership", current: 82, target: 92 },
        { name: "Mentoring", category: "Development", current: 70, target: 88 },
        { name: "Workforce planning", category: "HR", current: 64, target: 86 }
      ]
    }
  ]
}, null, 2);

function token() {
  return typeof window === "undefined" ? null : localStorage.getItem("idp_access_token");
}

function errorMessage(value: unknown) {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${token()}` } });
  if (!response.ok) throw await response.json().catch(() => new Error(`Request failed: ${response.status}`));
  return response.json();
}

function SkillBars({ skills }: { skills: Skill[] }) {
  if (!skills.length) return <p className="muted-copy">No skills imported yet.</p>;
  return <div className="skill-bars">{skills.map((skill) => <div className="skill-bar-row" key={skill.name}><div className="skill-bar-head"><strong>{skill.name}</strong><span>{skill.current}% / {skill.target}% target</span></div><div className="dual-bar"><i style={{ width: `${Math.min(skill.target, 100)}%` }} /><b style={{ width: `${Math.min(skill.current, 100)}%` }} /></div><small>{skill.category ?? "Uncategorized"}{skill.gap ? ` - gap ${skill.gap}%` : " - target met"}</small></div>)}</div>;
}

function ImportPanel({ onImported }: { onImported: () => void }) {
  const [value, setValue] = useState(sampleJson);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const readFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setValue(await file.text());
  };

  const submit = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const parsed = JSON.parse(value);
      const response = await fetch(`${API_BASE}/hr/workforce/import-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(parsed),
      });
      const result = await response.json();
      if (!response.ok) throw result?.detail ?? result;
      const skillCount = result.items?.reduce((sum: number, item: { skills_imported?: number }) => sum + (item.skills_imported ?? 0), 0) ?? 0;
      setMessage(`Imported ${result.items?.length ?? 0} people and ${skillCount} skill records. Created users: ${result.created_users}. Updated users: ${result.updated_users}.`);
      onImported();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  };

  return <section className="panel data-import-panel"><div className="panel-title"><div><span className="section-kicker">JSON TEST DATA</span><h2>Upload employee profile data</h2></div><label className="secondary-action"><Upload size={15} />Choose JSON<input type="file" accept="application/json,.json" onChange={readFile} hidden /></label></div><textarea value={value} onChange={(event) => setValue(event.target.value)} spellCheck={false} aria-label="Employee JSON import" />{message && <p className="form-success">{message}</p>}{error && <pre className="form-error">{error}</pre>}<button className="primary-action" type="button" onClick={submit} disabled={loading}>{loading ? "Importing..." : "Import employee profiles"}<ArrowRight size={15} /></button></section>;
}

function WorkforcePanel({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<WorkforceEmployee[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<{ items: WorkforceEmployee[] }>("/hr/workforce").then((result) => setItems(result.items ?? [])).catch((caught) => setError(errorMessage(caught)));
  }, [refreshKey]);

  if (error) return <section className="empty-state-panel panel"><div className="empty-state-icon"><ShieldCheck size={30} /></div><div><span className="section-kicker">WORKFORCE ERROR</span><h2>Could not load workforce</h2><p>{error}</p></div></section>;
  if (!items.length) return <section className="empty-state-panel panel"><div className="empty-state-icon"><Users size={30} /></div><div><span className="section-kicker">NO PEOPLE IMPORTED</span><h2>Upload JSON to populate Workforce</h2><p>Imported employees and their skills will appear here with current and target skill bars.</p></div></section>;

  return <section className="workforce-grid">{items.map((employee) => <article className="panel workforce-card" key={employee.id}><div className="workforce-card-head"><div><span className="section-kicker">{employee.employee_code}</span><h2>{employee.full_name}</h2><p>{employee.designation}</p></div><strong>{employee.skills.length} skills</strong></div><div className="workforce-meta"><span>{employee.department ? `${employee.department.name} (${employee.department.code})` : "No department"}</span><span>{employee.grade ?? "No grade"}</span><span>{employee.status}</span></div><SkillBars skills={employee.skills} /></article>)}</section>;
}

export function HRPortal({ section }: { section: string }) {
  const title = titles[section] ?? titles.overview;
  const [refreshKey, setRefreshKey] = useState(0);

  return <div className="page-stack"><div className="page-header"><div><span>HR ADMINISTRATION</span><h1>{title}</h1><p>Imported workforce records now populate people, departments, current skills, and target skill gaps from the FastAPI backend.</p></div><button className="primary-action" onClick={() => window.location.assign("/hr/import")}>Import JSON<ArrowRight size={15} /></button></div><div className="government-quick-actions"><article className="panel"><Building2 size={20} /><strong>Departments</strong><span>Upload JSON to create departments.</span></article><article className="panel"><Scale size={20} /><strong>Skill gaps</strong><span>Current and target bars are visible.</span></article><article className="panel"><FileCheck2 size={20} /><strong>Audit trail</strong><span>Imports create audit events.</span></article></div>{section === "import" ? <><ImportPanel onImported={() => setRefreshKey((value) => value + 1)} /><WorkforcePanel refreshKey={refreshKey} /></> : section === "workforce" || section === "overview" ? <WorkforcePanel refreshKey={refreshKey} /> : <section className="empty-state-panel panel"><div className="empty-state-icon"><ShieldCheck size={30} /></div><div><span className="section-kicker">BACKEND CONNECTED</span><h2>{title}</h2><p>This module will use the same imported workforce records as the product grows.</p></div><button className="secondary-action" onClick={() => window.location.assign("/hr/workforce")}>Open workforce<ArrowRight size={15} /></button></section>}</div>;
}
