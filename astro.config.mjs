import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://odesandcodes.com',
  base: '/',
  // Force Astro to look at the 'public' folder in your root
  publicDir: 'public', 
});