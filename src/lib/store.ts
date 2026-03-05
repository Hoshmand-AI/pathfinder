"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudentProfile, Application, ChatMessage } from "@/lib/types";
import { generateId } from "@/lib/utils";

const defaultProfile: StudentProfile = {
  firstName: "",
  lastName: "",
  email: "",
  grade: "11th",
  age: 17,
  gpa: 0,
  satScore: 0,
  actScore: 0,
  apCourses: [],
  strongSubjects: [],
  interests: [],
  careerValues: [],
  learningStyle: "Mixed",
  workEnvironment: "Varied",
  budgetTier: "$20k-$40k/yr",
  needsFinancialAid: false,
  willingToTakeLoans: false,
  expectedFamilyContribution: 0,
  statePreference: [],
  distanceFromHome: "No preference",
  campusSetting: "No preference",
  campusSize: "No preference",
  savedMajors: [],
  savedUniversities: [],
  compareList: [],
  applications: [],
};

interface AppState {
  profile: StudentProfile;
  onboardingComplete: boolean;
  chatMessages: ChatMessage[];

  // Profile actions
  updateProfile: (updates: Partial<StudentProfile>) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;

  // Saved items
  toggleSavedMajor: (majorId: string) => void;
  toggleSavedUniversity: (universityId: string) => void;
  toggleCompare: (universityId: string) => void;
  clearCompare: () => void;

  // Applications
  addApplication: (app: Omit<Application, "id" | "tasks">) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  removeApplication: (id: string) => void;
  toggleApplicationTask: (appId: string, taskId: string) => void;

  // Chat
  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      onboardingComplete: false,
      chatMessages: [],

      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),

      completeOnboarding: () => set({ onboardingComplete: true }),

      resetProfile: () =>
        set({ profile: defaultProfile, onboardingComplete: false }),

      toggleSavedMajor: (majorId) =>
        set((state) => {
          const saved = state.profile.savedMajors.includes(majorId)
            ? state.profile.savedMajors.filter((id) => id !== majorId)
            : [...state.profile.savedMajors, majorId];
          return { profile: { ...state.profile, savedMajors: saved } };
        }),

      toggleSavedUniversity: (universityId) =>
        set((state) => {
          const saved = state.profile.savedUniversities.includes(universityId)
            ? state.profile.savedUniversities.filter((id) => id !== universityId)
            : [...state.profile.savedUniversities, universityId];
          return { profile: { ...state.profile, savedUniversities: saved } };
        }),

      toggleCompare: (universityId) =>
        set((state) => {
          const list = state.profile.compareList;
          if (list.includes(universityId)) {
            return { profile: { ...state.profile, compareList: list.filter((id) => id !== universityId) } };
          }
          if (list.length >= 4) return state;
          return { profile: { ...state.profile, compareList: [...list, universityId] } };
        }),

      clearCompare: () =>
        set((state) => ({ profile: { ...state.profile, compareList: [] } })),

      addApplication: (app) =>
        set((state) => {
          const defaultTasks = [
            { id: generateId(), label: "Complete Common App section", completed: false },
            { id: generateId(), label: "Write main essay", completed: false },
            { id: generateId(), label: "Request recommendation letters", completed: false },
            { id: generateId(), label: "Submit official transcripts", completed: false },
            { id: generateId(), label: "Pay application fee", completed: false },
            { id: generateId(), label: "Submit application", completed: false },
          ];
          const newApp: Application = {
            ...app,
            id: generateId(),
            tasks: defaultTasks,
          };
          return {
            profile: {
              ...state.profile,
              applications: [...state.profile.applications, newApp],
            },
          };
        }),

      updateApplication: (id, updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            applications: state.profile.applications.map((a) =>
              a.id === id ? { ...a, ...updates } : a
            ),
          },
        })),

      removeApplication: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            applications: state.profile.applications.filter((a) => a.id !== id),
          },
        })),

      toggleApplicationTask: (appId, taskId) =>
        set((state) => ({
          profile: {
            ...state.profile,
            applications: state.profile.applications.map((a) =>
              a.id === appId
                ? {
                    ...a,
                    tasks: a.tasks.map((t) =>
                      t.id === taskId ? { ...t, completed: !t.completed } : t
                    ),
                  }
                : a
            ),
          },
        })),

      addChatMessage: (msg) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            { ...msg, id: generateId(), timestamp: new Date() },
          ],
        })),

      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: "pathfinder-storage",
      version: 1,
    }
  )
);
