import React, { createContext, useEffect, useState } from 'react';
import { FigmaPluginMessage, FigmaNode } from '../types';

interface PluginMessageContextProps {
  selectedFigmaNodes: FigmaNode[];
  figmaSearchResults: FigmaNode[];
}
const PluginMessageContext = createContext<PluginMessageContextProps>({
  selectedFigmaNodes: [],
  figmaSearchResults: [],
});

const PluginMessageProvider = ({ children }: { children: React.ReactElement[]}) => {
  const [selectedFigmaNodes, setSelectedFigmaNodes] = useState<FigmaNode[]>([]);
  const [figmaSearchResults, setFigmaSearchResults] = useState<FigmaNode[]>([]);

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
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <PluginMessageContext.Provider value={{ selectedFigmaNodes, figmaSearchResults }}>
      {children}
    </PluginMessageContext.Provider>
  );
};

export { PluginMessageContext, PluginMessageProvider };