import React from 'react'
import FigmaItem from '../FigmaItem'
import { FigmaNode } from '../../types'
import style from './style.module.css'

const FigmaItemList = ({ nodes }: { nodes: FigmaNode[]}) => {
  return (
    <div className={style.container}>
      {nodes.map(node => (
        <FigmaItem key={node.id} node={node} />
      ))}
    </div>
  )
}

export default FigmaItemList