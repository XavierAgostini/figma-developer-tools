import React from 'react'
import FigmaItem from '../FigmaItem'
import { FigmaNode } from '../../types'
import { Text } from 'react-figma-plugin-ds'
import style from './style.module.css'

interface Props {
  nodes: FigmaNode[]
}
const FigmaItemList = ({ nodes }: Props) => {
  if (!nodes.length) {
    return (
      <div className={style.noResults}>
        <Text size="xlarge">Select one or more Figma layers</Text>
      </div>
    )
  }
  return (
    <div 
      className={style.container}
    >
      {nodes.map(node => (
        <FigmaItem key={node.id} node={node} />
      ))}
    </div>
  )
}

export default FigmaItemList