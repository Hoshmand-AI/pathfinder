// ─── Major ──────────────────────────────────────────────────────────────────
export interface Major {
  id: string;
  slug: string;
  name: string;
  category: MajorCategory;
  icon: string;
  description: string;
  longDescription: string;
  avgSalaryEntry: number;
  avgSalaryMid: number;
  avgSalarySenior: number;
  jobGrowth: number; // 10-year % projection
  annualJobOpenings: number;
  topCareers: TopCareer[];
  requiredSkills: string[];
  courseHighlights: string[];
  difficulty: "Low" | "Medium" | "High";
  isPopular: boolean;
  isTrending: boolean;
  relatedMajors: string[];
  degreeTypes: string[];
  typicalDuration: string;
  certifications?: string[];
}

export type MajorCategory =
  | "STEM"
  | "Business"
  | "Health & Medicine"
  | "Arts & Humanities"
  | "Social Sciences"
  | "Education"
  | "Law & Policy"
  | "Creative Arts"
  | "Environmental";

export interface TopCareer {
  title: string;
  avgSalary: number;
  growth: number;
}

// ─── University ──────────────────────────────────────────────────────────────
export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  type: "Public" | "Private" | "Ivy League" | "Community College" | "Liberal Arts";
  ranking: number;
  acceptanceRate: number; // decimal e.g. 0.05 = 5%
  tuitionInState: number;
  tuitionOutState: number;
  roomBoard: number;
  booksSupplies: number;
  personalExpenses: number;
  avgNetPrice: number;
  satRange: [number, number];
  actRange: [number, number];
  enrollment: number;
  studentFacultyRatio: number;
  graduationRate: number; // decimal
  avgSalaryAfter6Yrs: number;
  avgSalaryAfter10Yrs: number;
  topMajors: string[];
  description: string;
  founded: number;
  setting: "Urban" | "Suburban" | "Rural";
  size: "Small" | "Medium" | "Large";
  colors: string[];
  mascot: string;
  website: string;
  notableAlumni: string[];
  strengths: string[];
}

// ─── Career ──────────────────────────────────────────────────────────────────
export interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  avgSalary: number;
  entryLevelSalary: number;
  seniorSalary: number;
  jobGrowth10yr: number;
  annualOpenings: number;
  requiredDegree: string;
  relatedMajors: string[];
  topEmployers: string[];
  topCities: string[];
  skills: string[];
  dayInLife: string[];
  workEnvironment: string;
  outlook: "Excellent" | "Good" | "Fair" | "Declining";
}

// ─── Student Profile ──────────────────────────────────────────────────────────
export interface StudentProfile {
  // Step 1 - Basic Info
  firstName: string;
  lastName: string;
  email: string;
  grade: "9th" | "10th" | "11th" | "12th" | "Community College" | "Transfer" | "Graduate";
  age: number;

  // Step 2 - Academic
  gpa: number;
  satScore: number;
  actScore: number;
  apCourses: string[];
  strongSubjects: string[];

  // Step 3 - Interests & Values
  interests: string[];
  careerValues: CareerValue[];
  learningStyle: "Hands-on" | "Research" | "Classroom" | "Online" | "Mixed";
  workEnvironment: "Office" | "Lab" | "Outdoors" | "Remote" | "Varied";

  // Step 4 - Financial
  budgetTier: "< $20k/yr" | "$20k-$40k/yr" | "$40k-$60k/yr" | "$60k+/yr";
  needsFinancialAid: boolean;
  willingToTakeLoans: boolean;
  expectedFamilyContribution: number;

  // Step 5 - Location & Preferences
  statePreference: string[];
  distanceFromHome: "< 100 miles" | "100-500 miles" | "500+ miles" | "No preference";
  campusSetting: "Urban" | "Suburban" | "Rural" | "No preference";
  campusSize: "Small (<5k)" | "Medium (5k-15k)" | "Large (15k+)" | "No preference";

  // Saved data
  savedMajors: string[];
  savedUniversities: string[];
  compareList: string[];
  applications: Application[];
}

export type CareerValue =
  | "High Salary"
  | "Work-Life Balance"
  | "Making an Impact"
  | "Creativity"
  | "Job Security"
  | "Prestige"
  | "Remote Work"
  | "Helping People"
  | "Innovation"
  | "Leadership";

// ─── Application ─────────────────────────────────────────────────────────────
export interface Application {
  id: string;
  universityId: string;
  universityName: string;
  status: ApplicationStatus;
  type: "Early Decision" | "Early Action" | "Regular Decision" | "Rolling";
  deadline: string;
  submittedDate?: string;
  decision?: "Accepted" | "Rejected" | "Waitlisted" | "Deferred";
  scholarshipAmount?: number;
  notes: string;
  tasks: ApplicationTask[];
  priority: "Reach" | "Match" | "Safety";
}

export type ApplicationStatus =
  | "Planning"
  | "In Progress"
  | "Submitted"
  | "Decision Received";

export interface ApplicationTask {
  id: string;
  label: string;
  completed: boolean;
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── Counselor ───────────────────────────────────────────────────────────────
export interface CounselorStudent {
  id: string;
  name: string;
  grade: string;
  gpa: number;
  status: "On Track" | "Needs Attention" | "At Risk";
  topChoices: string[];
  applicationsCount: number;
  lastActivity: string;
}
