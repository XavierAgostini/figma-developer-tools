import React, {useEffect, useState} from 'react';
import { MemoryRouter } from "react-router-dom";
import { PluginMessageContext } from "../context/PluginMessages";
import { FigmaPageNodes, FigmaPluginMessage } from '../types';
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
        const filteredResults = figmaNodes.filter(node => node.name.toLowerCase().includes(query.toLowerCase()))
          .reduce((acc: any, node: any) => {
            if (!acc[node.pageId]) {
              acc[node.pageId] = {
                id: node.pageId,
                name: node.pageName,
                nodes: []
              }
            }
          }, {});
        setSearchResults(filteredResults);
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
        currentFigmaPage: { id: '0:1', name: 'Page 1'}
      }}>
      <Story />
    </PluginMessageContext.Provider>
  );
}