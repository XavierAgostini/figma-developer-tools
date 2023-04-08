import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import FigmaItem from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/FigmaItem',
  component: FigmaItem,

} as Meta<typeof FigmaItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof FigmaItem> = (args: any) => <FigmaItem {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  node: {
    id: "123:123",
    name: "Frame 1",
    type: "FRAME"
  }
}
 