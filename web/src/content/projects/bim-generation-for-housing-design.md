---
title: Automated BIM for modular housing
format: BIM generation service · CAD plugins
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
  caption: The automated service and interactive tools share the same C# generation rules. The Revit layer turns the resulting geometry and component data into native BIM elements.
---

Developed an automated service that converts modular house designs from a web configurator into Revit BIM models for construction.

The service applies the manufacturer's component and layout rules to generate editable walls, floors and other building elements. Supporting Revit, Rhino and Grasshopper tools handle catalog preparation, testing and model inspection.

## From house configurations to BIM {#from-layouts-to-building-elements}

Reusable Revit room templates hold the manufacturer's component definitions. The engine resolves building levels, adjoining rooms and component placement, accounting for size changes, rotation and mirroring.

The resulting walls, floors, ceilings, openings, stairs and facade systems are native Revit elements with their types and parameters.

## Shared generation engine {#shared-generation-engine}

The C# library keeps layout and geometry rules separate from the host APIs. Revit and Rhino plugins use this core; Rhino.Inside.Revit connects Grasshopper to the Revit generation workflow for interactive testing and inspection.

## Automated processing {#automated-processing}

The service retrieves jobs, house layouts and catalogs from AWS S3, generates Revit files and GLB models for web viewing, and uploads the results.
