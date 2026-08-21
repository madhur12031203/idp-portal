"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Eye, LockKeyhole, Mail, UserRound, UsersRound } from "lucide-react";
import { FormEvent, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

const roles = [
  { name: "Employee", href: "/employee", icon: UserRound, code: "EMP" },
  { name: "Reporting Officer", href: "/manager", icon: UsersRound, code: "OFF" },
  { name: "HR Admin", href: "/hr", icon: Building2, code: "HR" },
];

export default function LoginPage() {
  const [role, setRole] = useState("/employee");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          workspace: role.replace("/", ""),
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const tokens = await response.json();
      localStorage.setItem("idp_access_token", tokens.access_token);
      localStorage.setItem("idp_refresh_token", tokens.refresh_token);
      window.location.assign(role);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page login-v3">
      <header><Link href="/"><ArrowLeft size={16} />Back to portal</Link><span>OFFICIAL ACCESS</span></header>
      <section className="login-shell">
        <div className="login-auth">
          <span className="auth-kicker">IDENTITY / ACCESS</span>
          <h1>Sign in to the IDP portal.</h1>
          <p>Use your backend account credentials. The default seeded HR admin is configured in `backend/.env`.</p>
          <form onSubmit={submit}>
            <label><span>Work email</span><div><Mail size={16} /><input required type="email" name="email" placeholder="hr.admin@department.gov" autoComplete="email" /></div></label>
            <label><span>Password</span><div><LockKeyhole size={16} /><input required minLength={6} type={showPassword ? "text" : "password"} name="password" placeholder="Minimum 6 characters" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><Eye size={16} /></button></div></label>
            <label><span>Workspace</span><div className="select-field"><select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Choose workspace"><option value="/employee">Employee - My records</option><option value="/manager">Reporting Officer - Team review</option><option value="/hr">HR Admin - Workforce administration</option></select></div></label>
            {error && <p className="form-error">{error}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}<ArrowRight size={16} /></button>
          </form>
        </div>
        <aside className="login-perspectives">
          <span>WORKSPACE ACCESS</span>
          <h2>Choose the office view you need.</h2>
          <p>Access is enforced by backend roles and permissions after sign in.</p>
          <div className="perspective-list">{roles.map(({ name, href, icon: Icon, code }) => <button type="button" key={href} onClick={() => setRole(href)} className={role === href ? "active" : ""}><Icon size={22} /><div><small>{code}</small><strong>{name}</strong></div><ArrowRight size={16} /></button>)}</div>
        </aside>
      </section>
      <footer><span>IDP Portal</span><p>Official development planning workspace</p></footer>
    </main>
  );
}
