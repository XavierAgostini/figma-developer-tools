import React from 'react'
import FigmaItem from '../FigmaItem'
import { FigmaNode } from '../../types'
import { Text } from 'react-figma-plugin-ds'
import style from './style.module.css'
import classNames from 'classnames'

interface Props {
  nodes: FigmaNode[]
  isScrollable: boolean
}
const FigmaItemList = ({ nodes, isScrollable }: Props) => {
  if (!nodes.length) {
    return (
      <div className={style.noResults}>
        <Text size="xlarge">Select a Figma Node</Text>
      </div>
    )
  }
  return (
    <div 
      className={classNames({
        [style.container]: true,
        [style.scrollableContainer]: isScrollable
      })}
    >
      {nodes.map(node => (
        <FigmaItem key={node.id} node={node} />
      ))}
    </div>
  )
}

export default FigmaItemList