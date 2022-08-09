import Frame from "./Frame";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "Components/Frame",
  component: Frame,
} as ComponentMeta<typeof Frame>;

const Template: ComponentStory<typeof Frame> = (args) => <Frame {...args} />;

export const LoggedOut = Template.bind({});

export const LoggedIn = Template.bind({});