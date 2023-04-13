import React, { useContext, useEffect } from 'react'
import FigmaItemList from '../../components/FigmaItemList'
import { PluginMessageContext } from '../../context/PluginMessages'
import { SelectedItemsListProvider } from '../../context/SelectedItemsList'
import { Text } from 'react-figma-plugin-ds'
import style from './style.module.css';

const Selection = () => {
  const { selectedFigmaNodes } = useContext(PluginMessageContext)

  useEffect(function getIntialSelection () {
    window.parent.postMessage({ pluginMessage: { type: 'get-current-selection' } }, '*')
  }, [])

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Text size='small' weight='bold'>{selectedFigmaNodes.length} Item{selectedFigmaNodes.length !== 1 ? 's' : ''} Selected</Text>
      </div>
      <div className={style.body}>
        <SelectedItemsListProvider>
          <FigmaItemList nodes={selectedFigmaNodes} />
        </SelectedItemsListProvider>
      </div>
    </div>
  )
}

export default Selection;