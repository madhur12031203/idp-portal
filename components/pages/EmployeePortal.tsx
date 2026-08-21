"use client";

import { ArrowRight, ClipboardList, FilePlus2, FolderOpen, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

type Skill = { id?: string; name: string; category?: string | null; current: number; target: number; gap?: number; evidence?: string | null };
type EmployeeProfile = { employee_code: string; email: string; full_name: string; designation: string; grade: string | null; status: string; joining_date: string | null; department: { name: string; code: string } | null };

const sectionCopy: Record<string, { title: string; subtitle: string; action: string }> = {
  overview: { title: "Employee workspace", subtitle: "Your official development records are loaded from the backend.", action: "Refresh profile" },
  skills: { title: "Skill profile", subtitle: "Current and target skills imported by HR.", action: "Review skills" },
  gaps: { title: "Skill gaps", subtitle: "Gaps are calculated from current versus target skill levels.", action: "Review gaps" },
  career: { title: "Career explorer", subtitle: "Career paths will be shown after official role families are configured.", action: "View role catalogue" },
  readiness: { title: "Readiness", subtitle: "Readiness calculations require verified evidence and rules.", action: "Connect evidence" },
  idp: { title: "Development plan", subtitle: "No individual development plan has been created for this workspace.", action: "Create plan" },
  learning: { title: "Learning", subtitle: "Approved learning recommendations will appear after courses are published.", action: "Browse courses" },
  mentors: { title: "Mentors", subtitle: "Mentor matching is empty until mentors are approved by HR.", action: "Request mentor" },
  projects: { title: "Projects", subtitle: "Stretch assignments will appear after departments publish opportunities.", action: "View opportunities" },
  simulator: { title: "Planning simulator", subtitle: "Scenario planning is disabled until criteria are configured.", action: "Configure criteria" },
  "digital-twin": { title: "Skill records", subtitle: "Auditable evidence records will appear once connected.", action: "Upload evidence" },
  progress: { title: "Progress", subtitle: "Progress tracking starts after an approved development plan is assigned.", action: "Review plan status" },
};

function token() { return typeof window === "undefined" ? null : localStorage.getItem("idp_access_token"); }
function errorMessage(value: unknown) { return value instanceof Error ? value.message : typeof value === "string" ? value : JSON.stringify(value, null, 2); }
async function apiGet<T>(path: string): Promise<T> { const response = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${token()}` } }); if (!response.ok) throw await response.json().catch(() => new Error(`Request failed: ${response.status}`)); return response.json(); }

function EmptyPanel({ title, subtitle, action }: { title: string; subtitle: string; action: string }) { return <section className="empty-state-panel panel"><div className="empty-state-icon"><FolderOpen size={30} /></div><div><span className="section-kicker">NO OFFICIAL RECORDS</span><h2>{title}</h2><p>{subtitle}</p></div><button className="primary-action">{action}<ArrowRight size={15} /></button></section>; }

function SkillBars({ skills }: { skills: Skill[] }) {
  if (!skills.length) return <EmptyPanel title="No skills imported" subtitle="Ask HR to include a skills array in your employee JSON record." action="Waiting for HR data" />;
  return <section className="panel profile-summary-panel"><div><span className="section-kicker">CURRENT VS TARGET SKILLS</span><h2>Skill profile</h2><p>Bars show the target level behind the current level for each imported skill.</p></div><div className="skill-bars">{skills.map((skill) => <div className="skill-bar-row" key={skill.name}><div className="skill-bar-head"><strong>{skill.name}</strong><span>{skill.current}% / {skill.target}% target</span></div><div className="dual-bar"><i style={{ width: `${Math.min(skill.target, 100)}%` }} /><b style={{ width: `${Math.min(skill.current, 100)}%` }} /></div><small>{skill.category ?? "Uncategorized"}{skill.gap ? ` - gap ${skill.gap}%` : " - target met"}</small></div>)}</div></section>;
}

function ProfilePanel({ includeSkills = false, gapsOnly = false }: { includeSkills?: boolean; gapsOnly?: boolean }) {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiGet<EmployeeProfile>("/employees/me"), apiGet<{ items: Skill[] }>(gapsOnly ? "/employees/me/gaps" : "/employees/me/skills")])
      .then(([profileResult, skillResult]) => { setProfile(profileResult); setSkills(skillResult.items ?? []); })
      .catch((caught) => setError(errorMessage(caught)));
  }, [gapsOnly]);

  if (error) return <EmptyPanel title="Employee profile not imported" subtitle="Ask HR to use Data import and include this user email in the employee JSON." action="Waiting for HR import" />;
  if (!profile) return <section className="empty-state-panel panel"><div className="empty-state-icon"><UserRound size={30} /></div><div><span className="section-kicker">LOADING</span><h2>Loading official profile</h2><p>Reading employee profile data from the backend.</p></div></section>;

  return <><section className="panel profile-summary-panel"><div><span className="section-kicker">OFFICIAL EMPLOYEE PROFILE</span><h2>{profile.full_name}</h2><p>{profile.designation}</p></div><div className="profile-grid"><div><span>Employee code</span><strong>{profile.employee_code}</strong></div><div><span>Email</span><strong>{profile.email}</strong></div><div><span>Department</span><strong>{profile.department ? `${profile.department.name} (${profile.department.code})` : "Not assigned"}</strong></div><div><span>Grade</span><strong>{profile.grade ?? "Not assigned"}</strong></div><div><span>Status</span><strong>{profile.status}</strong></div><div><span>Joining date</span><strong>{profile.joining_date ?? "Not recorded"}</strong></div></div></section>{includeSkills && <SkillBars skills={skills} />}</>;
}

export function EmployeePortal({ section }: { section: string }) {
  const copy = sectionCopy[section] ?? sectionCopy.overview;
  const skillSection = section === "overview" || section === "skills" || section === "gaps";

  return <div className="page-stack"><div className="page-header"><div><span>EMPLOYEE SERVICES</span><h1>{copy.title}</h1><p>{copy.subtitle}</p></div><button className="secondary-action"><ShieldCheck size={15} />Backend data</button></div><div className="government-quick-actions"><article className="panel"><ClipboardList size={20} /><strong>Submit records</strong><span>Upload approved documents and certificates.</span></article><article className="panel"><FilePlus2 size={20} /><strong>Request review</strong><span>Send updates to the reporting officer.</span></article><article className="panel"><ShieldCheck size={20} /><strong>Audit ready</strong><span>Every change has a backend trail.</span></article></div>{skillSection ? <ProfilePanel includeSkills gapsOnly={section === "gaps"} /> : <EmptyPanel {...copy} />}</div>;
}
