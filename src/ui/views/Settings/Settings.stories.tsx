import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import Settings from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'views/Settings',
  component: Settings,

} as Meta<typeof Settings>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Settings> = (args: any) => <Settings {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  node: {
    id: "123:123",
    name: "Frame 1",
    type: "FRAME"
  }
}
 