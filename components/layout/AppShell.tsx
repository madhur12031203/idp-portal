"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bot,
  ChevronDown,
  ChevronRight,
  Command,
  HelpCircle,
  Menu,
  Search,
  Settings,
  SidebarClose,
  SidebarOpen,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { notifications, portalNav, searchIndex, type Portal } from "@/data/mock-data";
import { EmployeePortal } from "@/components/pages/EmployeePortal";
import { HRPortal } from "@/components/pages/HRPortal";
import { ManagerPortal } from "@/components/pages/ManagerPortal";

function Drawer({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <motion.aside className="side-drawer" role="dialog" aria-modal="true" aria-label={title} initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ duration: 0.24, ease: "easeOut" }}>
      <div className="drawer-head">
        <div><span>GOVERNMENT PORTAL</span><h2>{title}</h2></div>
        <button ref={closeRef} className="icon-button" onClick={onClose} aria-label={`Close ${title}`}><X size={18} /></button>
      </div>
      <div className="drawer-body">{children}</div>
    </motion.aside>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = searchIndex.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div className="palette-backdrop" role="dialog" aria-modal="true" aria-label="Search official records" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div className="command-palette" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} onMouseDown={(event) => event.stopPropagation()}>
        <div className="palette-search">
          <Search size={18} />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search official records..." aria-label="Search official records" />
          <span>ESC</span>
        </div>
        <div className="palette-results">
          {filtered.length ? filtered.map((item) => (
            <Link prefetch={false} key={`${item.group}-${item.label}`} href={item.href} onClick={(event) => { event.preventDefault(); onClose(); window.location.assign(item.href); }}>
              <div><small>{item.group}</small><strong>{item.label}</strong></div>
              <ChevronRight size={16} />
            </Link>
          )) : <div className="empty-inline">No official records are connected yet.</div>}
        </div>
        <div className="palette-footer"><span><Command size={12} /> K to open</span><span>Search becomes active after setup</span></div>
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
  const view = portal === "manager" ? <ManagerPortal section={section} /> : portal === "hr" ? <HRPortal section={section} /> : <EmployeePortal section={section} />;
  const profile = portal === "employee"
    ? { name: "Employee user", role: "Government staff", initials: "EU" }
    : portal === "manager"
      ? { name: "Reporting officer", role: "Department reviewer", initials: "RO" }
      : { name: "HR administrator", role: "Workforce services", initials: "HA" };

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOverlay("search");
      }

      if (event.key === "Escape") {
        setOverlay(null);
        setMobileNav(false);
      }
    };

    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <Link prefetch={false} href="/" onClick={(event) => { event.preventDefault(); window.location.assign("/"); }}>IDP Portal</Link>
          <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <SidebarOpen size={17} /> : <SidebarClose size={17} />}</button>
        </div>
        <div className="role-switcher">
          <button><span>{portal === "employee" ? "Employee" : portal === "manager" ? "Reporting Officer" : "HR Admin"}</span><ChevronDown size={15} /></button>
          <div className="role-menu">
            <button onClick={() => window.location.assign("/employee")}>Employee</button>
            <button onClick={() => window.location.assign("/manager")}>Reporting Officer</button>
            <button onClick={() => window.location.assign("/hr")}>HR Admin</button>
          </div>
        </div>
        <nav className="sidebar-nav" aria-label={`${portal} navigation`}>
          {portalNav[portal].map((item) => {
            const Icon = item.icon;
            return (
              <Link prefetch={false} key={item.href} href={item.href} className={pathname === item.href ? "active" : ""} title={collapsed ? item.label : undefined} onClick={(event) => { event.preventDefault(); setMobileNav(false); window.location.assign(item.href); }}>
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <button><HelpCircle size={17} /><span>Help</span></button>
          <button><Settings size={17} /><span>Settings</span></button>
          <div className="sidebar-profile"><div className="avatar">{profile.initials}</div><div><strong>{profile.name}</strong><span>{profile.role}</span></div></div>
        </div>
      </aside>

      <div className="app-frame">
        <header className="app-header">
          <div className="header-crumb">
            <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19} /></button>
            <span>{portal === "hr" ? "HR Administration" : portal === "manager" ? "Reporting Officer" : "Employee Services"}</span>
            <ChevronRight size={13} />
            <strong>{current?.label}</strong>
          </div>
          <div className="header-actions">
            <button className="search-trigger" onClick={() => setOverlay("search")}><Search size={16} /><span>Search records</span><kbd>Ctrl K</kbd></button>
            <button className="assistant-trigger" onClick={() => setOverlay("assistant")}><Sparkles size={16} /><span>Help</span></button>
            <button className="icon-button" onClick={() => setOverlay("notifications")} aria-label="Open notifications"><Bell size={18} /></button>
            <div className="avatar avatar--small">{profile.initials}</div>
          </div>
        </header>
        <motion.main key={pathname} className="app-content" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>{view}</motion.main>
      </div>

      <AnimatePresence>
        {mobileNav && <motion.button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
        {overlay === "search" && <CommandPalette onClose={() => setOverlay(null)} />}
        {overlay === "notifications" && (
          <Drawer title="Notifications" onClose={() => setOverlay(null)}>
            <div className="notification-list">
              {notifications.length ? notifications.map(({ title, note, icon: Icon }) => (
                <button key={title}><span className="notification-icon"><Icon size={17} /></span><span><strong>{title}</strong><small>{note}</small></span><ChevronRight size={15} /></button>
              )) : <div className="empty-inline">No official notifications yet.</div>}
            </div>
          </Drawer>
        )}
        {overlay === "assistant" && (
          <Drawer title="Help" onClose={() => setOverlay(null)}>
            <div className="assistant-intro">
              <span className="assistant-mark"><Bot size={20} /></span>
              <h3>How to use this portal</h3>
              <p>Connect official HR records first. After data is approved, dashboards, reviews, and development plans will populate automatically.</p>
            </div>
            <div className="prompt-list">
              {["Connect employee register", "Configure role catalogue", "Set approval rules", "Publish training options"].map((prompt) => <button key={prompt}>{prompt}<ChevronRight size={15} /></button>)}
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}
