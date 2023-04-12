import React from 'react'
import style from './stye.module.css'
import FigmaPageItem from '../FigmaPageItem'
import { FigmaNode } from '../../types'

interface Props {
  nodes: FigmaNode[]
}
const FigmaPageList = ({ nodes }: Props) => {
  const pageInfo: {[key: string]: FigmaNode['page']} = {}
  console.log('nodes213', nodes)
  const pageSortedNodes = nodes.reduce((acc: any, node: FigmaNode) => {
    const pageId = node?.page?.id
    // console.log('pageId',pageId)
    acc[pageId] ??= []
    pageInfo[pageId] ??= node.page
    acc[pageId].push(node)
    return acc;
  }, {})
  console.log('pageSortedNodes',pageSortedNodes)
  return (
    <div className={style.container}>
    {
      Object.keys(pageSortedNodes).map((pageId: string) => (
        <FigmaPageItem
          key={pageId}
          nodes={pageSortedNodes[pageId]} 
          pageInfo={pageInfo[pageId]}
        />
      ))
    }
    </div>
  )
}

export default FigmaPageList