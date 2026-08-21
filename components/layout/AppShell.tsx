"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  Bot,
  Boxes,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  ClipboardList,
  Command,
  Compass,
  FileText,
  GitBranch,
  GraduationCap,
  Grid3X3,
  Handshake,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  Route,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Target,
  Telescope,
  Users,
  WandSparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmployeePortal } from "@/components/pages/EmployeePortal";
import { HRPortal } from "@/components/pages/HRPortal";
import { ManagerPortal } from "@/components/pages/ManagerPortal";

type Portal = "employee" | "manager" | "hr";
type NavItem = { label: string; href: string; icon: LucideIcon };
type Me = { email: string; full_name: string; roles: string[]; permissions: string[]; workspaces: Portal[] };
type NotificationItem = { id: string; title: string; body: string; read_at: string | null; created_at: string };
type SearchItem = { group?: string; label?: string; href?: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

const portalNav: Record<Portal, NavItem[]> = {
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
    { label: "Data import", href: "/hr/import", icon: FileText },
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

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "ID";
}

function token() {
  return typeof window === "undefined" ? null : localStorage.getItem("idp_access_token");
}

async function apiGet<T>(path: string): Promise<T> {
  const accessToken = token();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (response.status === 401) {
    localStorage.removeItem("idp_access_token");
    localStorage.removeItem("idp_refresh_token");
    window.location.assign("/login");
  }
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function Drawer({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <aside className="side-drawer" role="dialog" aria-modal="true" aria-label={title}>
      <div className="drawer-head"><div><span>GOVERNMENT PORTAL</span><h2>{title}</h2></div><button ref={closeRef} className="icon-button" onClick={onClose} aria-label={`Close ${title}`}><X size={18} /></button></div>
      <div className="drawer-body">{children}</div>
    </aside>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const run = setTimeout(async () => {
      try {
        const result = await apiGet<{ items: SearchItem[] }>(`/search?q=${encodeURIComponent(query)}`);
        setItems(result.items ?? []);
      } catch {
        setItems([]);
      }
    }, 180);
    return () => clearTimeout(run);
  }, [query]);

  return (
    <div className="palette-backdrop" role="dialog" aria-modal="true" aria-label="Search official records" onMouseDown={onClose}>
      <div className="command-palette" onMouseDown={(event) => event.stopPropagation()}>
        <div className="palette-search"><Search size={18} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search official records..." aria-label="Search official records" /><span>ESC</span></div>
        <div className="palette-results">{items.length ? items.map((item, index) => <Link prefetch={false} key={`${item.href ?? item.label}-${index}`} href={item.href ?? "#"} onClick={onClose}><div><small>{item.group ?? "Record"}</small><strong>{item.label ?? "Untitled record"}</strong></div><ChevronRight size={16} /></Link>) : <div className="empty-inline">No official records are connected yet.</div>}</div>
        <div className="palette-footer"><span><Command size={12} /> K to open</span><span>Backend search is active</span></div>
      </div>
    </div>
  );
}

export function AppShell() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const portal = ((parts[0] || "employee") as Portal);
  const section = parts.slice(1).join("/") || "overview";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [overlay, setOverlay] = useState<"search" | "notifications" | "assistant" | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const current = useMemo(() => portalNav[portal]?.find((item) => item.href === pathname) || portalNav[portal]?.[0], [portal, pathname]);
  const view = portal === "manager" ? <ManagerPortal section={section} /> : portal === "hr" ? <HRPortal section={section} /> : <EmployeePortal section={section} />;
  const allowedWorkspaces = me?.workspaces?.length ? me.workspaces : ["employee"];
  const profile = me ? { name: me.full_name, role: me.roles.join(", ") || "Portal user", initials: initials(me.full_name) } : { name: "Loading", role: "Checking session", initials: "ID" };

  useEffect(() => {
    if (!token()) {
      window.location.assign("/login");
      return;
    }
    apiGet<Me>("/auth/me")
      .then((user) => {
        setMe(user);
        if (!user.workspaces.includes(portal)) window.location.assign(`/${user.workspaces[0] ?? "employee"}`);
      })
      .catch(() => window.location.assign("/login"))
      .finally(() => setLoading(false));
  }, [portal]);

  useEffect(() => {
    if (overlay === "notifications") {
      apiGet<{ items: NotificationItem[] }>("/notifications").then((result) => setNotifications(result.items ?? [])).catch(() => setNotifications([]));
    }
  }, [overlay]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOverlay("search"); }
      if (event.key === "Escape") { setOverlay(null); setMobileNav(false); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  const logout = () => {
    localStorage.removeItem("idp_access_token");
    localStorage.removeItem("idp_refresh_token");
    window.location.assign("/login");
  };

  if (loading) return <main className="app-loading"><ShieldCheck size={22} />Checking backend session...</main>;

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="sidebar-brand"><Link prefetch={false} href="/employee">IDP Portal</Link><button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}><Menu size={17} /></button></div>
        <div className="role-switcher"><button><span>{portal === "hr" ? "HR Admin" : portal === "manager" ? "Reporting Officer" : "Employee"}</span><ChevronDown size={15} /></button><div className="role-menu">{allowedWorkspaces.map((workspace) => <button key={workspace} onClick={() => window.location.assign(`/${workspace}`)}>{workspace === "hr" ? "HR Admin" : workspace === "manager" ? "Reporting Officer" : "Employee"}</button>)}</div></div>
        <nav className="sidebar-nav" aria-label={`${portal} navigation`}>{portalNav[portal].map((item) => { const Icon = item.icon; return <Link prefetch={false} key={item.href} href={item.href} className={pathname === item.href ? "active" : ""} title={collapsed ? item.label : undefined} onClick={() => setMobileNav(false)}><Icon size={17} /><span>{item.label}</span></Link>; })}</nav>
        <div className="sidebar-bottom"><button><HelpCircle size={17} /><span>Help</span></button><button><Settings size={17} /><span>Settings</span></button><button onClick={logout}><LogOut size={17} /><span>Sign out</span></button><div className="sidebar-profile"><div className="avatar">{profile.initials}</div><div><strong>{profile.name}</strong><span>{profile.role}</span></div></div></div>
      </aside>

      <div className="app-frame">
        <header className="app-header"><div className="header-crumb"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19} /></button><span>{portal === "hr" ? "HR Administration" : portal === "manager" ? "Reporting Officer" : "Employee Services"}</span><ChevronRight size={13} /><strong>{current?.label}</strong></div><div className="header-actions"><button className="search-trigger" onClick={() => setOverlay("search")}><Search size={16} /><span>Search records</span><kbd>Ctrl K</kbd></button><button className="assistant-trigger" onClick={() => setOverlay("assistant")}><Bot size={16} /><span>Help</span></button><button className="icon-button" onClick={() => setOverlay("notifications")} aria-label="Open notifications"><Bell size={18} /></button><div className="avatar avatar--small">{profile.initials}</div></div></header>
        <main className="app-content">{view}</main>
      </div>

      {mobileNav && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      {overlay === "search" && <CommandPalette onClose={() => setOverlay(null)} />}
      {overlay === "notifications" && <Drawer title="Notifications" onClose={() => setOverlay(null)}><div className="notification-list">{notifications.length ? notifications.map((item) => <button key={item.id}><span className="notification-icon"><Bell size={17} /></span><span><strong>{item.title}</strong><small>{item.body}</small></span><ChevronRight size={15} /></button>) : <div className="empty-inline">No official notifications yet.</div>}</div></Drawer>}
      {overlay === "assistant" && <Drawer title="Help" onClose={() => setOverlay(null)}><div className="assistant-intro"><span className="assistant-mark"><Compass size={20} /></span><h3>Backend connected</h3><p>Use HR Data import to upload employee JSON, then sign in as those users to test employee profiles.</p></div><div className="prompt-list">{["Open HR data import", "Upload employee JSON", "Sign in as employee", "Review profile data"].map((prompt) => <button key={prompt}>{prompt}<ChevronRight size={15} /></button>)}</div></Drawer>}
    </div>
  );
}
