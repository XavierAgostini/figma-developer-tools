import React, { useState } from 'react'
import { FigmaNode } from '../../types';
import style from './style.module.css'

interface Props {
  node: FigmaNode
}
const FigmaItem = (props: Props) => {
  const { node } = props
  const [showDetails, setShowDetails] = useState<boolean>(false)

  const toggleShowDetails = () => setShowDetails(prev => !prev)

  const scrollToNode = (id: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'select-node', data: {id} } }, '*')
  }
  return (
    <div className={style.figmaItem}>
      <div className={style.header} onClick={toggleShowDetails}>
        <div className={style.figmaItemType}>{node.type}</div>
        <div className={style.figmaItemName}>{node.name}</div>
        <div className={style.figmaItemNodeId}>{node.id}</div>
      </div>
      {showDetails && (
        <div className={style.details}>
          <div>Type: {node.type}</div>
          <div>Name: {node.name}</div>
          <div>Id: {node.id}</div>
          <div>Parent: TODO</div>
          <button onClick={() => scrollToNode(node.id)}>scroll to node</button>
        </div>
      )}
    </div>
  )
}

export default FigmaItem;