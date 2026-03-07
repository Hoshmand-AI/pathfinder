"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { universities } from "@/lib/data/universities";
import { cn } from "@/lib/utils";
import type { ApplicationStatus, Application } from "@/lib/types";
import {
  Plus, X, CheckCircle2, Circle, Calendar,
  Trash2, ChevronDown, ChevronUp, Building2
} from "lucide-react";
import Link from "next/link";

const STATUSES: ApplicationStatus[] = ["Planning", "In Progress", "Submitted", "Decision Received"];

const STATUS_DOT: Record<ApplicationStatus, string> = {
  "Planning":          "bg-[#B8B0A4]",
  "In Progress":       "bg-[#4A7FB5]",
  "Submitted":         "bg-[#C8963E]",
  "Decision Received": "bg-[#3D8B6E]",
};

const STATUS_SELECT_COLOR: Record<ApplicationStatus, string> = {
  "Planning":          "bg-[#F8F6F3] text-[#8A8178]",
  "In Progress":       "bg-[rgba(74,127,181,0.08)] text-[#4A7FB5]",
  "Submitted":         "bg-[#FDF6E9] text-[#B8862E]",
  "Decision Received": "bg-[rgba(61,139,110,0.08)] text-[#3D8B6E]",
};

const PRIORITY_BADGE: Record<string, string> = {
  Reach:  "text-[#B85C5C]",
  Match:  "text-[#4A7FB5]",
  Safety: "text-[#3D8B6E]",
};

const DECISION_STYLE: Record<string, string> = {
  Accepted:   "bg-[rgba(61,139,110,0.08)] text-[#3D8B6E]",
  Rejected:   "bg-[rgba(184,92,92,0.08)] text-[#B85C5C]",
  Waitlisted: "bg-[rgba(196,135,59,0.08)] text-[#C4873B]",
  Deferred:   "bg-[rgba(196,135,59,0.08)] text-[#C4873B]",
};

const inputClass = "w-full bg-[#F8F6F3] border border-[#E2DDD5] rounded-md px-4 py-3 text-[13.5px] text-[#0A1628] placeholder-[#B8B0A4] focus:outline-none focus:border-[#B8B0A4] transition-colors duration-150";
const labelClass = "block text-[11px] uppercase tracking-[0.06em] font-medium text-[#B8B0A4] mb-1.5";

export default function ApplicationsPage() {
  const { profile, addApplication, updateApplication, removeApplication, toggleApplicationTask } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [newApp, setNewApp] = useState({
    universityId: "",
    type: "Regular Decision" as Application["type"],
    deadline: "",
    priority: "Match" as Application["priority"],
    notes: "",
  });

  const apps = profile.applications;

  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s);
    return acc;
  }, {} as Record<ApplicationStatus, Application[]>);

  const totalCompletion = apps.length === 0 ? 0 :
    Math.round(apps.reduce((sum, a) => {
      const done = a.tasks.filter((t) => t.completed).length;
      return sum + (done / a.tasks.length) * 100;
    }, 0) / apps.length);

  const handleAdd = () => {
    if (!newApp.universityId) return;
    const uni = universities.find((u) => u.id === newApp.universityId);
    if (!uni) return;
    addApplication({ ...newApp, universityName: uni.name, status: "Planning" });
    setShowAddModal(false);
    setNewApp({ universityId: "", type: "Regular Decision", deadline: "", priority: "Match", notes: "" });
  };

  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-14">
      {/* Page header */}
      <div className="max-w-6xl mx-auto px-6 pt-9 pb-2">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-serif text-[32px] text-[#0A1628] mb-1">Application Tracker</h1>
            <p className="text-[15px] text-[#8A8178]">Manage your college list, track deadlines, and stay organized.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[13px] font-semibold px-4 py-2 rounded-md transition-colors duration-150 flex-shrink-0 mt-2"
          >
            <Plus className="w-4 h-4" /> Add School
          </button>
        </div>

        {apps.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-4 text-center">
              <p className="text-[22px] font-bold text-[#0A1628] tabular-nums">{apps.length}</p>
              <p className="text-[11px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium">Total</p>
            </div>
            {STATUSES.map((s) => (
              <div key={s} className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-4 text-center">
                <p className="text-[22px] font-bold text-[#0A1628] tabular-nums">{byStatus[s].length}</p>
                <p className="text-[11px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium leading-tight">{s}</p>
              </div>
            ))}
            <div className="bg-[#FDF6E9] border border-[rgba(200,150,62,0.2)] rounded-lg p-4 text-center">
              <p className="text-[22px] font-bold text-[#C8963E] tabular-nums">{totalCompletion}%</p>
              <p className="text-[11px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium">Avg Done</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {apps.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-[#B8B0A4] mx-auto mb-4" />
            <h3 className="font-serif text-[22px] text-[#0A1628] mb-2">No applications tracked yet</h3>
            <p className="text-[14px] text-[#8A8178] mb-6">Add schools to your tracker to manage deadlines and tasks.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[13px] font-semibold px-5 py-2.5 rounded-md transition-colors duration-150"
              >
                <Plus className="w-4 h-4" /> Add Your First School
              </button>
              <Link href="/universities" className="inline-flex items-center gap-2 bg-transparent border border-[#E2DDD5] text-[#6B6359] text-[13px] font-medium px-5 py-2.5 rounded-md hover:bg-[#F8F6F3] transition-colors duration-150">
                Browse Universities
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {STATUSES.map((status) => (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("w-2 h-2 rounded-full", STATUS_DOT[status])} />
                  <h3 className="text-[13px] font-semibold text-[#4A443C]">{status}</h3>
                  <span className="text-[11px] font-medium text-[#B8B0A4] bg-[#F8F6F3] px-1.5 py-0.5 rounded">
                    {byStatus[status].length}
                  </span>
                </div>

                <div className="space-y-3">
                  {byStatus[status].map((app) => {
                    const completedTasks = app.tasks.filter((t) => t.completed).length;
                    const totalTasks = app.tasks.length;
                    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    const isExpanded = expanded === app.id;

                    return (
                      <div key={app.id} className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg overflow-hidden hover:border-[#E2DDD5] hover:shadow-sm transition-all duration-200">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-semibold text-[#0A1628] line-clamp-1">{app.universityName}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={cn("text-[11px] font-semibold", PRIORITY_BADGE[app.priority])}>{app.priority}</span>
                                <span className="text-[11px] text-[#B8B0A4]">{app.type}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeApplication(app.id)}
                              className="text-[#E2DDD5] hover:text-[#B85C5C] transition-colors duration-150 ml-2 flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {app.deadline && (
                            <div className="flex items-center gap-1 text-[12px] text-[#B8B0A4] mb-3">
                              <Calendar className="w-3 h-3" /> {app.deadline}
                            </div>
                          )}

                          {/* Progress bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-[11px] text-[#B8B0A4] mb-1">
                              <span>Progress</span>
                              <span>{completedTasks}/{totalTasks}</span>
                            </div>
                            <div className="w-full bg-[#E2DDD5] rounded-full h-1">
                              <div
                                className="h-1 rounded-full bg-[#162D54] transition-all duration-150"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <select
                            value={app.status}
                            onChange={(e) => updateApplication(app.id, { status: e.target.value as ApplicationStatus })}
                            className={cn("w-full text-[12px] font-medium px-2 py-1.5 rounded-md border-0 focus:outline-none cursor-pointer", STATUS_SELECT_COLOR[app.status])}
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>

                          {app.status === "Decision Received" && (
                            <select
                              value={app.decision || ""}
                              onChange={(e) => updateApplication(app.id, { decision: e.target.value as Application["decision"] })}
                              className="w-full text-[12px] px-2 py-1.5 rounded-md border border-[#E2DDD5] mt-2 focus:outline-none bg-white text-[#6B6359]"
                            >
                              <option value="">Select Decision...</option>
                              {["Accepted", "Rejected", "Waitlisted", "Deferred"].map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          )}

                          {app.decision && (
                            <div className={cn("text-[12px] font-semibold px-3 py-1.5 rounded-md mt-2 text-center", DECISION_STYLE[app.decision])}>
                              {app.decision}
                            </div>
                          )}
                        </div>

                        {/* Expand checklist */}
                        <button
                          onClick={() => setExpanded(isExpanded ? null : app.id)}
                          className="w-full flex items-center justify-between px-4 py-2 bg-[#F0EDE8] border-t border-[#E2DDD5] text-[11px] font-medium text-[#8A8178] hover:bg-[#E2DDD5] transition-colors duration-150"
                        >
                          Checklist
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {isExpanded && (
                          <div className="px-4 py-3 space-y-2 bg-[#FDFCFA]">
                            {app.tasks.map((task) => (
                              <button
                                key={task.id}
                                onClick={() => toggleApplicationTask(app.id, task.id)}
                                className="w-full flex items-center gap-2 text-left"
                              >
                                {task.completed
                                  ? <CheckCircle2 className="w-4 h-4 text-[#3D8B6E] flex-shrink-0" />
                                  : <Circle className="w-4 h-4 text-[#E2DDD5] flex-shrink-0" />}
                                <span className={cn("text-[12px]", task.completed ? "line-through text-[#B8B0A4]" : "text-[#6B6359]")}>
                                  {task.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md border border-[#F0EDE8] shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-[20px] text-[#0A1628]">Add School to Tracker</h3>
              <button onClick={() => setShowAddModal(false)} className="w-7 h-7 rounded-full bg-[#F8F6F3] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
                <X className="w-4 h-4 text-[#8A8178]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>University</label>
                <select
                  value={newApp.universityId}
                  onChange={(e) => setNewApp({ ...newApp, universityId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select a university...</option>
                  {universities.filter((u) => u.type !== "Community College").map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Application Type</label>
                  <select
                    value={newApp.type}
                    onChange={(e) => setNewApp({ ...newApp, type: e.target.value as Application["type"] })}
                    className={inputClass}
                  >
                    {["Early Decision", "Early Action", "Regular Decision", "Rolling"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select
                    value={newApp.priority}
                    onChange={(e) => setNewApp({ ...newApp, priority: e.target.value as Application["priority"] })}
                    className={inputClass}
                  >
                    {["Reach", "Match", "Safety"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Deadline</label>
                <input
                  type="text"
                  value={newApp.deadline}
                  onChange={(e) => setNewApp({ ...newApp, deadline: e.target.value })}
                  placeholder="e.g. January 1, 2026"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Notes (optional)</label>
                <textarea
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  placeholder="Essay ideas, contact notes, etc."
                  rows={2}
                  className={cn(inputClass, "resize-none")}
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={!newApp.universityId}
                className={cn(
                  "w-full py-3 rounded-md text-[13px] font-semibold transition-colors duration-150",
                  newApp.universityId
                    ? "bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628]"
                    : "bg-[#F8F6F3] text-[#B8B0A4] cursor-not-allowed"
                )}
              >
                Add to Application Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
