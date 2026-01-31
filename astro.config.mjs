import { defineConfig } from 'astro/config';

export default defineConfig({
  // Hardcode this to root for now to eliminate the variable as a point of failure
  base: '/', 
  outDir: './dist',
  // Cloudflare doesn't need a site URL to render CSS, but it helps for absolute links
  site: 'https://odesandcodes.pages.dev', 
});