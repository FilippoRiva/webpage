import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { defineConfig } from 'astro/config';

// Node loads this local file for config use; it is ignored by Git.
const envFile = new URL('./.env', import.meta.url);
if (existsSync(envFile)) loadEnvFile(envFile);
const localHostname = process.env.LOCAL_DEV_HOSTNAME?.trim();

// Static output: these server settings do not publish or protect the built site.
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: { prefixDefaultLocale: false },
  },
  server: {
    allowedHosts: localHostname ? [localHostname] : [],
  },
});
