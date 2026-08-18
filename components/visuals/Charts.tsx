"use client";

import {
  Area, AreaChart, CartesianGrid, Cell, Line, LineChart, PolarAngleAxis, PolarGrid,
  Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import { employees, futureSkills, progressData, radarData } from "@/data/mock-data";

const tooltipStyle = { background: "#171419", border: "1px solid #3a323d", borderRadius: 3, color: "#f2eee8", boxShadow: "0 18px 40px rgba(0,0,0,.28)", fontSize: 12 };

export function ProgressChart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "chart-sm" : "chart-lg"} role="img" aria-label="Role readiness increased from 58 percent in January to 72 percent in June">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={progressData} margin={{ top: 12, right: 12, left: compact ? -24 : -10, bottom: 0 }}>
          <defs><linearGradient id="readinessFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9b6d9d" stopOpacity={.32}/><stop offset="100%" stopColor="#9b6d9d" stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid stroke="#302b34" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#aaa2ab", fontSize: 11 }} />
          {!compact && <YAxis domain={[50, 80]} axisLine={false} tickLine={false} tick={{ fill: "#766f7a", fontSize: 10 }} tickFormatter={(v) => `${v}%`} />}
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, "Readiness"]} />
          <Area type="monotone" dataKey="readiness" stroke="#c57b57" strokeWidth={2.2} fill="url(#readinessFill)" animationDuration={700} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillRadar() {
  return (
    <div className="radar-wrap" role="img" aria-label="Radar comparison of Aarav's current skill profile against Project Manager requirements">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} outerRadius="72%">
          <PolarGrid stroke="#3a343d" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: "#aaa2ab", fontSize: 11 }} />
          <Radar name="Target role" dataKey="target" stroke="#c57b57" fill="#c57b57" fillOpacity={.09} strokeWidth={1.6} />
          <Radar name="Current profile" dataKey="current" stroke="#9b6d9d" fill="#9b6d9d" fillOpacity={.22} strokeWidth={2} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TeamScatter({ onSelect }: { onSelect: (name: string) => void }) {
  const data = employees.map((employee, i) => ({ x: 62 + (i * 7) % 33, y: employee.readiness, z: 60 + i * 7, name: employee.name, target: employee.target }));
  return (
    <div className="scatter-wrap" role="img" aria-label="Scatter plot comparing employee performance and future readiness">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 18, right: 22, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#302b34" />
          <XAxis type="number" dataKey="x" name="Performance" domain={[55, 100]} tick={{ fontSize: 10 }} axisLine={false} label={{ value: "CURRENT PERFORMANCE", position: "insideBottom", offset: -12, fontSize: 9, fill: "#93938c" }} />
          <YAxis type="number" dataKey="y" name="Readiness" domain={[55, 100]} tick={{ fontSize: 10 }} axisLine={false} label={{ value: "FUTURE READINESS", angle: -90, position: "insideLeft", fontSize: 9, fill: "#93938c" }} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle} formatter={(value, name) => [name === "Performance" ? `${value}%` : `${value}%`, name]} />
          <Scatter data={data} fill="#9b6d9d" onClick={(point) => onSelect(point.name)} className="cursor-scatter">
            {data.map((_, i) => <Cell key={i} fill={i === 0 ? "#c57b57" : i > 4 ? "#83a389" : "#9b6d9d"} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FutureSkillsChart() {
  return (
    <div className="future-chart" role="img" aria-label="Current workforce skill coverage compared with projected future demand">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={futureSkills} margin={{ top: 20, right: 30, bottom: 8, left: -10 }}>
          <CartesianGrid stroke="#302b34" vertical={false} />
          <XAxis dataKey="skill" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#aaa2ab" }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#766f7a" }} tickFormatter={(v) => `${v}%`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`]} />
          <Line type="monotone" dataKey="current" name="Current coverage" stroke="#9b6d9d" strokeWidth={2} dot={{ r: 4 }} animationDuration={700} />
          <Line type="monotone" dataKey="future" name="Future demand" stroke="#c99a5c" strokeDasharray="5 4" strokeWidth={2} dot={{ r: 4 }} animationDuration={900} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReadinessRing({ value = 72, label = "Project Manager", size = "large" }: { value?: number; label?: string; size?: "large" | "small" }) {
  return (
    <div className={`readiness-ring readiness-ring--${size}`} style={{ "--value": `${value * 3.6}deg` } as React.CSSProperties} aria-label={`${value}% readiness for ${label}`}>
      <div className="ring-inner"><strong>{value}%</strong><span>{label}</span></div>
    </div>
  );
}

export function MiniBars({ data }: { data: { name: string; value: number }[] }) {
  return <div className="mini-bars">{data.map((item) => <div key={item.name} className="mini-bar"><span>{item.name}</span><div><i style={{ width: `${item.value}%` }} /></div><b>{item.value}%</b></div>)}</div>;
}
