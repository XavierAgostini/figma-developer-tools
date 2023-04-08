import React, {useEffect, useState} from 'react';
import { MemoryRouter } from "react-router-dom";
import { PluginMessageContext } from "../context/PluginMessages";
import { FigmaNode, FigmaPluginMessage } from '../types';
import { figmaNodes } from './mockFigmaData';

export const withMemoryRouter = (Story: any) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

export const withPluginMessageContext = (Story: any) => {
  const [searchResults, setSearchResults] = useState<FigmaNode[]>([]);
  useEffect(function mockFigmaPluginMessages () {
    const handleMessage = (event: FigmaPluginMessage) => {
      if (event?.data?.pluginMessage?.type === 'figma-search') {
        const { query } = event.data.pluginMessage.data;
        if (!query) {
          setSearchResults([]);
          return;
        }
        setSearchResults(figmaNodes.filter(node => node.name.toLowerCase().includes(query.toLowerCase())));
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
      }}>
      <Story />
    </PluginMessageContext.Provider>
  );
}