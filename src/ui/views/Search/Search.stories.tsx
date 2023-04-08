import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { withMemoryRouter, withPluginMessageContext } from '../../mocks/storybookDecoractors'

import Search from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'views/Search',
  component: Search,
  decorators: [withMemoryRouter, withPluginMessageContext],

} as Meta<typeof Search>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Search> = (args: any) => <Search {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  node: {
    id: "123:123",
    name: "Frame 1",
    type: "FRAME"
  }
}
 