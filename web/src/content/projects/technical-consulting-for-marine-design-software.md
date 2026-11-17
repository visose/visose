---
title: Marine engineering software suite
format: Software architecture · Shared libraries · Release engineering
caseStudy:
  description: Shared architecture, drawing libraries, release engineering and licensing for an engineering suite built by multiple teams.
  inquiryLabel: Discuss technical consulting
  area: Technical consulting
---

Several development teams maintain their own Rhino and Grasshopper tools and release them as one marine engineering suite. We developed the shared drawing libraries, release pipeline and licensing portal for the suite, which generates models, drawings and quantities for coastal structures and quay walls.

We continue to advise the development teams on performance and compatibility and maintain the cloud infrastructure behind the suite.

## Architecture and integration {#architecture-and-development-practices}

We worked with the development teams to define package boundaries, shared data structures and interfaces for geometry, materials and drawing data. Repository templates and C#/.NET conventions helped the teams maintain their packages independently while building on the same infrastructure.

## Shared drawing tools {#shared-functionality}

Common C# libraries turn geometry from each engineering package into Rhino drawings. They produce projections, hidden lines and sections, then lay out scaled views and title blocks. Shared drawing and material services apply consistent layer, line and hatch conventions.

The libraries and associated Grasshopper components are distributed as NuGet packages, so each team can use the same drawing and document functionality in its own tools.

## Coordinated releases {#builds-and-distribution}

A GitHub Actions pipeline assembles approved package versions, checks their dependencies and records exactly which versions went into the release. The combined Yak installer can be published to a separate test environment before distribution through the licensing portal.

## Licensing portal {#licensing-portal}

A C#/.NET backend and React/TypeScript portal integrate Rhino Accounts authentication with Cloud Zoo licensing. Users can download the suite, while administrators manage licenses and review audit records. License checks govern both installer access and use of the plugins inside Rhino and Grasshopper.
