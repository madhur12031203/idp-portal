"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, UserRound, UsersRound } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  { name: "Employee", description: "Explore your skills, career possibilities and personalized development plan.", href: "/employee", icon: UserRound, detail: "PERSONAL DEVELOPMENT" },
  { name: "Manager", description: "Understand team capability and guide employee development with transparent insights.", href: "/manager", icon: UsersRound, detail: "TEAM INTELLIGENCE" },
  { name: "HR / Talent Intelligence", description: "Monitor workforce readiness, succession and organizational skill health.", href: "/hr", icon: Building2, detail: "WORKFORCE INTELLIGENCE" },
];

export default function LoginPage(){return <main className="login-page"><header><Link href="/"><ArrowLeft size={16}/>Back to CoreAlign</Link><span>DEMONSTRATION ACCESS</span></header><section className="login-intro"><span>SELECT YOUR PERSPECTIVE</span><h1>One organization.<br/>Three levels of intelligence.</h1><p>Choose a role to enter the fully interactive CoreAlign demonstration.</p></section><section className="role-selection">{roles.map((role,i)=>{const Icon=role.icon;return <motion.div key={role.name} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}><Link href={role.href}><div className="role-card-head"><span>0{i+1}</span><Icon size={22}/></div><small>{role.detail}</small><h2>{role.name}</h2><p>{role.description}</p><div className="role-enter">Enter experience <ArrowRight size={16}/></div></Link></motion.div>})}</section><footer><span>CoreAlign</span><p>Talent Intelligence Operating System · SIH Enterprise Prototype</p></footer></main>}
