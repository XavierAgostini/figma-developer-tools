import React, { createContext, useState } from 'react'


interface SelectedItemsListContextProps {
  activeItemId: string | null;
  handleItemSelected: (id: string) => void;
}
const SelectedItemsListContext = createContext<SelectedItemsListContextProps>({
  activeItemId: null,
  handleItemSelected: (id: string) => null,
});

const SelectedItemsListProvider = ({ children }: { children: React.ReactElement | React.ReactElement[]}) => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

  const handleItemSelected = (id: string) => {
    if (activeItemId === id) {
      setActiveItemId(null)
    } else {
      setActiveItemId(id)
    }
  }
  return (
    <SelectedItemsListContext.Provider value={{ activeItemId, handleItemSelected }}>
      {children}
    </SelectedItemsListContext.Provider>
  );
};

export { SelectedItemsListContext, SelectedItemsListProvider }