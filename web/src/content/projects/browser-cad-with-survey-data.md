---
title: Coastal engineering CAD
format: Web CAD application
---

Engineers design dredging, reclamation and coastal works in the same model as the survey data. The web CAD application lets them edit designs in plan, section and 3D and compare the resulting excavation, fill and rock quantities.

## Drawing and editing {#drawing-and-editing}

The TypeScript application uses React and Three.js. Its editing environment includes drawing and transformation tools, snapping, measurements, numeric property editing and undo/redo. Users can save projects in the browser or exchange portable project files.

## Surveys and ground models {#survey-visualization}

Bathymetric and topographic surveys form a geographically placed terrain model with elevation colors and contours. Borehole data describes the subsurface layers, so engineers can inspect the ground in section and calculate excavation quantities by soil type.

## Marine works and quantities {#marine-works-and-quantities}

The application generates dredging and reclamation geometry from alignments, levels and slopes. Parametric cross-sections describe coastal structures and their material layers. Engineers can revise those definitions and compare the resulting 3D designs by volumes of excavation, fill and individual rock layers.

Each cut or fill starts from the terrain left by the preceding operation. If a later excavation removes previously placed fill, the application tracks that volume separately from excavation of the original ground.
