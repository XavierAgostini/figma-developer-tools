import React, { useContext, useState, useEffect } from 'react'
import FigmaItem from '../../components/FigmaItem'
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.css'

const Selection = () => {
  const { selectedFigmaNodes } = useContext(PluginMessageContext)

  useEffect(function getIntialSelection () {
    window.parent.postMessage({ pluginMessage: { type: 'get-current-selection' } }, '*')
  }, [])

 
  return (
    <div>
      <h1>Selection</h1>
      <div>
        <h2>Selected Nodes</h2>
        {selectedFigmaNodes.map((node) => {
          return (
            <FigmaItem key={node.id} node={node}/>
          )
        })}
      </div>
    </div>
  )
}

export default Selection;