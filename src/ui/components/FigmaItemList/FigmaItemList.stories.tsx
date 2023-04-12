import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { figmaNodes } from "../../mocks/mockFigmaData";
import FigmaItemList from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/FigmaItemList',
  component: FigmaItemList,

} as Meta<typeof FigmaItemList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof FigmaItemList> = (args: any) => (
  <div style={{ width: 500, margin: '0 auto', padding: 16}}>
    <FigmaItemList {...args} />
  </div>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  nodes: figmaNodes,
  isScrollable: true
};