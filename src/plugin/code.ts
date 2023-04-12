// This file holds the main code for the plugin. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).


interface FigmaNode {
  id: string;
  name: string;
  type: string;
  page: {
    id: string;
    name: string;
  }
}
async function searchFigmaNodes(query: string) {
  if (!query) {
    figma.ui.postMessage({
      type: "figma-search-response",
      data: []
    });
    return
  }
  // const matchingNodes = []
  const matchingNodes: FigmaNode[] = figma.root.children.reduce((acc, pageNode) => {
    const pageInfo = { id: pageNode.id, name: pageNode.name }
    const nodes = pageNode.findAllWithCriteria({
      types: ["COMPONENT", "FRAME", "GROUP", "INSTANCE", "RECTANGLE", "TEXT", "VECTOR"],
    })
      .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
      .map(({ id, name, type }) => ({ id, name, type, page: pageInfo }))
      .filter(Boolean);
    acc.push(...nodes)
    return acc
  }, [] as FigmaNode[])
 
  figma.ui.postMessage({
    type: "figma-search-response",
    data: matchingNodes
  });
}

function sendCurrentSelection () {
  const selectedNodes = figma.currentPage.selection.map(({ id }) => {
    const node =  figma.getNodeById(id);
    if (!node) return

    let type: string = node.type
    if (type === 'RECTANGLE') {
     const rectangleContainsImage = ( (node as RectangleNode).fills as ImagePaint[]).some((fill) => fill?.type === 'IMAGE')
     if (rectangleContainsImage) type = 'IMAGE'
    }
    return {
      id: node.id,
      name: node.name,
      type: node.type,
    }
  }).filter(Boolean)

  figma.ui.postMessage({
    type: "selection-change-response",
    data: selectedNodes
  });
}
figma.showUI(__html__, { width: 400, height: 550 }, );

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.on("selectionchange", () =>  sendCurrentSelection());

type SelectNodeMessage = {
  type: "select-node";
  data: {
    id: string
  }
}
type FigmaSearchMessage = {
  type: "figma-search";
  data: {
    query: string
  }
}
type GenericMessage = {
  type: string
  data: any
}
type PluginMessage = SelectNodeMessage | FigmaSearchMessage | GenericMessage

figma.ui.onmessage = (msg: PluginMessage) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'select-node') {
    const node = figma.getNodeById(msg.data.id);
    if (node) {
      // @ts-ignore
      // figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
    }
  }
  if (msg.type === 'figma-search') {
    searchFigmaNodes(msg.data.query)
  }
  if (msg.type === 'get-current-selection') {
    sendCurrentSelection()
  }
};

