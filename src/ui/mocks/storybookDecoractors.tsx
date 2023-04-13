import React, {useEffect, useState} from 'react';
import { MemoryRouter } from "react-router-dom";
import { PluginMessageContext } from "../context/PluginMessages";
import { FigmaNode, FigmaPageNodes, FigmaPluginMessage } from '../types';
import { figmaNodes } from './mockFigmaData';

export const withMemoryRouter = (Story: any) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

export const withPluginMessageContext = (Story: any) => {
  const [searchResults, setSearchResults] = useState<FigmaPageNodes[]>([]);
  useEffect(function mockFigmaPluginMessages () {
    const handleMessage = (event: FigmaPluginMessage) => {
      if (event?.data?.pluginMessage?.type === 'figma-search') {
        const { query } = event.data.pluginMessage.data;
        if (!query) {
          setSearchResults([]);
          return;
        }
        const filteredNodes = figmaNodes.filter(node => node.name.toLowerCase().includes(query.toLowerCase()))

        const filteredResults = filteredNodes.reduce((acc: any, node: FigmaNode) => {
          if (!acc[node.page.id]) {
            acc[node.page.id] = {
              page: node.page,
              nodes: []
            }
          }
          acc[node.page.id].nodes.push(node);
          return acc;
        }, {});
        
        setSearchResults(Object.values(filteredResults));
      }
    };

    window.parent.addEventListener('message', handleMessage);

    return () => {
      window.parent.removeEventListener('message', handleMessage);
    };
  }, []);
  return (
    <PluginMessageContext.Provider 
      value={{
        figmaSearchResults: searchResults,
        selectedFigmaNodes: figmaNodes,
        currentFigmaPage: { id: '0:1', name: 'Page 1'},
        selectedFigmaNodeJSON: {},
        clearSelectedFigmaNodeJSON: () => {}
      }}>
      <Story />
    </PluginMessageContext.Provider>
  );
}