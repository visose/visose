---
title: Medical brace design
format: Rhino plugin
---

Developed a Rhino plugin for designing medical braces from body scans.

Specialists can prepare body scans, take measurements, fit and adjust brace templates, and export the finished geometry for manufacturing.

## Scan preparation and fitting {#scan-preparation-and-fitting}

The C# plugin was delivered through a software development partner and uses RhinoCommon to align and trim scan meshes.

Specialists select measurement points in the 3D view and inspect the linked measurements. These guide the initial template fit; dedicated tools let specialists refine the contours and shape afterward.

## Saved work and export {#saved-work-and-export}

Documents retain the scan, measurement sections and adjusted brace. Reusable templates have their own file format, and completed geometry exports as STL for manufacturing.
