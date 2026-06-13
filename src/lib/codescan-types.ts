export type Category = "bugs" | "security" | "quality" | "suggestions";
export type Severity = "critical" | "warning" | "info";

export interface Finding {
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  line: number | null;
  suggestion: string;
}

export interface ReviewResult {
  language: string;
  grade: string;
  summary: string;
  findings: Finding[];
  structure?: RepoStructure;
}

export interface RepoStructure {
  repo: string;
  branch: string;
  totalFiles: number;
  languages: { name: string; count: number }[];
  tree: string[];
  filesReviewed: string[];
  keyFileContents?: string;
}

export interface TestCaseResult {
  name: string;
  passed: boolean;
  error: string | null;
}

export interface TestRunResult {
  runnable: boolean;
  reason: string | null;
  language: string;
  total: number;
  passed: number;
  failed: number;
  tests: TestCaseResult[];
}

export interface GeneratedTests {
  runnable: boolean;
  reason: string | null;
  language: string;
  setup: string;
  tests: { name: string; code: string }[];
}

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "bugs", label: "Bugs" },
  { key: "security", label: "Security" },
  { key: "quality", label: "Quality" },
  { key: "suggestions", label: "Suggestions" },
];

export const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "Other",
] as const;