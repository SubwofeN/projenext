export type ProjectStatus = "fikir" | "tasarim" | "kod_acik";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  abandon_reason: string;
  tech_stack: string[];
  status: ProjectStatus;
  respect_count: number;
  repo_url?: string | null;
  contact?: string | null;
  created_at?: string;
  author_username: string;
}