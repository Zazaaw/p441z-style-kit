/** skill-backend.api.md → "backend-api" — the URL segment of a skill page (/skills/<slug>). */
export const skillSlug = (file: string) => file.replace(/^skill-|\.md$/g, "").replace(/\./g, "-");
