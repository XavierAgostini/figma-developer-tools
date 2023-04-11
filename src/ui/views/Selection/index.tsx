import React, { useContext, useState, useEffect } from 'react'
import FigmaItemList from '../../components/FigmaItemList'
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.module.css';

const Selection = () => {
  const { selectedFigmaNodes } = useContext(PluginMessageContext)

  useEffect(function getIntialSelection () {
    window.parent.postMessage({ pluginMessage: { type: 'get-current-selection' } }, '*')
  }, [])

  return (
    <div className={style.container}>
      <div className={style.title}>Selection</div>
      <FigmaItemList nodes={selectedFigmaNodes} />
    </div>
  )
}

export default Selection;