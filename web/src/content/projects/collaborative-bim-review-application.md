---
title: BIM coordination software
format: Desktop application · Web portal · Backend services
---

We built the Navisworks conversion service, collaborative desktop viewer and web portal for managing project access. The viewer brings BIM models, drawings and project issues together for review by construction teams.

## Models and project information {#models-and-project-information}

A C#/.NET service converts Navisworks geometry to glTF and prepares the model hierarchy and element properties separately. Reviewers can browse that hierarchy and inspect element properties directly from the 3D model in the Unity viewer.

## Collaboration and access {#collaboration-and-access}

Construction teams can review a model in a shared session. The React portal manages user accounts, company membership and project access across the desktop application and AWS-hosted services.
