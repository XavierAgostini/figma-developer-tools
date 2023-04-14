import React, { useState } from 'react'
import { FigmaNode } from '../../types'
import FigmaItemList from '../FigmaItemList'
import { Icon } from "react-figma-plugin-ds"
import style from './style.module.css'

interface Props {
  nodes: FigmaNode[]
  pageInfo: FigmaNode['page']
}
const FigmaPageItem = ({ nodes, pageInfo }: Props) => {
  const [isCollapse, setIsCollapsed] = useState<boolean>(false)

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev)
  }
  
  if (nodes.length === 0) return null;
  return (
    <div className={style.page}>
      <div className={style.pageHeader} onClick={toggleCollapse}>
        <div className={style.pageTitle}>
          <Icon name={isCollapse ? 'caret-right' : 'caret-down'}/>
          <span>{pageInfo.name}</span>
        </div>
        <div className={style.pageCount}>{nodes.length} Results</div>
      </div>
      {!isCollapse && (
        <div className={style.itemList}>
          <FigmaItemList nodes={nodes} />
        </div>
      )}
    </div>
  )
}

export default FigmaPageItem