import type { Metadata } from "next";

import { allComponents, loadComponentDoc } from "@/site/component-doc";
import { ComponentPage } from "@/site/component-page";

export const generateStaticParams = () => allComponents().map((c) => ({ name: c.name }));

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const doc = loadComponentDoc(name);
  if (!doc) return {};
  return {
    title: `${doc.title} — p441z Style Kit`,
    description: doc.description,
    alternates: { canonical: `/components/${name}`, languages: { en: `/components/${name}`, id: `/id/components/${name}` } },
  };
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return <ComponentPage lang="en" name={name} />;
}
