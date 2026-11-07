import type { Metadata } from "next";

import { allSkillSlugs, loadSkillDoc } from "@/site/skill-doc";
import { SkillPage } from "@/site/skill-page";

export const generateStaticParams = allSkillSlugs;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = loadSkillDoc(slug, "en");
  if (!doc) return {};
  return {
    title: `${doc.skill.title} — ${doc.skill.tagline} · p441z Skills`,
    description: doc.skill.description,
    alternates: { canonical: `/skills/${slug}`, languages: { en: `/skills/${slug}`, id: `/id/skills/${slug}` } },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SkillPage lang="en" slug={slug} />;
}
