import React, { useState } from 'react'
import { FigmaNode } from '../../types';
import {
  FigmaTextIcon,
  FigmaImageIcon,
  FigmaGroupIcon,
  FigmaComponentIcon,
  FigmaInstanceIcon,
  FigmaFrameIcon,
  FigmaShapeIcon,
  FigmaSectionIcon,
  FigmaStickyIcon,
  FigmaWidgetIcon,
  FigmaSliceIcon
} from '../FigmaIcons'
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

  const getFigmaNodeIcon = (type: string) => {
    switch (type) {
      case 'FRAME':
        return <FigmaFrameIcon />;
      case 'SECTION':
        return <FigmaSectionIcon />;
      case 'TEXT':
        return <FigmaTextIcon />;
      case 'RECTANGLE':
        return <FigmaImageIcon />
      case 'GROUP':
        return <FigmaGroupIcon />
      case 'COMPONENT':
        return <FigmaComponentIcon />
      case 'INSTANCE':
        return <FigmaInstanceIcon />
      case "POLYGON":
        return <FigmaShapeIcon />
      case "STAR":
        return <FigmaShapeIcon />
      case "LINE":
        return <FigmaShapeIcon />
      case "ELLIPSE":
        return <FigmaShapeIcon />
      case 'VECTOR':
        return <FigmaShapeIcon />
      case 'STICKY':
        return <FigmaStickyIcon />
      case 'WIDGET':
        return <FigmaWidgetIcon />
      case "SLICE":
        return <FigmaSliceIcon />
      default:
        return null
    }
  }
  return (
    <div className={style.figmaItem}>
      <div className={style.header} onClick={toggleShowDetails}>
        <div className={style.figmaItemName}>
          {/* <i className={getFigmaNodeIconClassNameByType(node.type)}/> */}
          {getFigmaNodeIcon(node.type)}
          <span>{node.name}</span>
        </div>
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