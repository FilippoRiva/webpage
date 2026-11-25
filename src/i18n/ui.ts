export const locales = ['en', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const languageNames: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
};

// All interface copy lives here. Project titles and prose live in Markdown.
const english = {
  home: 'Home',
  projects: 'Projects',
  allProjects: 'All projects',
  thesis: "Master's thesis",
  thesisDescription: 'Agentic workflow profiling and runtime optimization.',
  projectsBy: 'Projects by',
  statement: 'Making computers do things',
  email: 'Email',
  repository: 'Repository',
  technologies: 'Technologies',
  skipToContent: 'Skip to content',
  navigation: 'Main navigation',
  language: 'Language',
};

type Messages = Record<keyof typeof english, string>;

export const ui: Record<Locale, Messages> = {
  en: english,
  it: {
    home: 'Home',
    projects: 'Progetti',
    allProjects: 'Tutti i progetti',
    thesis: 'Tesi magistrale',
    thesisDescription: 'Profilazione e ottimizzazione di workflow agentici.',
    projectsBy: 'Progetti di',
    statement: english.statement,
    email: 'Email',
    repository: 'Codice sorgente',
    technologies: 'Tecnologie',
    skipToContent: 'Vai al contenuto',
    navigation: 'Navigazione principale',
    language: 'Lingua',
  },
};

// A rest parameter lets the same Astro templates build / and /it/.
export function localeParams(locale: Locale) {
  return { locale: locale === defaultLocale ? undefined : locale };
}

export function localePath(locale: Locale, path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const prefix = locale === defaultLocale ? '' : `${locale}/`;
  return `${base}/${prefix}${path.replace(/^\//, '')}`;
}

export function formatMonth(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}-01T00:00:00Z`));
}
