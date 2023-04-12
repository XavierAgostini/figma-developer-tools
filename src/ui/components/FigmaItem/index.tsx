import React, { useContext, useState } from 'react'
import ReactJson from 'react-json-view'
import classNames from 'classnames';
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
import { Button, Icon, Input, Label, Text, Title } from "react-figma-plugin-ds"
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
        // return <FigmaFrameIcon />;
        return <Icon name="frame" />
      case 'SECTION':
        return <FigmaSectionIcon />;
      case 'TEXT':
        return <FigmaTextIcon />;
      case 'RECTANGLE':
        return <FigmaImageIcon />
      case 'GROUP':
        return <FigmaGroupIcon />
      case 'COMPONENT':
        // return <FigmaComponentIcon />
        return <Icon name="component" color='purple' />
      case 'INSTANCE':
        // return <FigmaInstanceIcon />
        return <Icon name="instance" color='purple' />
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
          <Title size="xlarge">{node.name}</Title>
        </div>
      </div>
      {showDetails && (
        <div className={style.details}>
          <div className={style.detailsTabs}>
            <div
              className={classNames({
                [style.detailsTab]: true,
                [style.activeTab]: !showJsonTab
              })}
              onClick={onDetailsTabClick}
            >
              Details
            </div>
            <div
                className={classNames({
                  [style.detailsTab]: true,
                  [style.activeTab]: showJsonTab
                })}
              onClick={onJsonTabClick}
            >
              JSON
            </div>
          </div>
          <div className={style.detailsPanel}>
            {!showJsonTab && (
              <>
                <div className={style.detail}>
                  <Label className={style.detailLabel} size='small' weight='bold'>Type:</Label>
                  <Text size="small">{node.type}</Text>
                </div>
                <div className={style.detail}>
                  <Label className={style.detailLabel} size='small' weight='bold'>Page:</Label>
                  <Text size="small">{node?.page?.name}</Text>
                </div>
                <div className={style.detail}>
                  <Label className={style.detailLabel}  size='small' weight='bold'>Id:</Label>
                  <Text size="small">{node.id}</Text>
                </div>

                <div className={style.btnWrapper}>
                  <Button onClick={() => scrollToNode(node.id)}>Scroll to Node</Button>
                  <Button onClick={() => selectNode(node.id)} isSecondary={true}>Select Node</Button>
                </div>
              </>
            )}
            {showJsonTab && (
              <div>
                <Input type="text" icon='search' placeholder="Search Node Properties" onChange={onPropertySeach} className={style.propertySearchInput}/>
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