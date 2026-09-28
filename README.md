# Shopping Cart

A responsive shopping cart page for the Neuffer frontend test task, built after the [Figma mockup](https://www.figma.com/design/2mppTVDIBBU2h7JLmUhmNs/Test-Task-Cart?node-id=0-1&p=f).

Vue 3 (Composition API, `<script setup>`) · TypeScript (strict) · Tailwind CSS 4 · Pinia · Vitest

## Getting started

Requires Node.js 20.19+ or 22.12+ (needed by Vite 8). With nvm, `nvm use` picks the version from `.nvmrc`.

```sh
npm install
npm run dev
```

| Script            | Does                                                       |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Start the dev server                                       |
| `npm test`        | Run all tests once (`npm run test:watch` to keep watching) |
| `npm run build`   | Type-check with `vue-tsc`, then build to `dist/`           |
| `npm run preview` | Serve the production build                                 |
