import type { ProjectDiagram } from "./diagrams.ts";

export interface Section {
  id: string;
  heading: string;
  html: string;
}

export interface Project extends Section {
  format: string;
  diagram?: ProjectDiagram;
  details: Section[];
}

export interface ProjectGroup {
  id: string;
  heading: string;
  projects: Project[];
}

export interface Page {
  key: string;
  route: string;
  title: string;
  description: string;
  opening: {
    heading: string;
    html: string;
    action?: { label: string; href: string };
  };
  sections: Section[];
}

export interface Website {
  pages: Page[];
  projectGroups: ProjectGroup[];
}

export const expectedPages = [
  ["home", "/"],
  ["services", "/services"],
  ["cad-plugin-development", "/services/cad-plugin-development"],
  [
    "cad-and-3d-application-development",
    "/services/cad-and-3d-application-development",
  ],
  ["robotics-software-development", "/services/robotics-software-development"],
  ["projects", "/projects"],
  ["robots", "/projects/robots"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["company", "/company"],
  ["privacy", "/privacy"],
] as const;
