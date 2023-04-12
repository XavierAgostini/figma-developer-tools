export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  page: {
    id: string;
    name: string;
  }
}

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