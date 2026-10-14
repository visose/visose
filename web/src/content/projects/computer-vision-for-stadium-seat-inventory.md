---
title: Computer vision for stadium-seat inventory
format: Computer vision · Web application
diagram:
  title: Image processing and inventory review
  nodes:
    photos:
      label: Photograph batches
      items:
        - Sector folders
        - Seats and row labels
        - Ordered image sequences
    classification:
      label: Image classification
      items:
        - Client-supplied training examples
        - Seat types and row-label images
        - Prediction confidence
    recognition:
      label: Number recognition
      items:
        - OCR of seat labels
        - Missing or unreadable numbers
    sequence:
      label: Photo order and location
      items:
        - Sector and photo order
        - Row-label boundaries
        - Expected seat sequence
    records:
      label: Inventory records
      items:
        - Sector, row and seat identifiers
        - Seat type and source photograph
        - Recognition and sequence checks
        - Records flagged for review
    review:
      label: Review application
      items:
        - Photograph and record comparison
        - Filters for uncertain results
        - Seat-type and number corrections
        - Conflicting identifier checks
    export:
      label: Inventory export
      items:
        - Reviewed CSV records
        - Photograph references
  caption: Image recognition and photograph order are combined to identify seats. Users review uncertain or conflicting records before export.
---

Developed a computer-vision system that converts stadium-seat photographs into a structured inventory.

The system uses image recognition, photograph order and row markers to identify seat types and locations. Users review and correct records in a web application before export to inventory and sales systems.

## Classification and recognition {#classification-and-recognition}

An image classifier trained on client-supplied examples identifies seat types, while number recognition reads seat labels. Sector folders, photograph order and row-label images help assign each seat's location when a number is difficult to read. Uncertain or conflicting results are flagged for review.

## Review and export {#review-and-export}

The web application displays records alongside their source photographs. Users can correct seat type, row and number, including categories added after classifier training, then export the reviewed records as CSV for inventory and sales software developed by other teams.
