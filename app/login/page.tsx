"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Eye, LockKeyhole, Mail, UserRound, UsersRound } from "lucide-react";
import { FormEvent, useState } from "react";

const roles = [
  { name: "Employee", href: "/employee", icon: UserRound, code: "EMP" },
  { name: "Reporting Officer", href: "/manager", icon: UsersRound, code: "OFF" },
  { name: "HR Admin", href: "/hr", icon: Building2, code: "HR" },
];

export default function LoginPage() {
  const [role, setRole] = useState("/employee");
  const [showPassword, setShowPassword] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    window.location.assign(role);
  };
  const go = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.assign(href);
  };

  return (
    <main className="login-page login-v3">
      <header><Link href="/" onClick={go("/")}><ArrowLeft size={16} />Back to portal</Link><span>OFFICIAL ACCESS</span></header>
      <section className="login-shell">
        <div className="login-auth">
          <span className="auth-kicker">IDENTITY / ACCESS</span>
          <h1>Sign in to the IDP portal.</h1>
          <p>Use your organization credentials. This local build opens the selected workspace after form submission.</p>
          <form onSubmit={submit}>
            <label><span>Work email</span><div><Mail size={16} /><input required type="email" name="email" placeholder="name@department.gov" autoComplete="email" /></div></label>
            <label><span>Password</span><div><LockKeyhole size={16} /><input required minLength={6} type={showPassword ? "text" : "password"} name="password" placeholder="Minimum 6 characters" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><Eye size={16} /></button></div></label>
            <label><span>Workspace</span><div className="select-field"><select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Choose workspace"><option value="/employee">Employee - My records</option><option value="/manager">Reporting Officer - Team review</option><option value="/hr">HR Admin - Workforce administration</option></select></div></label>
            <button className="auth-submit" type="submit">Sign in<ArrowRight size={16} /></button>
          </form>
        </div>
        <aside className="login-perspectives">
          <span>WORKSPACE ACCESS</span>
          <h2>Choose the office view you need.</h2>
          <p>All workspaces are empty until approved government records are connected.</p>
          <div className="perspective-list">{roles.map(({ name, href, icon: Icon, code }) => <Link prefetch={false} href={href} key={href} onClick={go(href)}><Icon size={22} /><div><small>{code}</small><strong>{name}</strong></div><ArrowRight size={16} /></Link>)}</div>
        </aside>
      </section>
      <footer><span>IDP Portal</span><p>Official development planning workspace</p></footer>
    </main>
  );
}
