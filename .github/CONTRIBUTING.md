# Website development

Astro, Tailwind CSS and TypeScript, with a .NET 10 contact API hosted by Azure
Static Web Apps.

## Development

Requires Node 24+, pnpm 11.6.0 and .NET 10. Run commands from the repository root.

```powershell
pnpm install --frozen-lockfile
pnpm api
```

Run `pnpm dev` in another terminal, then open `http://127.0.0.1:4321`.
Both servers listen on loopback. Local form submissions are simulated: nothing is
sent or stored, and no credentials are needed. In VS Code, the **Website** launch
configuration starts both servers and opens the integrated browser.

| Command              | Purpose                                                     |
| -------------------- | ----------------------------------------------------------- |
| `pnpm dev`           | Website with live reload                                    |
| `pnpm api`           | Build and run the contact simulator                         |
| `pnpm preview`       | Astro preview of the built site, with contact simulation    |
| `pnpm verify`        | Tests, formatting checks, type checks and review build      |
| `pnpm test:browser`  | Desktop/mobile smoke test against the local preview and API |
| `pnpm build:release` | Build deployment files without publishing                   |

Generated files stay in `artifacts`. Release output is in
`artifacts/release/Visose.Web` and `artifacts/release/Visose.Api`.

## Editing

- `web/src/content/pages/*.md` owns page copy and metadata. Text before
  the first heading is the introduction. Sections use `## Heading {#stable-id}`;
  subsections use `### Heading {#stable-id}`.
- `content/projects/*.md` owns project descriptions. Filenames are stable IDs;
  level 2 sections become Details. `pages/projects.md` controls grouping and order.
- Diagram copy stays in project Markdown; each custom layout lives in
  `components/project-diagrams/<project-id>.astro`. Shared diagram components
  contain only reusable presentation. Robots references are in `pages/robots.md`.
- `shared/contact-form.json` owns shared form fields, limits and messages.
  Rebuild the API after editing it; both the browser and API use this contract.
- Astro components own layout. Use Tailwind utilities for ordinary styling and
  CSS for generated Markdown, artwork and diagrams.

The build checks content, assets, metadata and internal links. Keep credentials,
client records and research material outside the published source.

## Deployment

The [Deploy workflow](workflows/deploy.yaml) runs on pushes to `master`.
It tests, builds and deploys the site and built-in contact Function together.
