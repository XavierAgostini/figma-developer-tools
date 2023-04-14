export interface FigmaPage {
  id: string;
  name: string;
}
export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  text?: string;
  previewText?: string;
  page: FigmaPage
}
export interface FigmaPageNodes {
  page: FigmaPage;
  nodes: FigmaNode[]
}

export type FigmaPageFilter =  "CURRENT" | "ALL";

type FigmaSelectionChangeMessage = {
  type: "selection-change-response";
  data: FigmaNode[];
}
type FigmaSearchMessage = {
  type: "figma-search-response";
  data: FigmaNode[];
}
type GenericFigmaMessage = {
  type: string;
  data: any;
}
export interface FigmaPluginMessage {
  data: {
    pluginMessage: FigmaSelectionChangeMessage | FigmaSearchMessage | GenericFigmaMessage;
  }
  origin: string;
}

export interface SelectOption  {
  value: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  isSelected: boolean;
}