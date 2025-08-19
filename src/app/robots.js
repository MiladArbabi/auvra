import { absUrl } from "@/lib/seo";

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absUrl('/sitemap.xml'),
  };
}
