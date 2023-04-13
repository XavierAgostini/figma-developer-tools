import React, { useContext, useEffect } from 'react'
import FigmaItemList from '../../components/FigmaItemList'
import { PluginMessageContext } from '../../context/PluginMessages'
import { SelectedItemsListProvider } from '../../context/SelectedItemsList'
import { Title } from "react-figma-plugin-ds";
import style from './style.module.css';

const Selection = () => {
  const { selectedFigmaNodes } = useContext(PluginMessageContext)

  useEffect(function getIntialSelection () {
    window.parent.postMessage({ pluginMessage: { type: 'get-current-selection' } }, '*')
  }, [])

  return (
    <div className={style.container}>
      <Title size='xlarge'>Select</Title>
      <SelectedItemsListProvider>
        <FigmaItemList nodes={selectedFigmaNodes} isScrollable={true} />
      </SelectedItemsListProvider>
    </div>
  )
}

export default Selection;