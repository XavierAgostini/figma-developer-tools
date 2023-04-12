import React from 'react'
import style from './stye.module.css'
import FigmaPageItem from '../FigmaPageItem'
import { FigmaNode, FigmaPageNodes} from '../../types'

interface Props {
  pages: FigmaPageNodes[]
}
const FigmaPageList = ({ pages }: Props) => {
  return (
    <div className={style.container}>
    {
      pages.map((page) => (
        <FigmaPageItem
          key={page.page.id}
          nodes={page.nodes} 
          pageInfo={page.page}
        />
      ))
    }
    </div>
  )
}

export default FigmaPageList