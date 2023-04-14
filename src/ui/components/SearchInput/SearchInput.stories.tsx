import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import SearchInput from '.';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/SearchInput',
  component: SearchInput,

} as Meta<typeof SearchInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof SearchInput> = (args: any) => <SearchInput {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  placeholder: "Search",
  searchInputRef: React.createRef(),
  onChange: () => {}
};