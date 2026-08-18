"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, Bot, ChevronDown, ChevronRight, Command, HelpCircle, Menu, Search,
  Settings, SidebarClose, SidebarOpen, Sparkles, X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { notifications, portalNav, searchIndex, type Portal } from "@/data/mock-data";
import { EmployeePortal } from "@/components/pages/EmployeePortal";
import { ManagerPortal } from "@/components/pages/ManagerPortal";
import { HRPortal } from "@/components/pages/HRPortal";

function Drawer({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <motion.aside className="side-drawer" role="dialog" aria-modal="true" aria-label={title} initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ duration: .24, ease: "easeOut" }}>
      <div className="drawer-head"><div><span>COREALIGN</span><h2>{title}</h2></div><button ref={closeRef} className="icon-button" onClick={onClose} aria-label={`Close ${title}`}><X size={18} /></button></div>
      <div className="drawer-body">{children}</div>
    </motion.aside>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = searchIndex.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { inputRef.current?.focus(); }, []);
  return (
    <motion.div className="palette-backdrop" role="dialog" aria-modal="true" aria-label="Search CoreAlign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div className="command-palette" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette-search"><Search size={18} /><input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees, roles, skills, mentors..." aria-label="Search CoreAlign" /><span>ESC</span></div>
        <div className="palette-results">
          {filtered.length ? filtered.map((item) => <Link prefetch={false} key={`${item.group}-${item.label}`} href={item.href} onClick={(event) => { event.preventDefault(); onClose(); window.location.assign(item.href); }}><div><small>{item.group}</small><strong>{item.label}</strong></div><ChevronRight size={16} /></Link>) : <div className="empty-inline">No matching talent intelligence found.</div>}
        </div>
        <div className="palette-footer"><span><Command size={12} /> K to open</span><span>↑↓ navigate · Enter select</span></div>
      </motion.div>
    </motion.div>
  );
}

export function AppShell() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const portal = (parts[0] || "employee") as Portal;
  const section = parts.slice(1).join("/") || "overview";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [overlay, setOverlay] = useState<"search" | "notifications" | "assistant" | null>(null);
  const current = useMemo(() => portalNav[portal]?.find((item) => item.href === pathname) || portalNav[portal]?.[0], [portal, pathname]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOverlay("search"); }
      if (event.key === "Escape") { setOverlay(null); setMobileNav(false); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  const view = portal === "manager" ? <ManagerPortal section={section} /> : portal === "hr" ? <HRPortal section={section} /> : <EmployeePortal section={section} />;
  const profile = portal === "employee" ? { name: "Aarav Mehta", role: "Senior Electrical Engineer", initials: "AM" } : portal === "manager" ? { name: "Devika Joshi", role: "Engineering Manager", initials: "DJ" } : { name: "Sanjay Kulkarni", role: "Chief People Officer", initials: "SK" };

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="sidebar-brand"><Link prefetch={false} href="/" onClick={(event) => { event.preventDefault(); window.location.assign("/"); }}>CoreAlign</Link><button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <SidebarOpen size={17} /> : <SidebarClose size={17} />}</button></div>
        <div className="role-switcher">
          <button><span>{portal === "employee" ? "Employee" : portal === "manager" ? "Manager" : "HR / Talent"}</span><ChevronDown size={15} /></button>
          <div className="role-menu">
            <button onClick={() => window.location.assign("/employee")}>Employee</button>
            <button onClick={() => window.location.assign("/manager")}>Manager</button>
            <button onClick={() => window.location.assign("/hr")}>HR / Talent</button>
          </div>
        </div>
        <nav className="sidebar-nav" aria-label={`${portal} navigation`}>
          {portalNav[portal].map((item) => { const Icon = item.icon; return <Link prefetch={false} key={item.href} href={item.href} className={pathname === item.href ? "active" : ""} title={collapsed ? item.label : undefined} onClick={(event) => { event.preventDefault(); setMobileNav(false); window.location.assign(item.href); }}><Icon size={17} /><span>{item.label}</span></Link>; })}
        </nav>
        <div className="sidebar-bottom">
          <button><HelpCircle size={17} /><span>Help</span></button>
          <button><Settings size={17} /><span>Settings</span></button>
          <div className="sidebar-profile"><div className="avatar">{profile.initials}</div><div><strong>{profile.name}</strong><span>{profile.role}</span></div></div>
        </div>
      </aside>

      <div className="app-frame">
        <header className="app-header">
          <div className="header-crumb"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19} /></button><span>{portal === "hr" ? "Talent Intelligence" : portal[0].toUpperCase() + portal.slice(1)}</span><ChevronRight size={13} /><strong>{current?.label}</strong></div>
          <div className="header-actions">
            <button className="search-trigger" onClick={() => setOverlay("search")}><Search size={16} /><span>Search CoreAlign</span><kbd>⌘ K</kbd></button>
            <button className="assistant-trigger" onClick={() => setOverlay("assistant")}><Sparkles size={16} /><span>Ask CoreAlign</span></button>
            <button className="icon-button" onClick={() => setOverlay("notifications")} aria-label="Open notifications"><Bell size={18} /><i /></button>
            <div className="avatar avatar--small">{profile.initials}</div>
          </div>
        </header>
        <motion.main key={pathname} className="app-content" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}>{view}</motion.main>
      </div>

      <AnimatePresence>
        {mobileNav && <motion.button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
        {overlay === "search" && <CommandPalette onClose={() => setOverlay(null)} />}
        {overlay === "notifications" && <Drawer title="Notifications" onClose={() => setOverlay(null)}><div className="notification-list">{notifications.map(({ title, note, icon: Icon }) => <button key={title}><span className="notification-icon"><Icon size={17} /></span><span><strong>{title}</strong><small>{note}</small></span><ChevronRight size={15} /></button>)}</div></Drawer>}
        {overlay === "assistant" && <Drawer title="Career assistant" onClose={() => setOverlay(null)}><div className="assistant-intro"><span className="assistant-mark"><Bot size={20} /></span><h3>How can I support your development?</h3><p>Responses use your verified skill evidence, target role requirements, and active development plan.</p></div><div className="prompt-list">{["What is blocking my readiness?","What should I focus on this month?","Show my fastest path to Technical Lead.","Which action has the highest impact?"].map((prompt) => <button key={prompt} onClick={(e) => { const el=e.currentTarget; el.innerHTML=`<strong>${prompt}</strong><small>Leadership and project governance remain the highest-impact constraints. Completing the cross-functional project could increase readiness by approximately 5%.</small>`; }}>{prompt}<ChevronRight size={15} /></button>)}</div></Drawer>}
      </AnimatePresence>
    </div>
  );
}
