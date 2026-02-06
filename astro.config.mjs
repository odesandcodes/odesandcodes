import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  // Use your actual domain here so Astro generates links correctly
  site: 'https://odesandcodes.com', 
  base: '/',
});