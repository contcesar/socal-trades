// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static output. Dynamic pieces (live status, claim flow, email) run as
// standalone Netlify Functions under netlify/functions, not Astro SSR.
export default defineConfig({
  // Production domain. Used for canonical tags and sitemap generation.
  site: 'https://socaltrades.net',
  output: 'static',
  integrations: [
    sitemap({
      // Keep private/auth pages out of the sitemap.
      filter: (page) =>
        !/\/(admin|account|login|signup|logout|forgot|reset|auth)(\/|$)/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
