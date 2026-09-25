# Project Neuffer

Vue 3 + TypeScript + Tailwind CSS starter, built with Vite.

## Stack

| Tool | Version | Notes |
| --- | --- | --- |
| Vue | 3.5 | Composition API, `<script setup>` only |
| TypeScript | 5.9 | strict mode, checked with `vue-tsc` |
| Vite | 8 | dev server + build |
| Tailwind CSS | 4 | via `@tailwindcss/vite`, no config file needed |
| Pinia | 4 | setup-style stores |
| Vitest | 5 | jsdom + `@vue/test-utils` |

## Getting started

    npm install
    npm run dev

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run type-check` | `vue-tsc --build` only |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Vitest in watch mode |

## Structure

    src/
      assets/main.css        Tailwind entry + @theme tokens
      components/            SFCs (Composition API)
      composables/           Reusable reactive logic
      stores/                Pinia stores
      __tests__/             Vitest specs
      App.vue
      main.ts

`@/` is aliased to `src/` in both Vite and TypeScript.

## Tailwind

Tailwind v4 is configured in CSS, not JS. Design tokens live in the `@theme`
block in `src/assets/main.css` - e.g. `--color-brand-600` becomes the
`bg-brand-600` / `text-brand-600` utilities. There is no `tailwind.config.js`.

## Note on TypeScript version

TypeScript is pinned to `~5.9` on purpose: `vue-tsc` 3.x does not yet work with
the TypeScript 7 native compiler, so `npm install typescript@latest` will break
`npm run type-check`.
