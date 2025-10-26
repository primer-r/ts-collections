###### Getting started

- `pnpm run dev` dev server to view page
- `pnpm run build` to check test coverage and prepare dist package for publishing
- `npx openapi-typescript https://serviceURL/v3/api-docs --output src/types/api.docs.ts --enum-values`
- `npx openapi-typescript https://serviceURL/v3/api-docs --output src/types/api.docs.d.ts`

##### Pitfalls

- [pnpm and vite version compatibility](https://vite.dev/guide/#scaffolding-your-first-vite-project)

##### Plugins

- [IDE plugins](https://lit.dev/docs/v1/lit-html/tools/)
- [Prettier code formatter](https://prettier.io/docs/plugins)
