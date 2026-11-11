import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
    // Cross-document navigation uses native anchors and the browser's view transition.
    rules: { '@next/next/no-html-link-for-pages': 'off' },
  },
  globalIgnores(['.next/**', 'tmp/**', 'out/**', 'next-env.d.ts']),
]);
