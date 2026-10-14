---
title: BIM coordination software
format: Desktop application · Web portal · Backend services
---

Developed the desktop application, web portal and model-processing backend for a collaborative BIM platform.

Construction teams can review models together, inspect element properties and access the related drawings and project issues in one workspace.

## Models and project information {#models-and-project-information}

A C#/.NET service converted Navisworks models into the product's glTF-based format, retaining the element properties needed for BIM review.

The Unity application organizes models by project and discipline. Users can navigate the 3D model, inspect element properties and work with associated drawings and issue records.

## Collaboration and access {#collaboration-and-access}

Shared model sessions support collaborative review. A React web application manages user accounts, company membership and project access, integrated with the desktop application and AWS-hosted services.
