export interface SiteIdentity {
  name: string;
  roles: string;
  location: string;
  email: string;
  whatsapp: string;
  statement: string;
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
