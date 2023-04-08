import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { withMemoryRouter } from '../../mocks/storybookDecoractors';
import Navbar from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Navbar',
  component: Navbar,
  decorators: [withMemoryRouter],

} as Meta<typeof Navbar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Navbar> = (args: any) => <Navbar {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  
};