import { MetadataRoute } from "next";
import { APP_URL } from "@/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/register"],
      disallow: ["/api/*", "/dashboard", "/analytics", "/reports", "/trends", "/evals", "/content-ideas", "/competitors", "/settings"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
