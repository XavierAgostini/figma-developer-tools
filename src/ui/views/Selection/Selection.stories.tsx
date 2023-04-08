import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { withMemoryRouter, withPluginMessageContext } from '../../mocks/storybookDecoractors'
import Selection from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'views/Selection',
  component: Selection,
  decorators: [withMemoryRouter, withPluginMessageContext],

} as Meta<typeof Selection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Selection> = (args: any) => <Selection {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  node: {
    id: "123:123",
    name: "Frame 1",
    type: "FRAME"
  }
}
 