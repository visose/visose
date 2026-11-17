---
title: CAD integrations for design collaboration
format: Rhino / Revit / SketchUp plugins
---

We built Rhino, Revit and SketchUp plugins for a shared design-review platform. Designers publish models directly from the CAD application and colleagues review them in a shared 3D viewer.

## Host integration {#host-integration}

In Rhino, a WebView hosts the platform's React interface and a bridge connects its commands to the CAD document. The Revit and SketchUp plugins reuse that interface and handle model access and geometry transfer through their respective host APIs. Rhino and Revit users can publish a selection from the model for a focused review.
