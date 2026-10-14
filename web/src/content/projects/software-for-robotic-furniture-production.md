---
title: Robotic 3D printing
format: Grasshopper plugins · Robot programming
---

Developed custom Grasshopper plugins and robot programs for 3D printing with ABB, KUKA and Universal Robots across manufacturing and research projects.

Across these projects, the tools cover slicing and toolpath generation, material preview, robot simulation and controller-program export. Implementations include planar and nonplanar printing, custom extrusion control and coordinated printing with multiple robots.

## Robot programming {#robot-programming}

Controller-specific programs coordinate printing, travel, approach and retract movements with extruder operation. Integrations include synchronized extrusion motors, analog and digital outputs, and network-connected extruders.

## Slicing and toolpaths {#slicing-and-toolpaths}

Mesh slicing, contour offsets and polyline simplification prepare conventional layers and continuous spirals. Surface-following paths and user-defined curves support nonplanar printing, with adjustable nozzle orientation and smoothing through changes in slope.

## Extrusion control {#extrusion-calibration}

Bead width, layer separation and calibrated material output determine flow demand. Extrusion follows the robot's actual speed and can vary with the gap to previously deposited material. Priming and suck-back settings control material at the start and end of each path.

## Analysis and preview {#analysis-and-preview}

Material previews show the planned deposit, while color-coded paths reveal changes in layer separation and extrusion demand. Support checks flag unsupported sections, and [Robots](/projects/robots) provides simulation and checks for targets outside the robot's reach or joint limits. Calculated values and robot targets remain editable in Grasshopper.
