import React, { useContext, useState } from 'react'
import ReactJson from 'react-json-view'
import classNames from 'classnames';
import { FigmaNode } from '../../types';
import { SelectedItemsListContext } from '../../context/SelectedItemsList'

import {
  FigmaTextIcon,
  FigmaImageIcon,
  FigmaGroupIcon,
  FigmaComponentIcon,
  FigmaSqureIcon,
  FigmaInstanceIcon,
  FigmaFrameIcon,
  FigmaStarIcon,
  FigmaLineIcon,
  FigmaEllipseIcon,
  FigmaShapeIcon,
  FigmaSectionIcon,
  FigmaStickyIcon,
  FigmaWidgetIcon,
  FigmaSliceIcon
} from '../FigmaIcons'
import { Button, Input, Label, Text, Title } from "react-figma-plugin-ds"
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.module.css'

interface Props {
  node: FigmaNode;
}
const FigmaItem = (props: Props) => {
  const { node } = props
  const [showJsonTab, setShowJsonTab] = useState<boolean>(false)

  const { activeItemId, handleItemSelected } = useContext(SelectedItemsListContext)
  const { clearSelectedFigmaNodeJSON, selectedFigmaNodeJSON } = useContext(PluginMessageContext)

  const toggleShowDetails = () => {
    clearSelectedFigmaNodeJSON()
    window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id, query: "" } } }, '*')
    handleItemSelected(node.id)
  }

  const selectNode = (id: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'select-node', data: {id} } }, '*')
  }
  const scrollToNode = (id: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'scroll-to-node', data: {id} } }, '*')
  }

  const onDetailsTabClick = () => setShowJsonTab(false)
  const onJsonTabClick = () => {
    window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id, query: '' } } }, '*')
    setShowJsonTab(true)
  }
  
  const onPropertySeach = (query: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id, query} } }, '*')
  }

  const getFigmaNodeIcon = (type: string) => {
    switch (type) {
      case 'FRAME':
        return <FigmaFrameIcon/>
      case 'SECTION':
        return <FigmaSectionIcon />;
      case 'TEXT':
        return <FigmaTextIcon />;
      case 'RECTANGLE':
        return <FigmaSqureIcon />
      case "IMAGE":
        return <FigmaImageIcon />
      case 'GROUP':
        return <FigmaGroupIcon />
      case 'COMPONENT':
        return <FigmaComponentIcon />
      case 'COMPONENT_SET':
        return <FigmaComponentIcon />
      case 'INSTANCE':
        return <FigmaInstanceIcon />
      case "POLYGON":
        return <FigmaShapeIcon />
      case "STAR":
        return <FigmaStarIcon />
      case "LINE":
        return <FigmaLineIcon />
      case "ELLIPSE":
        return <FigmaEllipseIcon />
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
          {getFigmaNodeIcon(node.type)}
          <Text weight='bold' size="large">{node.name}</Text>
        </div>
      </div>
      {activeItemId === node.id && (
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
          <hr className={style.divider}/>
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
              <div className={style.propertyDetails}>
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