"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Eye, LockKeyhole, Mail, UserRound, UsersRound } from "lucide-react";
import { FormEvent, useState } from "react";

const roles = [
  { name: "Employee", href: "/employee", icon: UserRound, code: "E:01" },
  { name: "Manager", href: "/manager", icon: UsersRound, code: "M:01" },
  { name: "HR / Talent", href: "/hr", icon: Building2, code: "H:01" },
];

export default function LoginPage(){
  const [mode,setMode]=useState<"signin"|"register">("signin");
  const [role,setRole]=useState("/employee");
  const [showPassword,setShowPassword]=useState(false);
  const submit=(event:FormEvent)=>{event.preventDefault();window.location.assign(role)};
  const go=(href:string)=>(event:React.MouseEvent<HTMLAnchorElement>)=>{event.preventDefault();window.location.assign(href)};
  return <main className="login-page login-v3">
    <header><Link href="/" onClick={go("/")}><ArrowLeft size={16}/>Back to CoreAlign</Link><span>SECURE TALENT SYSTEM · DEMO ENVIRONMENT</span></header>
    <section className="login-shell">
      <div className="login-auth">
        <span className="auth-kicker">IDENTITY / ACCESS</span>
        <h1>{mode==="signin"?"Sign in to your intelligence workspace.":"Create your CoreAlign access."}</h1>
        <p>Continue with your organization credentials. For the SIH prototype, any details will open the selected workspace.</p>
        <div className="auth-tabs" role="tablist"><button className={mode==="signin"?"active":""} onClick={()=>setMode("signin")}>Sign in</button><button className={mode==="register"?"active":""} onClick={()=>setMode("register")}>Create account</button></div>
        <form onSubmit={submit}>
          {mode==="register"&&<label><span>Full name</span><div><UserRound size={16}/><input required name="name" placeholder="Aarav Mehta" autoComplete="name"/></div></label>}
          <label><span>Work email</span><div><Mail size={16}/><input required type="email" name="email" placeholder="name@organization.in" autoComplete="email"/></div></label>
          <label><span>Password</span><div><LockKeyhole size={16}/><input required minLength={6} type={showPassword?"text":"password"} name="password" placeholder="Minimum 6 characters" autoComplete={mode==="signin"?"current-password":"new-password"}/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Hide password":"Show password"}><Eye size={16}/></button></div></label>
          <label><span>Workspace</span><div className="select-field"><select value={role} onChange={event=>setRole(event.target.value)} aria-label="Choose workspace"><option value="/employee">Employee · My development</option><option value="/manager">Manager · Team intelligence</option><option value="/hr">HR · Workforce intelligence</option></select></div></label>
          <button className="auth-submit" type="submit">{mode==="signin"?"Sign in":"Create account"}<ArrowRight size={16}/></button>
        </form>
        <div className="sso-divider"><span>OR CONTINUE WITH</span></div><button className="sso-button" onClick={()=>window.location.assign(role)}>Organization SSO <span>↗</span></button>
      </div>
      <aside className="login-perspectives">
        <span>DEMONSTRATION ACCESS</span><h2>One organization.<br/>Three intelligent perspectives.</h2><p>Skip authentication and enter a fully visualized workspace.</p>
        <div className="perspective-list">{roles.map(({name,href,icon:Icon,code})=><Link prefetch={false} href={href} key={href} onClick={go(href)}><Icon size={22}/><div><small>{code}</small><strong>{name}</strong></div><ArrowRight size={16}/></Link>)}</div>
        <div className="login-system-note"><span>SYS.STATUS</span><strong>All intelligence modules operational</strong><i/></div>
      </aside>
    </section>
    <footer><span>CoreAlign</span><p>Talent Intelligence Operating System · SIH Enterprise Prototype</p></footer>
  </main>
}
