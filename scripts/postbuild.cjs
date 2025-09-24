const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const pages = ['', 'projects', 'contact', 'resume'];

const baseUrl = process.env.SITE_URL || 'https://{{YOUR_GITHUB_USERNAME}}.github.io';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages
    .map((page) => {
      const loc = page ? `${baseUrl}/${page}` : baseUrl;
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page ? '0.7' : '1.0'}</priority>\n  </url>`;
    })
    .join('\n') +
  '\n</urlset>\n';

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(
  path.join(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`,
  'utf8'
);

console.log('Generated sitemap.xml and robots.txt');
