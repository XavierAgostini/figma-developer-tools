import { ReactNode } from "react";
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

// Mesages recieved from the plugin UI

export interface SelectOption  {
  value: string;
  label: string;
  icon: ReactNode;
  count?: number;
  isSelected: boolean;
}


type SelectNodeMessage = {
  type: "select-node";
  data: {
    id: string
  }
}
type SearchMessage = {
  type: "figma-search";
  data: {
    query: string;
    layerNameFilterEnabled: boolean;
    textValueFilterEnabled: boolean;
  }
}
type CurrentSelectionMessage = {
  type: "get-current-selection";
  data: {}
}
type ScrollToNodeMessage = {
  type: "scroll-to-node";
  data: {
    id: string
  }
}
type GetCurrentPageMessage = {
  type: "get-current-page";
  data: {}
}
type ClosePluginMessage = {
  type: "close-plugin";
  data: {}
}
type GetNodeJsonMessage = {
  type: 'get-node-json'
  data: {
    id: string;
    query: string;
  }
}
export type PluginMessage = SelectNodeMessage | ScrollToNodeMessage | SearchMessage | CurrentSelectionMessage | GetCurrentPageMessage | GetNodeJsonMessage | ClosePluginMessage
