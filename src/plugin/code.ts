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
  text?: string;
  previewText?: string;
  type: string;
  page: FigmaPage
}

interface FigmaPageNodes {
  page: FigmaPage;
  nodes: FigmaNode[]
}


function getNodeInfo(node: BaseNode, pageInfo: FigmaPage, query?: string): FigmaNode {
  let type: string = node.type
  let previewText;

  const text = type === 'TEXT' ? (node as TextNode).characters : undefined

  if (query !== undefined) {
    previewText = showMatchingText(query, text || '')
  }
   
  if (type === 'RECTANGLE') {
    const rectangleContainsImage = ( (node as RectangleNode).fills as ImagePaint[]).some((fill) => fill?.type === 'IMAGE')
    if (rectangleContainsImage) type = 'IMAGE'
  }
  return {
    id: node.id,
    name: node.name,
    type,
    page: pageInfo,
    text,
    previewText
  }
}

function showMatchingText(searchQuery: string, text: string) {
  const maxContextLength = 40; // maximum length of neighboring text
  const maxBeforeLength = 20; // maximum length of characters before the match
  const queryRegex = new RegExp(searchQuery, 'i'); // create case-insensitive regex for search query

  const matchIndex = text.search(queryRegex); // find index of first match
  if (matchIndex === -1) {
    return undefined; // if no match, return null
  }

  const contextStartIndex = Math.max(0, matchIndex - maxContextLength); // calculate start index of context
  const contextEndIndex = Math.min(text.length, matchIndex + searchQuery.length + maxContextLength); // calculate end index of context

  let contextText = text.substring(contextStartIndex, contextEndIndex); // extract context text
  if (contextStartIndex > maxBeforeLength) {
    contextText = '...' + contextText.substring(contextText.indexOf(' ', contextStartIndex - maxBeforeLength)); // add ellipsis and trim to first space if there is text before match
  } else if (contextStartIndex > 0) {
    contextText = '...' + contextText.substring(contextText.indexOf(' ')); // add ellipsis and trim to first space if there is text before match
  }
  if (contextEndIndex < text.length) {
    contextText = contextText.substring(0, contextText.lastIndexOf(' ')) + '...'; // trim to last space and add ellipsis if range doesn't go to end of text
  }

  // const matchText = contextText.replace(queryRegex, '<mark>$&</mark>'); // highlight match with <mark> tag

  return contextText;
}



async function searchFigmaNodes(input: {query: string; layerNameFilterEnabled: boolean; textValueFilterEnabled: boolean}) {
  const { query, layerNameFilterEnabled, textValueFilterEnabled } = input;
  if (!query) {
    figma.ui.postMessage({
      type: "figma-search-response",
      data: []
    });
    return
  }

  const shouldUseFigmaIdSearch = query.startsWith('id=')

  if (shouldUseFigmaIdSearch) {
   
    const apiIdQuery = query.replace('id=', '')
    const searchResult: FigmaPageNodes[] = []

    const node = figma.getNodeById(apiIdQuery)
    if (node) {
      const parentPage = findNodePage(node)
      if (parentPage) {
        const pageInfo = { id: parentPage.id, name: parentPage.name}
       
        const nodeInfo = getNodeInfo(node, pageInfo)
        searchResult.push({
          page: pageInfo,
          nodes: [nodeInfo]
        })
      }
    }
  
    figma.ui.postMessage({
      type: "figma-search-response",
      data: searchResult
    });
    return
  }
 
  // const matchingNodes = []
  const matchingNodes: FigmaPageNodes[] = figma.root.children.reduce((acc: FigmaPageNodes[], pageNode) => {
    const pageInfo = { id: pageNode.id, name: pageNode.name }
    const nodes = pageNode.findAllWithCriteria({
      types: layerNameFilterEnabled ? ["COMPONENT", "FRAME", "GROUP", "INSTANCE", "RECTANGLE", "TEXT", "VECTOR"] : ["TEXT"],
    })
      .filter(node => {
        const { name, type } = node
        const text = type === 'TEXT' ? (node as TextNode).characters.toLowerCase() : ''
        if (type === 'TEXT') {
          if (text.includes(query.toLowerCase())) return true
        }
        return name.toLowerCase().includes(query.toLowerCase())
      })
      .map(node => getNodeInfo(node, pageInfo, query))
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

function transformFigmaNodeToReadableJSON(node: any, query: string): any {
  // Get an array of [property name, property descriptor] pairs for the node's prototype
  const nodeProperties = Object.entries(Object.getOwnPropertyDescriptors(node.__proto__));

  // Define an array of property names to ignore when transforming the node
  const propertiesToIgnore = ["parent", "children", "removed", "textTruncation", "horizontalPadding"];

  // Create an object to hold the transformed node data
  let origin: any = {
    id: node.id,
    type: node.type,
    children: undefined
  };

  // If the node has a parent, add its parent's ID and type to the origin object
  if (node.parent) {
    origin.parent = {
      id: node.parent.id,
      type: node.parent.type
    };
  }

  // Iterate over each property of the node's prototype and add it to the origin object if it meets certain criteria
  for (const [propertyName, property] of nodeProperties) {
    // Check if the node's parent is a component set
    const parentNodeIsComponentSet = node.parent && node.parent.type === "COMPONENT_SET";

    // Only add the property if it has a getter, isn't in the propertiesToIgnore array, and either the node's parent isn't a component set or the property isn't "componentPropertyDefinitions"
    if (property.get && !propertiesToIgnore.includes(propertyName) && (!parentNodeIsComponentSet || propertyName !== "componentPropertyDefinitions")) {
      // Add the property value to the origin object
      origin[propertyName] = property.get.call(node);

      // If the property value is a symbol, set it to "Mixed" for readability
      if (typeof origin[propertyName] === "symbol") {
        origin[propertyName] = "Mixed";
      }
    }
  }

  if (query.trim() !== "") {
    const matchingProperties = Object.entries(origin)
      .filter(([propertyName, propertyValue]) => propertyName.toLowerCase().includes(query.toLowerCase()) || String(propertyValue).toLowerCase().includes(query.toLowerCase()))
      .map(([propertyName]) => propertyName);
    const filteredOrigin: any = matchingProperties.length > 0 ? { id: origin.id, name: origin.name } : {};
    matchingProperties.forEach((propertyName) => {
      filteredOrigin[propertyName] = origin[propertyName];
    });
    origin = filteredOrigin;
  }

  // If the node has children, recursively transform them and add them to the origin object
  if (node.children) {
    origin.children = node.children.map((child: any) => ({
      id: child.id,
      name: child.name,
      type: child.type
    }));
  }

  // If the node is a master component, recursively transform it and add it to the origin object
  if (node.masterComponent) {
    origin.masterComponent = transformFigmaNodeToReadableJSON(node.masterComponent, query);
  }

  let result: any = {
    id: origin.id,
    name: origin.name,
  };
  Object.keys(origin).sort().forEach((propertyName: string) => {
    if (result.hasOwnProperty(propertyName)) return
    result[propertyName] = origin[propertyName];``
  })

  return result;
}

function sendCurrentSelection () {
  const selectedNodes = figma.currentPage.selection.map(({ id }) => {
    const node =  figma.getNodeById(id);
    if (!node) return

    const pageInfo = {
      id: figma.currentPage.id,
      name: figma.currentPage.name
    }
    const nodeInfo = getNodeInfo(node, pageInfo)
    return nodeInfo
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
    query: string;
    layerNameFilterEnabled: boolean;
    textValueFilterEnabled: boolean;
  }
}
type GenericMessage = {
  type: string
  data: any
}
type PluginMessage = SelectNodeMessage | FigmaSearchMessage | GenericMessage

function findNodePage(node: any): PageNode | null {
  if (!node) return null;
  // @ts-ignore
  if (node?.type === 'PAGE' || !node?.parent.type) return node
  else if (node?.parent?.type === 'PAGE') {
    return node.parent
  } else {
    return findNodePage(node?.parent)
  }
}

function sendNodeJson (nodeId: string, query: string) {
  const node = figma.getNodeById(nodeId);
  if (!node) return
  const json = JSON.stringify(transformFigmaNodeToReadableJSON(node, query))
  figma.ui.postMessage({
    type: 'get-node-json-response',
    data: json
  })
}

figma.ui.onmessage = (msg: PluginMessage) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'select-node') {
    const node = figma.getNodeById(msg.data.id);
    if (node) {
      const parentPage = findNodePage(node)
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
      const parentPage = findNodePage(node)
      if (parentPage) {
        figma.currentPage = parentPage
      }
      figma.viewport.scrollAndZoomIntoView([node]);
    }
  }
  if (msg.type === 'figma-search') {
    searchFigmaNodes(msg.data)
  }
  if (msg.type === 'get-current-selection') {
    sendCurrentSelection()
  }
  if (msg.type === 'get-current-page') {
    sendCurrentPage()
  }
  if (msg.type === 'get-node-json') {
    const { id, query } = msg.data
    sendNodeJson(id, query)
  }
};

