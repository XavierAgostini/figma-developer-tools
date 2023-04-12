// This file holds the main code for the plugin. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).


interface FigmaPage {
  id: string;
  name: string;
}
interface FigmaNode {
  id: string;
  name: string;
  type: string;
  page: FigmaPage
}

interface FigmaPageNodes {
  page: FigmaPage;
  nodes: FigmaNode[]
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
  const matchingNodes: FigmaPageNodes[] = figma.root.children.reduce((acc: FigmaPageNodes[], pageNode) => {
    const pageInfo = { id: pageNode.id, name: pageNode.name }
    const nodes = pageNode.findAllWithCriteria({
      types: ["COMPONENT", "FRAME", "GROUP", "INSTANCE", "RECTANGLE", "TEXT", "VECTOR"],
    })
      .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
      .map(({ id, name, type }) => ({ id, name, type, page: pageInfo }))
      .filter(Boolean);
    acc.push({
      page: pageInfo,
      nodes
    })
    return acc
  }, [])
 
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
function sendCurrentPage () {
  const { id, name } = figma.currentPage
  figma.ui.postMessage({
    type: 'current-page-change-response',
    data: { id, name }
  })
}
figma.showUI(__html__, { width: 400, height: 550 }, );

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.on("selectionchange", () =>  sendCurrentSelection());

figma.on("currentpagechange", () =>  sendCurrentPage());
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

function findPageParent(node: any): PageNode | null {
  if (!node) return null;
  // @ts-ignore
  if (node?.type === 'PAGE' || !node?.parent.type) return node
  else if (node?.parent?.type === 'PAGE') {
    return node.parent
  } else {
    return findPageParent(node?.parent)
  }
}
figma.ui.onmessage = (msg: PluginMessage) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'select-node') {
    const node = figma.getNodeById(msg.data.id);
    if (node) {
      const parentPage = findPageParent(node)
      if (parentPage) {
        figma.currentPage = parentPage
        // @ts-ignore
        figma.currentPage.selection = [node];
      }
      figma.viewport.scrollAndZoomIntoView([node]);

    }
  }
  if (msg.type === 'scroll-to-node') {
    const node = figma.getNodeById(msg.data.id);
    if (node) {
      
      // figma.currentPage.selection = [node];
      const parentPage = findPageParent(node)
      if (parentPage) {
        figma.currentPage = parentPage
      }
      figma.viewport.scrollAndZoomIntoView([node]);
    }
  }
  if (msg.type === 'figma-search') {
    searchFigmaNodes(msg.data.query)
  }
  if (msg.type === 'get-current-selection') {
    sendCurrentSelection()
  }
  if (msg.type === 'get-current-page') {
    sendCurrentPage()
  }
};

