import React from 'react'
import { FigmaNode } from '../../types';
import style from './style.css'

interface Props {
  node: FigmaNode
}
const FigmaItem = (props: Props) => {
  const { node } = props

  const scrollToNode = (id: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'select-node', data: id } }, '*')
  }
  return (
    <div>
      <h3>name: {node.name}</h3>
      <p>id:{node.id}</p>
      <p>type:{node.type}</p>
      <button onClick={() => scrollToNode(node.id)}>Scroll to node</button>
    </div>
  )
}

export default FigmaItem;