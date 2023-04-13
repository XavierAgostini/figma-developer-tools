import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { withMemoryRouter } from '../../mocks/storybookDecoractors';
import SearchFilterDropdown from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/SearchFilterDropdown',
  component: SearchFilterDropdown,
  decorators: [withMemoryRouter],

} as Meta<typeof SearchFilterDropdown>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof SearchFilterDropdown> = (args: any) => (
  <div style={{height: 600 }}>
    <SearchFilterDropdown {...args} />
  </div>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  
};