"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { universities } from "@/lib/data/universities";
import { formatCurrency, cn } from "@/lib/utils";
import type { ApplicationStatus, Application } from "@/lib/types";
import {
  ClipboardList, Plus, X, CheckCircle2, Circle, Calendar,
  Trash2, University, ChevronDown, ChevronUp, Edit3, Target
} from "lucide-react";
import Link from "next/link";

const STATUSES: ApplicationStatus[] = ["Planning", "In Progress", "Submitted", "Decision Received"];

const statusColors: Record<ApplicationStatus, string> = {
  "Planning": "bg-gray-100 text-gray-600",
  "In Progress": "bg-blue-100 text-blue-700",
  "Submitted": "bg-violet-100 text-violet-700",
  "Decision Received": "bg-emerald-100 text-emerald-700",
};

const priorityColors = {
  Reach: "bg-red-100 text-red-600",
  Match: "bg-blue-100 text-blue-600",
  Safety: "bg-green-100 text-green-600",
};

const decisionColors: Record<string, string> = {
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Waitlisted: "bg-yellow-100 text-yellow-700",
  Deferred: "bg-orange-100 text-orange-700",
};

export default function ApplicationsPage() {
  const { profile, addApplication, updateApplication, removeApplication, toggleApplicationTask } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [search, setSearch] = useState("");

  const [newApp, setNewApp] = useState({
    universityId: "",
    type: "Regular Decision" as Application["type"],
    deadline: "",
    priority: "Match" as Application["priority"],
    notes: "",
  });

  const apps = profile.applications;
  const filtered = apps.filter((a) =>
    !search || a.universityName.toLowerCase().includes(search.toLowerCase())
  );

  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter((a) => a.status === s);
    return acc;
  }, {} as Record<ApplicationStatus, Application[]>);

  const handleAdd = () => {
    if (!newApp.universityId) return;
    const uni = universities.find((u) => u.id === newApp.universityId);
    if (!uni) return;
    addApplication({
      ...newApp,
      universityName: uni.name,
      status: "Planning",
    });
    setShowAddModal(false);
    setNewApp({ universityId: "", type: "Regular Decision", deadline: "", priority: "Match", notes: "" });
  };

  const totalCompletion = apps.length === 0 ? 0 :
    Math.round(apps.reduce((sum, a) => {
      const done = a.tasks.filter((t) => t.completed).length;
      return sum + (done / a.tasks.length) * 100;
    }, 0) / apps.length);

  return (
    <main className="lg:pl-[260px] min-h-screen bg-slate-50">
      <div className="pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ClipboardList className="w-8 h-8 text-white" />
                  <h1 className="text-3xl font-black text-white">Application Tracker</h1>
                </div>
                <p className="text-teal-200">Manage your college list, track deadlines, and stay organized.</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-white text-teal-700 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-teal-50 transition-colors shadow-lg flex-shrink-0"
              >
                <Plus className="w-4 h-4" /> Add School
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {apps.length === 0 ? (
            <div className="text-center py-20">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No applications tracked yet</h3>
              <p className="text-gray-400 mb-6">Add schools to your tracker to manage deadlines and tasks</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-5 h-5" /> Add Your First School
                </button>
                <Link href="/universities" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
                  <University className="w-5 h-5" /> Browse Universities
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center md:col-span-1">
                  <p className="text-2xl font-black text-gray-900">{apps.length}</p>
                  <p className="text-xs text-gray-500">Total Schools</p>
                </div>
                {STATUSES.map((s) => (
                  <div key={s} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                    <p className="text-2xl font-black text-gray-900">{byStatus[s].length}</p>
                    <p className="text-xs text-gray-500">{s}</p>
                  </div>
                ))}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-4 border border-teal-100 shadow-sm text-center md:col-span-1">
                  <p className="text-2xl font-black text-teal-700">{totalCompletion}%</p>
                  <p className="text-xs text-teal-600">Avg Completion</p>
                </div>
              </div>

              {/* Kanban board */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {STATUSES.map((status) => (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={cn("w-2 h-2 rounded-full",
                        status === "Planning" ? "bg-gray-400" :
                        status === "In Progress" ? "bg-blue-500" :
                        status === "Submitted" ? "bg-violet-500" : "bg-emerald-500"
                      )} />
                      <h3 className="font-bold text-gray-700 text-sm">{status}</h3>
                      <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                        {byStatus[status].length}
                      </span>
                    </div>

                    {byStatus[status].map((app) => {
                      const completedTasks = app.tasks.filter((t) => t.completed).length;
                      const totalTasks = app.tasks.length;
                      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                      const isExpanded = expanded === app.id;

                      return (
                        <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                          {/* Card header */}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm line-clamp-1">{app.universityName}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", priorityColors[app.priority])}>
                                    {app.priority}
                                  </span>
                                  <span className="text-xs text-gray-400">{app.type}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeApplication(app.id)}
                                className="text-gray-300 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {app.deadline && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                <Calendar className="w-3 h-3" />
                                Deadline: {app.deadline}
                              </div>
                            )}

                            {/* Progress */}
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{completedTasks}/{totalTasks} tasks</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all"
                                  style={{ width: `${progress}%` }} />
                              </div>
                            </div>

                            {/* Status select */}
                            <select
                              value={app.status}
                              onChange={(e) => updateApplication(app.id, { status: e.target.value as ApplicationStatus })}
                              className={cn("w-full text-xs font-medium px-2 py-1.5 rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer", statusColors[app.status])}
                            >
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>

                            {/* Decision */}
                            {app.status === "Decision Received" && (
                              <select
                                value={app.decision || ""}
                                onChange={(e) => updateApplication(app.id, { decision: e.target.value as Application["decision"] })}
                                className="w-full text-xs font-medium px-2 py-1.5 rounded-lg border border-gray-200 mt-2 focus:outline-none"
                              >
                                <option value="">Select Decision...</option>
                                {["Accepted", "Rejected", "Waitlisted", "Deferred"].map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            )}

                            {app.decision && (
                              <div className={cn("text-xs font-bold px-3 py-1.5 rounded-lg mt-2 text-center", decisionColors[app.decision])}>
                                🎓 {app.decision}
                              </div>
                            )}
                          </div>

                          {/* Expand tasks */}
                          <button
                            onClick={() => setExpanded(isExpanded ? null : app.id)}
                            className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                          >
                            Checklist
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isExpanded && (
                            <div className="px-4 py-3 space-y-2">
                              {app.tasks.map((task) => (
                                <button
                                  key={task.id}
                                  onClick={() => toggleApplicationTask(app.id, task.id)}
                                  className="w-full flex items-center gap-2 text-left"
                                >
                                  {task.completed
                                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                                  <span className={cn("text-xs", task.completed ? "line-through text-gray-400" : "text-gray-700")}>
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
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add School to Tracker</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">University</label>
                <select
                  value={newApp.universityId}
                  onChange={(e) => setNewApp({ ...newApp, universityId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="">Select a university...</option>
                  {universities.filter((u) => u.type !== "Community College").map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Application Type</label>
                  <select
                    value={newApp.type}
                    onChange={(e) => setNewApp({ ...newApp, type: e.target.value as Application["type"] })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    {["Early Decision", "Early Action", "Regular Decision", "Rolling"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={newApp.priority}
                    onChange={(e) => setNewApp({ ...newApp, priority: e.target.value as Application["priority"] })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    {["Reach", "Match", "Safety"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline</label>
                <input
                  type="text"
                  value={newApp.deadline}
                  onChange={(e) => setNewApp({ ...newApp, deadline: e.target.value })}
                  placeholder="e.g. January 1, 2026"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  placeholder="Essay topic ideas, contact notes, etc."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={!newApp.universityId}
                className={cn("w-full py-3 rounded-2xl font-bold text-sm transition-all",
                  newApp.universityId
                    ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 shadow-lg shadow-teal-500/25"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
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
