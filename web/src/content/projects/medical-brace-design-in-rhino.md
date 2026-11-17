---
title: Medical brace design
format: Rhino plugin
---

We developed a Rhino plugin for preparing body scans, fitting brace templates from measurements and exporting the finished geometry for manufacturing. Specialists can adjust the brace and return to the same scan, measurements and design for further work. We delivered the plugin through a development partner.

## Scan preparation and fitting {#scan-preparation-and-fitting}

The C# plugin uses RhinoCommon to align and trim scan meshes. Points selected on the 3D model are linked to measurement tables and guide the initial template fit. Specialists can then refine local contours and shape through dedicated editing tools.

## Saved work and export {#saved-work-and-export}

Project documents retain the scan, measurement sections and adjusted brace together. A separate file format lets specialists reuse templates across projects, and the finished geometry exports as STL for manufacturing.
