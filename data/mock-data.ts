import type { LucideIcon } from "lucide-react";
import {
  Activity, BellRing, Boxes, BriefcaseBusiness, ChartNoAxesCombined,
  CircleGauge, Compass, GitBranch, GraduationCap, Grid3X3, Handshake, LayoutDashboard,
  Network, Route, Scale, ShieldCheck, Sparkles, Target, Telescope, Users, WandSparkles,
} from "lucide-react";

export type Portal = "employee" | "manager" | "hr";
export type NavItem = { label: string; href: string; icon: LucideIcon };

export const portalNav: Record<Portal, NavItem[]> = {
  employee: [
    { label: "Overview", href: "/employee", icon: LayoutDashboard },
    { label: "Skill profile", href: "/employee/skills", icon: Boxes },
    { label: "Skill gaps", href: "/employee/gaps", icon: Target },
    { label: "Career explorer", href: "/employee/career", icon: Route },
    { label: "Readiness", href: "/employee/readiness", icon: CircleGauge },
    { label: "Development plan", href: "/employee/idp", icon: GitBranch },
    { label: "Learning", href: "/employee/learning", icon: GraduationCap },
    { label: "Mentors", href: "/employee/mentors", icon: Handshake },
    { label: "Projects", href: "/employee/projects", icon: BriefcaseBusiness },
    { label: "What-if simulator", href: "/employee/simulator", icon: WandSparkles },
    { label: "Skill digital twin", href: "/employee/digital-twin", icon: Network },
    { label: "Progress", href: "/employee/progress", icon: Activity },
  ],
  manager: [
    { label: "Overview", href: "/manager", icon: LayoutDashboard },
    { label: "My team", href: "/manager/team", icon: Users },
    { label: "Skill intelligence", href: "/manager/skills", icon: Boxes },
    { label: "Readiness", href: "/manager/readiness", icon: CircleGauge },
    { label: "Development plans", href: "/manager/idps", icon: GitBranch },
    { label: "Mentoring", href: "/manager/mentoring", icon: Handshake },
    { label: "Talent map", href: "/manager/talent", icon: Grid3X3 },
  ],
  hr: [
    { label: "Executive overview", href: "/hr", icon: LayoutDashboard },
    { label: "Workforce", href: "/hr/workforce", icon: Users },
    { label: "Skill intelligence", href: "/hr/skills", icon: Boxes },
    { label: "Nine-box", href: "/hr/nine-box", icon: Grid3X3 },
    { label: "Succession", href: "/hr/succession", icon: GitBranch },
    { label: "Development", href: "/hr/development", icon: GraduationCap },
    { label: "Mentors", href: "/hr/mentors", icon: Handshake },
    { label: "Future skills", href: "/hr/future-skills", icon: Telescope },
    { label: "Fairness", href: "/hr/fairness", icon: Scale },
    { label: "AI audit", href: "/hr/audit", icon: ShieldCheck },
  ],
};

export const employees = [
  { name: "Aarav Mehta", initials: "AM", role: "Senior Electrical Engineer", target: "Project Manager", readiness: 72, idp: 64, gap: "Leadership", department: "Transmission" },
  { name: "Nisha Sharma", initials: "NS", role: "Smart Grid Specialist", target: "Technical Lead", readiness: 86, idp: 78, gap: "Strategy", department: "Grid Innovation" },
  { name: "Rohan Iyer", initials: "RI", role: "Electrical Engineer", target: "Senior Engineer", readiness: 79, idp: 52, gap: "Risk", department: "Operations" },
  { name: "Ishita Kapoor", initials: "IK", role: "Project Engineer", target: "Project Manager", readiness: 68, idp: 83, gap: "Governance", department: "Projects" },
  { name: "Arjun Nair", initials: "AN", role: "Cybersecurity Specialist", target: "Security Lead", readiness: 88, idp: 71, gap: "Leadership", department: "Digital" },
  { name: "Meera Rao", initials: "MR", role: "Grid Analyst", target: "Smart Grid Specialist", readiness: 76, idp: 69, gap: "AI & Analytics", department: "Strategy" },
  { name: "Kabir Malhotra", initials: "KM", role: "Technical Lead", target: "Engineering Manager", readiness: 82, idp: 74, gap: "Stakeholders", department: "Transmission" },
  { name: "Priya Menon", initials: "PM", role: "Operations Engineer", target: "Grid Operations Lead", readiness: 74, idp: 61, gap: "Strategy", department: "Operations" },
];

export const skillProfile = [
  { name: "Power Systems", category: "Technical", value: 4.6, confidence: 94, evidence: 11, target: 4.2 },
  { name: "SCADA", category: "Domain", value: 4.1, confidence: 91, evidence: 8, target: 3.8 },
  { name: "Risk Management", category: "Management", value: 3.1, confidence: 84, evidence: 6, target: 4.0 },
  { name: "Communication", category: "Communication", value: 3.7, confidence: 89, evidence: 9, target: 4.2 },
  { name: "Project Management", category: "Management", value: 2.7, confidence: 86, evidence: 7, target: 4.3 },
  { name: "Leadership", category: "Leadership", value: 2.4, confidence: 82, evidence: 5, target: 4.1 },
];

export const readinessFactors = [
  { name: "Technical expertise", value: 18, kind: "positive" },
  { name: "Experience", value: 14, kind: "positive" },
  { name: "Performance", value: 11, kind: "positive" },
  { name: "Training", value: 6, kind: "positive" },
  { name: "Leadership gap", value: -12, kind: "constraint" },
  { name: "Project governance", value: -9, kind: "constraint" },
  { name: "Stakeholder management", value: -6, kind: "constraint" },
];

export const progressData = [
  { month: "Jan", readiness: 58, event: "Baseline" },
  { month: "Feb", readiness: 60, event: "" },
  { month: "Mar", readiness: 63, event: "Course completed" },
  { month: "Apr", readiness: 68, event: "Mentor assigned" },
  { month: "May", readiness: 69, event: "" },
  { month: "Jun", readiness: 72, event: "Project completed" },
];

export const radarData = [
  { skill: "Leadership", current: 48, target: 82 },
  { skill: "Communication", current: 74, target: 84 },
  { skill: "Project Mgmt", current: 54, target: 86 },
  { skill: "Risk", current: 62, target: 80 },
  { skill: "Technical", current: 92, target: 84 },
  { skill: "Stakeholders", current: 60, target: 88 },
];

export const teamSkills = [
  { employee: "Aarav", scores: [2.4, 2.7, 4.6, 3.1, 3.7, 3.8] },
  { employee: "Nisha", scores: [3.9, 4.1, 3.8, 3.7, 4.3, 4.6] },
  { employee: "Rohan", scores: [3.2, 3.4, 4.4, 2.8, 3.9, 3.4] },
  { employee: "Ishita", scores: [3.8, 4.2, 3.7, 3.5, 4.2, 3.8] },
  { employee: "Arjun", scores: [3.5, 3.2, 3.1, 4.6, 4.0, 4.7] },
  { employee: "Meera", scores: [3.6, 3.8, 3.5, 3.9, 4.4, 4.2] },
];
export const teamSkillLabels = ["Leadership", "Project Mgmt", "Power Systems", "Risk", "Communication", "Digital"];

export const orgSkills = [
  { unit: "Transmission", scores: [72, 84, 46, 69, 76, 62] },
  { unit: "Operations", scores: [68, 71, 39, 81, 73, 70] },
  { unit: "Grid Innovation", scores: [77, 89, 78, 64, 69, 86] },
  { unit: "Project Management", scores: [83, 58, 43, 74, 91, 67] },
  { unit: "Cybersecurity", scores: [71, 52, 74, 88, 63, 94] },
  { unit: "Strategy", scores: [86, 61, 69, 77, 72, 75] },
];
export const orgSkillLabels = ["Leadership", "Smart Grid", "AI / Analytics", "Risk", "Project Mgmt", "Digital Systems"];

export const futureSkills = [
  { skill: "Smart Grid", current: 71, future: 88 },
  { skill: "Cybersecurity", current: 48, future: 82 },
  { skill: "AI / Analytics", current: 33, future: 74 },
  { skill: "Digital Twin", current: 22, future: 68 },
  { skill: "Renewables", current: 64, future: 84 },
];

export const idpTimeline = [
  { month: "Month 1", title: "Project Governance Fundamentals", skill: "Project Management", progress: 100, impact: "+3%", status: "Complete" },
  { month: "Month 2", title: "Mentor: Senior Project Director", skill: "Leadership", progress: 72, impact: "+4%", status: "In progress" },
  { month: "Month 3", title: "Cross-functional grid project", skill: "Stakeholder Management", progress: 35, impact: "+5%", status: "In progress" },
  { month: "Month 4", title: "Leadership assessment", skill: "Leadership", progress: 0, impact: "+2%", status: "Upcoming" },
  { month: "Month 5", title: "Stakeholder assignment", skill: "Communication", progress: 0, impact: "+3%", status: "Upcoming" },
  { month: "Month 6", title: "Readiness reassessment", skill: "Role readiness", progress: 0, impact: "Review", status: "Upcoming" },
];

export const mentors = [
  { name: "Ananya Rao", initials: "AR", role: "Senior Project Director", match: 92, expertise: ["Leadership", "Project Governance", "Stakeholders"], capacity: 4, success: 88 },
  { name: "Vikram Sethi", initials: "VS", role: "Grid Transformation Lead", match: 87, expertise: ["Smart Grid", "Strategy", "Leadership"], capacity: 2, success: 91 },
  { name: "Megha Krishnan", initials: "MK", role: "Program Management Head", match: 83, expertise: ["Risk", "Project Management", "Coaching"], capacity: 3, success: 86 },
];

export const learning = [
  { title: "Strategic Project Leadership", provider: "Professional Development Program", skills: "Leadership + Project Management", duration: "6 weeks", level: "Intermediate", match: 94 },
  { title: "Governance for Infrastructure Programs", provider: "National Management Institute", skills: "Governance + Risk", duration: "4 weeks", level: "Advanced", match: 89 },
  { title: "Stakeholder Alignment in Practice", provider: "CoreAlign Academy", skills: "Communication + Influence", duration: "12 hours", level: "Intermediate", match: 86 },
];

export const projects = [
  { title: "Grid Modernization Initiative", team: "Strategy & Grid Innovation", duration: "12 weeks", skills: ["Leadership", "Stakeholders", "Governance"], impact: "High", readiness: 65 },
  { title: "Substation Reliability Program", team: "Transmission Engineering", duration: "8 weeks", skills: ["Risk", "Project Management"], impact: "High", readiness: 70 },
  { title: "Digital Asset Twin Pilot", team: "Enterprise Digital", duration: "10 weeks", skills: ["Analytics", "Change Leadership"], impact: "Medium", readiness: 60 },
];

export const searchIndex = [
  { group: "Employees", label: "Aarav Mehta", href: "/manager/team" },
  { group: "Employees", label: "Nisha Sharma", href: "/manager/team" },
  { group: "Roles", label: "Project Manager", href: "/employee/career" },
  { group: "Roles", label: "Technical Lead", href: "/employee/career" },
  { group: "Skills", label: "Leadership", href: "/employee/skills" },
  { group: "Skills", label: "Smart Grid", href: "/hr/skills" },
  { group: "Mentors", label: "Ananya Rao", href: "/employee/mentors" },
  { group: "Development", label: "Aarav's IDP", href: "/employee/idp" },
];

export const notifications = [
  { title: "Mentor session tomorrow", note: "Ananya Rao · 11:30 AM", icon: BellRing },
  { title: "Leadership milestone completed", note: "Readiness impact +2%", icon: Sparkles },
  { title: "New role recommendation", note: "Technical Lead · 87% match", icon: Compass },
  { title: "Readiness increased by 4%", note: "Quarterly assessment updated", icon: ChartNoAxesCombined },
];
