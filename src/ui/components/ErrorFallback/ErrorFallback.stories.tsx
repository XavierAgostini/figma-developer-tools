import React from 'react'
import ErrorFallback from ".";
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'ErrorFallback',
  component: ErrorFallback,
} as ComponentMeta<typeof ErrorFallback>;

export const Primary: ComponentStory<typeof ErrorFallback> = () => {
  return (
    <div style={{ width: '440px', height: '480px', overflow: 'scroll', margin: '0 auto', border: '1px solid #000' }}>
      <ErrorFallback />
    </div>
  ) 
}
  
Primary.args = {
  error: { 
    message: 'Something went wrong'
  }
}