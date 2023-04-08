import React, { useState, useEffect } from 'react'
import FigmaItem from '../../components/FigmaItem'
import style from './style.css'

const Selection = () => {
  const [selectedNodes, setSelectedNodes] = useState<any[]>([])
  useEffect(function onWindowMessage () {
    const handleWindowMessage = (event: any) => {
      if (event.data.pluginMessage.type === 'selectionchange') {
        const nodes = event.data.pluginMessage.data;
        setSelectedNodes(nodes)
      }
    }
    // get figma file id
    // window.parent.postMessage({ pluginMessage: { type: 'get-figma-file-id' } }, '*')
    // // initial call to get current page
    window.parent.postMessage({ pluginMessage: { type: 'get-current-selection' } }, '*')

    window.addEventListener('message', handleWindowMessage)
    return () => window.removeEventListener('message', handleWindowMessage)
  }, [])

 
  return (
    <div>
      <h1>Selection</h1>
      <div>
        <h2>Selected Nodes</h2>
        {selectedNodes.map((node) => {
          return (
            <FigmaItem key={node.id} node={node}/>
          )
        })}
      </div>
    </div>
  )
}

export default Selection;