import React, { useState } from 'react'
import { FigmaNode } from '../../types'
import FigmaItemList from '../FigmaItemList'
import style from './style.module.css'

interface Props {
  nodes: FigmaNode[]
  pageInfo: FigmaNode['page']
}
const FigmaPageItem = ({ nodes, pageInfo }: Props) => {
  const [isCollapse, setIsCollapsed] = useState<boolean>(false)
  console.log("TEST")
  const toggleCollapse = () => {
    console.log('toggleCollapse')
    setIsCollapsed(prev => !prev)
  }
  
  return (
    <div className={style.page}>
      <div className={style.pageHeader} onClick={toggleCollapse}>
        <div className={style.pageTitle}>{pageInfo.name}</div>
        <div className={style.pageCount}>{nodes.length} Results</div>
      </div>
      {!isCollapse && (
        <div className={style.itemList}>
          <FigmaItemList nodes={nodes} isScrollable={false}/>
        </div>
      )}
    </div>
  )
}

export default FigmaPageItem