import { Avatar, Box, Flex, Heading } from "@chakra-ui/react";
import axios from "axios";
import { FC, useEffect, useState } from "react";

type Props = {
  subreddit: string;
  showTitle: boolean;
};

const SubredditBanner: FC<Props> = ({ subreddit, showTitle }) => {
  const [about, setAbout] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const aboutResponse = await axios.post("/api/reddit", {
        method: "GET",
        path: `/r/${subreddit}/about`,
      });
      setAbout(aboutResponse.data);
    })();
  }, [subreddit]);

  let background;
  if (about?.["data"]?.["banner_background_image"]) {
    background = (
      <Box
        w="full"
        h="36"
        bgImage={about["data"]["banner_background_image"]}
        bgPos="center"
      />
    );
  } else if (about?.["data"]["header_img"]) {
    background = (
      <Flex
        justify="center"
        align="center"
        bgColor={about["data"]["banner_background_color"]}
        h="36"
      >
        <Box bgImage={about["data"]["header_img"]} bgPos="center" />
      </Flex>
    );
  } else {
    background = <Box w="full" h="36" bgColor="gray" />;
  }

  return (
    <Box>
      {background}
      {showTitle && (
        <Flex justify="center" position="relative" bgColor="darkgray">
          <Box p="4" w="5xl">
            <Avatar
              name="r /"
              src={
                about?.["data"]?.["community_icon"] ||
                about?.["data"]?.["icon_img"]
              }
              size="xl"
              mt="-8"
            />
            <Box ml="2" display="inline-block">
              <Heading> {about?.["data"]?.["title"]}</Heading>
              <Heading size="md">{`r/${subreddit}`}</Heading>
            </Box>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default SubredditBanner;
