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

We built a computer-vision system that turns batches of stadium photographs into a seat inventory. It identifies seat types, reads seat numbers and uses row markers and photo order to establish where seats belong. A web application lets reviewers check uncertain records against the original photographs before export.

## Classification and recognition {#classification-and-recognition}

An image classifier trained on client-supplied examples identifies seat types. Optical character recognition reads the labels. When a number is missing or unclear, the system uses sector folders, row-label boundaries and the expected seat sequence to help assign its location. Low-confidence or conflicting results go to review.

## Review and export {#review-and-export}

The application flags records that share the same sector, row and seat number. Reviewers can correct seat types and locations against the original photographs, including assigning seat categories introduced after classifier training. The application exports the corrected records and photograph references as CSV for inventory and sales software developed by other teams.
