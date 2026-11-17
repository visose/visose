---
title: Six-axis robotic milling
format: CAD/CAM integration · Robot programming
---

We built custom post-processors that transfer cutter positions, orientations and feed rates from RhinoCAM and PowerMILL into [Robots](/projects/robots). Designers can simulate the six-axis motion and generate a program for the milling cell from the same CAM toolpath.

In the RhinoCAM workflow, a Grasshopper tool converts G-code into robot targets and identifies rapid moves between cutting passes. Designers can adjust cutter orientation along the path using a guide mesh.
