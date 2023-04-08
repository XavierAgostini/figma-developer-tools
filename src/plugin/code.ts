// This file holds the main code for the plugin. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

async function getFigmaStorageInfo() {
  console.log('getFigmaStorageInfo')
  const storageKeys = await figma.clientStorage.keysAsync();
  const data = storageKeys.reduce(async (acc: any, key) => {
    acc[key] = await figma.clientStorage.getAsync(key);
  }, {});
  figma.ui.postMessage({
    type: "figma-storage-info-response",
    data
  });
}

async function searchFigmaNodes(query: string) {
  console.log('searchFigmaNodes')
  const nodes = figma.currentPage.findAllWithCriteria({
    types: ["COMPONENT", "FRAME", "GROUP", "INSTANCE", "RECTANGLE", "TEXT", "VECTOR"],
  }).filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))

  const data = nodes.map(({ id, name, type }) => ({ id, name, type }));
  figma.ui.postMessage({
    type: "figma-search-response",
    data
  });
}

function sendCurrentSelection () {
  const selectedNodes = figma.currentPage.selection.map(({ id }) => {
    const node =  figma.getNodeById(id);
    if (!node) return
    return {
      id: node.id,
      name: node.name,
      type: node.type,
    }
  }).filter(Boolean)
  console.log('selectedNodes',selectedNodes)
  figma.ui.postMessage({
    type: "selectionchange",
    data: selectedNodes
  });
}
figma.showUI(__html__, { width: 300, height: 500 }, );

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.on("selectionchange", () =>  sendCurrentSelection());

figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'get-figma-storage-info') {
    getFigmaStorageInfo()
  }
  if (msg.type === 'select-node') {
    const node = figma.getNodeById(msg.data);
    if (node) {
      // @ts-ignore
      // figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
    }
  }
  if (msg.type === 'figma-search') {
    searchFigmaNodes(msg.data)
  }
  if (msg.type === 'get-current-selection') {
    sendCurrentSelection()
  }
};

