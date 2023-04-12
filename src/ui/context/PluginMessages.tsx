import React, { createContext, useEffect, useState } from 'react';
import { FigmaPluginMessage, FigmaNode, FigmaPageNodes, FigmaPage } from '../types';

interface PluginMessageContextProps {
  selectedFigmaNodes: FigmaNode[];
  figmaSearchResults: FigmaPageNodes[];
  currentFigmaPage: FigmaPage | null;
}
const PluginMessageContext = createContext<PluginMessageContextProps>({
  selectedFigmaNodes: [],
  figmaSearchResults: [],
  currentFigmaPage: null,
});

const PluginMessageProvider = ({ children }: { children: React.ReactElement[]}) => {
  const [selectedFigmaNodes, setSelectedFigmaNodes] = useState<FigmaNode[]>([]);
  const [figmaSearchResults, setFigmaSearchResults] = useState<FigmaPageNodes[]>([]);
  const [currentFigmaPage, setCurrentFigmaPage] = useState<FigmaPage | null>(null);

  useEffect(() => {
    const handleMessage = (event: FigmaPluginMessage) => {
      if (event.data.pluginMessage.type === 'selection-change-response') {
        const nodes = event.data.pluginMessage.data;
        setSelectedFigmaNodes(nodes)
      }
      if (event.data.pluginMessage.type === 'figma-search-response') {
        const nodes = event.data.pluginMessage.data;
        setFigmaSearchResults(nodes)
      }
      if (event.data.pluginMessage.type === 'current-page-change-response') {
        const currentPageInfo = event.data.pluginMessage.data;
        setCurrentFigmaPage(currentPageInfo)
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <PluginMessageContext.Provider value={{ selectedFigmaNodes, figmaSearchResults, currentFigmaPage }}>
      {children}
    </PluginMessageContext.Provider>
  );
};

export { PluginMessageContext, PluginMessageProvider };