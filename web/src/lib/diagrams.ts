import { exactKeys, isRecord, plainText } from "./validation.ts";

export interface DiagramNode {
  label: string;
  items: string[];
}

export interface ProjectDiagram {
  title: string;
  nodes: Record<string, DiagramNode>;
  caption: string;
}

function isDiagramNode(value: unknown): value is DiagramNode {
  return (
    exactKeys(value, ["label", "items"]) &&
    plainText(value.label) &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.length <= 4 &&
    value.items.every(plainText)
  );
}

export function isProjectDiagram(value: unknown): value is ProjectDiagram {
  return (
    exactKeys(value, ["title", "nodes", "caption"]) &&
    plainText(value.title) &&
    plainText(value.caption) &&
    isRecord(value.nodes) &&
    Object.keys(value.nodes).length > 0 &&
    Object.values(value.nodes).every(isDiagramNode)
  );
}

// Each project owns its node names and connections.
export function diagramNodes(diagram: ProjectDiagram, names: string[]) {
  if (!exactKeys(diagram.nodes, names))
    throw new Error(`${diagram.title}: diagram nodes do not match its layout`);
  return diagram.nodes;
}
