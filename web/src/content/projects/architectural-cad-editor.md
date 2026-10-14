---
title: Architectural CAD software
format: Desktop CAD application
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

Developed a complete standalone architectural CAD application, including its geometric modeling tools, interactive 3D workspace, user interface and document system.

Architects can generate floors, facades and openings from building parameters, combine them with directly modeled geometry and work with terrain and map data in the same project.

## Editing environment {#editing-environment}

Direct modeling tools include solid creation, boolean operations, fillets, chamfers and transformations. A common tool system handles selection, snapping and editing, supported by document storage and undo/redo.

The C# application integrates the Parasolid solid-modeling kernel with Unity's interactive 3D display. Modeling operations use Parasolid's double-precision geometry, keeping Unity's single-precision display calculations separate from the CAD model.

The integration converts Parasolid's boundary representation into display meshes, using caching and minimizing buffer copies to limit processing and memory overhead. It also manages native geometry lifetimes from C# and resolves interoperability issues between Parasolid's managed wrapper and Unity's runtime.

## Procedural building design {#procedural-building-design}

Building geometry is generated from an editable mass and parameters for floors, facade walls, cores and openings. Floor definitions can be reused at multiple levels, with geometry recalculated when the building changes.
