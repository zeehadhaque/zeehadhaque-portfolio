export interface SiteIdentity {
  name: string;
  roles: string;
  location: string;
  email: string;
  whatsapp: string;
  statement: string;
  biography: string;
  creativeFocus: readonly string[];
  workingMethod: string;
  filmmakingApproach: string;
  productionWorkflow: readonly FilmmakingWorkflowStep[];
  toolsAndCraft: readonly string[];
  creativeProjects: readonly CreativeProject[];
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface FilmProject {
  id: string;
  title: string | null;
  label: string;
  sourceUrl: string;
  videoId: string;
  isShort?: boolean;
}

export interface FutureProject {
  title: string;
  genre: string;
}


export interface FilmmakingWorkflowStep {
  number: string;
  title: string;
  description: string;
}

export interface CreativeProject {
  title: string;
  category: string;
  description: string;
  status: string;
  href?: string;
}
