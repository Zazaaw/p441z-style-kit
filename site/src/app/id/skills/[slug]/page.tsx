import type { Metadata } from "next";

import { allSkillSlugs, loadSkillDoc } from "@/site/skill-doc";
import { SkillPage } from "@/site/skill-page";

export const generateStaticParams = allSkillSlugs;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = loadSkillDoc(slug, "id");
  if (!doc) return {};
  return {
    title: `${doc.skill.title} — ${doc.skill.tagline} · Skill p441z`,
    description: doc.skill.description,
    alternates: { canonical: `/id/skills/${slug}`, languages: { en: `/skills/${slug}`, id: `/id/skills/${slug}` } },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SkillPage lang="id" slug={slug} />;
}
