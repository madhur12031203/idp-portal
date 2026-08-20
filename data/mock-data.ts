import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BellRing,
  Boxes,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleGauge,
  Compass,
  GitBranch,
  GraduationCap,
  Grid3X3,
  Handshake,
  LayoutDashboard,
  Network,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Telescope,
  Users,
  WandSparkles,
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
    { label: "Skill records", href: "/employee/digital-twin", icon: Network },
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
    { label: "Audit", href: "/hr/audit", icon: ShieldCheck },
  ],
};

export type EmployeeRecord = {
  name: string;
  initials: string;
  role: string;
  target: string;
  readiness: number;
  idp: number;
  gap: string;
  department: string;
};

export type SkillRecord = {
  name: string;
  category: string;
  value: number;
  confidence: number;
  evidence: number;
  target: number;
};

export const employees: EmployeeRecord[] = [];
export const skillProfile: SkillRecord[] = [];
export const readinessFactors: { name: string; value: number; kind: "positive" | "constraint" }[] = [];
export const progressData: { month: string; readiness: number; event: string }[] = [];
export const radarData: { skill: string; current: number; target: number }[] = [];
export const teamSkills: { employee: string; scores: number[] }[] = [];
export const teamSkillLabels: string[] = [];
export const orgSkills: { unit: string; scores: number[] }[] = [];
export const orgSkillLabels: string[] = [];
export const futureSkills: { skill: string; current: number; future: number }[] = [];
export const idpTimeline: { month: string; title: string; skill: string; progress: number; impact: string; status: string }[] = [];
export const mentors: { name: string; initials: string; role: string; match: number; expertise: string[]; capacity: number; success: number }[] = [];
export const learning: { title: string; provider: string; skills: string; duration: string; level: string; match: number }[] = [];
export const projects: { title: string; team: string; duration: string; skills: string[]; impact: string; readiness: number }[] = [];
export const searchIndex: { group: string; label: string; href: string }[] = [];
export const notifications: { title: string; note: string; icon: LucideIcon }[] = [];

export const emptyNotificationIcon = BellRing;
export const emptySearchIcon = Compass;
export const emptyInsightIcon = ChartNoAxesCombined;
export const emptySparkleIcon = Sparkles;
