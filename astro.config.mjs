import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  // Ensure the base is just a slash
  base: '/',
  // This forces Astro to use the 'public' folder correctly
  publicDir: 'public', 
  site: 'https://odesandcodes.com',
});