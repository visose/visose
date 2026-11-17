---
title: Robotic 3D printing
format: Grasshopper plugins · Robot programming
---

We developed multi-axis printing software for manufacturing and research projects using ABB, KUKA and Universal Robots. The Grasshopper tools connect slicing, toolpath design and material preview to motion simulation and controller code generation. Across these projects, we developed toolpaths for flat and curved layers, coordinated printing with multiple robots and synchronized extrusion with actual robot speed.

## Robot programming {#robot-programming}

Controller-specific programs coordinate deposition and travel moves with extruder operation, including approaches and retracts. We integrated extruders driven by synchronized motors, analog and digital signals, or network commands, depending on the equipment.

## Slicing and toolpaths {#slicing-and-toolpaths}

Mesh slicing, contour offsets and polyline simplification produce conventional layers and continuous spirals. For nonplanar deposition, paths follow surfaces or user-defined curves, with adjustable nozzle orientation and smoothing through changes in slope.

## Extrusion control {#extrusion-calibration}

The software calculates material demand from bead width, layer separation and calibrated extruder output. It adjusts flow as the robot accelerates or slows and can account for changes in the gap to the previous deposit. Priming and suck-back settings control material at the start and end of each path.

In one implementation, the software checks the requested print speed against the extruder's calibrated output limit before generating the robot program.

## Analysis and preview {#analysis-and-preview}

Designers can inspect the planned deposit, see changes in layer separation and extrusion demand on color-coded paths and flag unsupported sections. [Robots](/projects/robots) simulates the motion and checks reach and joint limits. The underlying values and targets remain editable in Grasshopper.
