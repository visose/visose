---
title: Coastal engineering CAD
format: Web CAD application
---

Developed a web-based CAD application for dredging, land reclamation and coastal structures, combining seabed surveys and ground models with parametric design tools.

Engineers can edit designs in plan, 3D and section views, inspect ground conditions and compare excavation, fill and rock quantities as designs change.

## Drawing and editing {#drawing-and-editing}

The TypeScript application uses React and Three.js. Its editing environment includes drawing and transformation tools, snapping, measurements, numeric property editing and undo/redo. Users can save projects in the browser or exchange portable project files.

## Surveys and ground models {#survey-visualization}

Bathymetric and topographic surveys form the terrain model, with geographic placement, elevation colors and contours. Borehole data describes the soil layers beneath it, supporting ground-model visualization, sections and excavation quantities by soil type.

## Marine works and quantities {#marine-works-and-quantities}

Dredging basins, channels and reclamation areas are defined by alignments, levels and slopes. Parametric cross-sections define coastal structures and their material layers. The resulting 3D geometry supports quantity calculations for excavation, fill and individual rock layers.
