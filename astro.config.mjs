import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ammaarm.github.io/',
  integrations: [sitemap()],
});
