import React from 'react'
import { Title, Text, Button } from "react-figma-plugin-ds";

import style from './style.module.css'

const ErrorFallback = (_props: any) => {
  const handleClose = () => {
    window.parent.postMessage({ pluginMessage: { type: 'close-plugin', data: {} } }, '*');
  }
  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <Title size='xlarge' weight='bold'>Oops! Something went wrong.</Title>
        <Text>Please close the plugin and try again.</Text>
        <Button onClick={handleClose}>
          Close Plugin
        </Button>
      </div>
     
    </div>
  )
}

export default ErrorFallback;