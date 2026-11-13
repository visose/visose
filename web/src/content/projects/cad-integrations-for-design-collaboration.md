---
title: CAD integrations for design collaboration
format: Rhino / Revit / SketchUp plugins
---

Extended an existing architectural design-review platform into Rhino, Revit and SketchUp by developing plugins that reuse the platform's interface.

Designers can publish models directly from their CAD software, while other participants review them in the platform's 3D viewer.

## Host integration {#host-integration}

The Rhino plugin hosts the platform's React interface in a WebView, with a bridge to model operations. Revit and SketchUp use their own host APIs for model access and geometry transfer, while reusing the platform's interface.
