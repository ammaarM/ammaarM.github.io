import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

const repo = process.env.GITHUB_REPOSITORY;
const [owner, name] = repo ? repo.split("/") : [];
const isUserPage =
  owner && name && name.toLowerCase() === `${owner.toLowerCase()}.github.io`;

const site =
  process.env.PUBLIC_SITE ||
  (owner ? `https://${owner}.github.io` : "https://ammaarm.github.io");

const base = isUserPage ? "/" : name ? `/${name}` : "/";

export default defineConfig({
  site,
  base,
  integrations: [sitemap(), react(), tailwind()],
});
