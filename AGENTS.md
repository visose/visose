# Agent guidance

- Read [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for commands and content structure.
- Work on `develop`; `master` is for deployment. Publishing, deploying, changing
  cloud settings or sending real email requires explicit authorization.
- Edit visitor copy in `web/src/content`. Preserve established claims,
  the visual design and stable IDs. Do not invent project evidence.
- Keep credentials, personal paths, client records and internal planning out of
  tracked files. Treat this source as public.
- Use pnpm, TypeScript and C#. Prefer direct implementations and framework defaults;
  remove obsolete code and consumers together.
- Use current C# features, including collection expressions and target-typed `new`
  where the type is known. Do not add declarations solely to enable them. Prefer
  records and primary constructors for immutable data; classes for services.
- Omit default access modifiers, unnecessary `sealed` and `Async` suffixes without
  a synchronous counterpart, except where a framework requires them.
- Keep C# imports in one block: System, third-party, then project namespaces.
  Leave a blank line before an unbraced `if` unless it starts the block, and after
  multiline statements. Materialize sequences before repeated enumeration.
- Use Tailwind for ordinary UI styling; retain CSS where it is clearer.
- Use US spelling, lowercase `visose` and `VISOSE LTD` for the registered entity.
- Keep generated output in `artifacts`. Check for existing servers before starting
  another; local review must remain on loopback and never send or store inquiries.
- Keep tests focused on contact behavior and publication safeguards. Do not add
  tests that freeze wording, project counts or implementation structure.
- Format changed files with Prettier or `dotnet format whitespace`; C# builds check
  code style. Run focused checks while iterating, then `pnpm verify` for structural
  changes. Use the integrated browser for visible UI changes and `pnpm test:browser`
  for form or navigation changes.
- Keep commit messages lowercase and concise.
