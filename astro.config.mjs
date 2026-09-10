// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output. Dynamic pieces (live status, claim flow, email) run as
// standalone Netlify Functions under netlify/functions, not Astro SSR.
export default defineConfig({
  // Production domain. Used for canonical tags and sitemap generation.
  site: 'https://socaltrades.net',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
