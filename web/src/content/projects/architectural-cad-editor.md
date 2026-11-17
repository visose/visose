---
title: Architectural CAD software
format: Desktop CAD application
caseStudy:
  description: A standalone architectural CAD system with direct solid editing, a parametric building engine and an interactive 3D workspace for building and site design.
  inquiryLabel: Discuss an application
  area: Application development
diagram:
  title: Application architecture
  nodes:
    tools:
      label: Tools and interaction
      items:
        - Commands and tool system
        - Object and sub-object selection
        - Snapping and manipulators
    modeling:
      label: Direct modeling
      items:
        - Solid creation and booleans
        - Face editing and transformations
        - Fillets and chamfers
    procedural:
      label: Building generation
      items:
        - Editable masses and floor definitions
        - Facades, cores and openings
        - Area and volume calculations
    document:
      label: Document model
      items:
        - Objects and component instances
        - Materials and object properties
        - Undo / redo and clipboard
        - Document storage
    kernel:
      label: Parasolid kernel
      items:
        - Solid modeling and topology
        - Geometric operations
    display:
      label: Unity display
      items:
        - Viewport and camera navigation
        - Materials and real-time lighting
        - Clipping and section views
    site:
      label: Site context
      items:
        - GIS and map integration
        - Terrain and surrounding buildings
  caption: Direct modeling and procedural building tools edit a shared document, linked to the geometry kernel, display and site data.
---

We built a standalone architectural CAD system, from its geometric editing tools and procedural building engine to its document model and interactive 3D workspace. The same document supports direct solid modeling and rule-driven building generation in the context of terrain, maps and surrounding buildings.

## Solid modeling and interactive graphics {#editing-environment}

The editing tools handle direct face moves, boolean operations, fillets and chamfers. Designers can import drawings as modeling references and snap a moving face to geometry on another object. The document model manages reusable component instances, materials, document storage and undo/redo.

The C# application uses Parasolid's double-precision boundary representation for the CAD model and tessellates it for Unity's interactive viewport. The bridge manages the lifetime of native geometry, caches display meshes and limits buffer copies.

## Procedural building generation {#procedural-building-design}

The building engine derives floors, facades, cores and openings from an editable mass and a set of design parameters. Floor definitions can apply across multiple levels, with the generated geometry recalculated as the design changes. Section views and area and volume calculations let designers evaluate the result in the same workspace.
