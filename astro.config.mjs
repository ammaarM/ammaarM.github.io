import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://ammaarm.github.io/',
  integrations: [sitemap(), react()],
});