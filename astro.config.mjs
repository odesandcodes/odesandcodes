import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // We removed the cloudflare import/adapter to stop the build error
  site: 'https://odesandcodes.com',
  base: '/',
});