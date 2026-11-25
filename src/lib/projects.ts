import { getCollection, type CollectionEntry } from 'astro:content';
import { locales, localePath, type Locale } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;

export function projectLocale(project: Project): Locale {
  const locale = locales.find((value) => project.id.startsWith(`${value}/`));
  if (!locale) throw new Error(`Unknown project language: ${project.id}`);
  return locale;
}

export function projectSlug(project: Project) {
  const slug = project.id.slice(project.id.indexOf('/') + 1);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Use a simple hyphenated project filename: ${project.id}`);
  }
  return slug;
}

export async function getAllProjects() {
  const projects = await getCollection('projects');
  const ids = new Set(projects.map((project) => project.id));
  // Fail the build rather than publish a language switch pointing to a missing page.
  for (const project of projects) {
    projectLocale(project);
    for (const locale of locales) {
      const translatedId = `${locale}/${projectSlug(project)}`;
      if (!ids.has(translatedId)) throw new Error(`Missing project translation: ${translatedId}.md`);
    }
  }
  return projects;
}

export async function getProjects(locale: Locale) {
  return (await getAllProjects())
    .filter((project) => projectLocale(project) === locale)
    .sort((a, b) => b.data.startDate.localeCompare(a.data.startDate));
}

export function projectPath(project: Project) {
  return localePath(projectLocale(project), `projects/${projectSlug(project)}/`);
}
