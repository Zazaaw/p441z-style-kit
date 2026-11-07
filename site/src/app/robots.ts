import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://style.p441z.my.id/sitemap.xml",
    host: "https://style.p441z.my.id",
  };
}
