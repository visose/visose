---
title: Port terminal design
format: Web CAD application
---

Developed a web CAD application for designing port terminals, with tools for laying out berths, quay walls, container yards and handling equipment.

The application maintains relationships between terminal components and generates quantity reports so designers can compare layout options.

## Layout and engineering objects {#layout-and-engineering-objects}

The TypeScript application combines an interactive CAD editor with a port-specific object model. Berths reference quay walls, vessels are positioned within berths, and container blocks and equipment use catalog definitions.

A reusable CAD core provides geometry operations. The port layer adds domain-specific objects, relationships and rules, with catalogs for vessels, equipment and display styles.

## Project data and reports {#project-data-and-reports}

The saved project combines the terminal geometry with its engineering objects and catalogs. Reports draw on this model to count berths, container blocks and equipment for each design option.
