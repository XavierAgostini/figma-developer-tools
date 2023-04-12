import React, { useContext, useState } from 'react'
import ReactJson from 'react-json-view'
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
import { Button, Input } from "react-figma-plugin-ds"
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.module.css'

interface Props {
  node: FigmaNode
}
const FigmaItem = (props: Props) => {
  const { node } = props
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [showJsonTab, setShowJsonTab] = useState<boolean>(false)

  const { clearSelectedFigmaNodeJSON, selectedFigmaNodeJSON } = useContext(PluginMessageContext)

  const toggleShowDetails = () => {
    clearSelectedFigmaNodeJSON()
    window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id, query: "" } } }, '*')
    setShowDetails(prev => !prev)
  }

  const selectNode = (id: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'select-node', data: {id} } }, '*')
  }
  const scrollToNode = (id: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'scroll-to-node', data: {id} } }, '*')
  }

  const onDetailsTabClick = () => setShowJsonTab(false)
  const onJsonTabClick = () => {
    // clearSelectedFigmaNodeJSON()
    // window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id} } }, '*')
    setShowJsonTab(true)
  }
  
  const onPropertySeach = (query: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id, query} } }, '*')
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

  const getNodeJSON = () => {
    try {
      return JSON.parse(selectedFigmaNodeJSON)
    } catch (error) {
      console.error("Error parsing node json", error)
      return {
        error: "Error parsing node json"
      }
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
          <div className={style.detailsTabs}>
            <div className={style.detailsTab} onClick={onDetailsTabClick}>Details</div>
            <div className={style.detailsTab} onClick={onJsonTabClick}>JSON</div>
          </div>
          <div className={style.detailsPanel}>
            {!showJsonTab && (
              <>
                <div>
                  <strong>Type: </strong>{node.type}
                </div>
                <div>
                  <strong>Name: </strong>
                  {node.name}
                </div>
                <div>
                  <strong>Id: </strong>
                  {node.id}</div>
                <div><strong>Parent: </strong> TODO</div>
                <div className={style.btnWrapper}>
                  <Button onClick={() => scrollToNode(node.id)}>Scroll to Node</Button>
                  <Button onClick={() => selectNode(node.id)} isSecondary={true}>Select Node</Button>
                </div>
              </>
            )}
            {showJsonTab && (
              <div>
                <Input type="text" placeholder="Search" onChange={onPropertySeach}/>
                <ReactJson src={getNodeJSON()} collapsed={1} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FigmaItem;