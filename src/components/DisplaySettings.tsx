import { Box, Heading, Switch, useColorMode } from "@chakra-ui/react";
import { FC, useContext } from "react";

import ContentCard from "../ContentCard";
import { DisplaySettingsContext } from "../lib/context/DisplaySettingsProvider";

type Props = {};

const DisplaySettings: FC<Props> = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    showFilteredPosts: showFilteredContent,
    setShowFilteredPosts,
    showAdvancedSettings,
    setShowAdvancedSettings,
  } = useContext(DisplaySettingsContext);

  return (
    <ContentCard>
      <Heading size="lg">DoomScroll Display Settings</Heading>
      <Box>
        <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode}>
          Dark Mode
        </Switch>
      </Box>
      <Box>
        <Switch
          isChecked={showFilteredContent}
          onChange={() => {
            setShowFilteredPosts(!showFilteredContent);
          }}
        >
          Show Filtered Posts
        </Switch>
      </Box>
      <Box>
        <Switch
          isChecked={showAdvancedSettings}
          onChange={() => {
            setShowAdvancedSettings(!showAdvancedSettings);
          }}
        >
          Show Advanced Settings
        </Switch>
      </Box>
    </ContentCard>
  );
};

export default DisplaySettings;
