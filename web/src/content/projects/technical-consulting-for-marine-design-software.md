---
title: Marine design software
format: Technical consulting · Shared libraries
---

Provided architecture and development support for a marine-engineering software suite built by several teams. Built shared drawing libraries, an automated release pipeline and a licensing portal for the suite.

The suite's Rhino and Grasshopper tools support the design of coastal structures and quay walls, producing 3D models, drawings and quantity calculations.

## Architecture and integration {#architecture-and-development-practices}

Architecture and code reviews addressed package boundaries, shared data structures, geometry workflows and framework choices, with ongoing advice on performance and compatibility.

Repository templates, C#/.NET guidelines and Git management established a consistent development structure across teams. Shared interfaces gave the engineering tools a common way to supply geometry, materials and drawing data.

## Shared drawing tools {#shared-functionality}

Common C# libraries turn the packages' 3D geometry into Rhino drawings: projections, hidden lines, sections and page layouts with title blocks and scaled views. Material and drawing services apply shared layer, line and hatch conventions.

The libraries and associated Grasshopper components are distributed as NuGet packages, so each team can use the same drawing and document functionality in its own tools.

## Coordinated releases {#builds-and-distribution}

A GitHub Actions pipeline builds approved package versions, checks dependency conflicts and combines them into a single Yak installer for Rhino. Releases record the included source versions and are distributed through the portal.

## Licensing portal {#licensing-portal}

A C#/.NET backend and React/TypeScript portal integrate Rhino Accounts authentication with Cloud Zoo licensing. Users can download the suite, while administrators manage licenses and review audit records. License checks govern both installer access and use of the plugins inside Rhino and Grasshopper.
