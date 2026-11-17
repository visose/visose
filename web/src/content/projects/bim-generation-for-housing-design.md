---
title: Automated BIM for modular housing
format: BIM generation service · CAD plugins
caseStudy:
  description: A shared generation engine and automated service that turn modular house configurations and component catalogs into native Revit models and 3D geometry for web viewing.
  inquiryLabel: Discuss a CAD integration
  area: CAD plugin or integration
diagram:
  title: Shared generation architecture
  nodes:
    input:
      label: Client's web configurator
      items:
        - House configurations
        - Generation requests
    catalog:
      label: Component catalogs
      items:
        - Reusable room templates and Revit families
        - Component types, materials and parameters
    automation:
      label: Automated service
      items:
        - Job retrieval and validation
        - Catalog loading and caching
        - AWS S3 outputs and job status
    revit:
      label: Revit plugin
      items:
        - Catalog preparation
        - Family and template setup
        - Model generation
    grasshopper:
      label: Grasshopper plugin
      items:
        - Rhino.Inside.Revit
        - Parametric generation
        - Model inspection
    rhino:
      label: Rhino plugin
      items:
        - Rhino geometry
        - Configuration inspection
    generation:
      label: Native Revit model generation
      items:
        - Native BIM elements
        - Revit types and parameters
        - Revit files and GLB export
    core:
      label: Shared C# engine
      items:
        - Layout validation and room adjacency
        - Levels and component placement
        - Wall, floor and facade geometry
        - Catalog and building rules
  caption: House configurations and component catalogs feed a shared generation engine. The automated service and CAD tools use the same rules, and the Revit layer creates editable building elements.
---

The manufacturer's layout rules and component catalog drive the generation of native, editable Revit elements from the client's house configurations. We built the shared engine behind both an automated service and interactive tools for catalog preparation, testing and model inspection.

## From house configurations to BIM {#from-layouts-to-building-elements}

Reusable Revit room templates hold the manufacturer's component definitions. The engine resolves building levels, room adjacency and component placement across resized, rotated and mirrored layouts.

The Revit integration derives perimeter and interior walls separately from the layout and uses catalog definitions for their types and level constraints. It also creates native floors, ceilings, openings, stairs and facade systems with the corresponding catalog parameters.

## Shared generation engine {#shared-generation-engine}

The C# library implements layout and geometry rules independently of the host APIs. Revit uses it for model generation and catalog preparation, and Rhino uses it to inspect configurations. Rhino.Inside.Revit lets the Grasshopper tools run the Revit generation workflow for interactive testing.

## Automated processing {#automated-processing}

The service retrieves generation jobs, house layouts and catalogs from AWS S3. It validates the input and reuses cached catalogs. Each configuration produces an editable Revit model and a GLB version for web viewing. The service uploads both files and records the job status.
