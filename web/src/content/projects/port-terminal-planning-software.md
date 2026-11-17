---
title: Port terminal design
format: Web CAD application
---

This web CAD application models the relationships between berths, quay walls, yards and equipment as designers revise a port terminal layout. Designers can compare alternatives using quantities drawn directly from each model.

## Layout and engineering objects {#layout-and-engineering-objects}

A reusable TypeScript CAD core handles geometry and editing. Port-specific rules place berths along quay walls and vessels within berths, and use catalog definitions for container blocks and equipment. Roads form a connected network, with junctions generated where they cross.

## Model-based quantity reporting {#project-data-and-reports}

Designers can open two terminal layouts side by side and inspect differences in their quantity reports. The reports count berths, container blocks and handling equipment directly from the objects in each layout.
