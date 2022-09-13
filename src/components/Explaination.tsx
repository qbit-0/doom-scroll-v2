import { Box, Button, Heading, Text, Tooltip, VStack } from "@chakra-ui/react";
import { FC, useContext, useEffect } from "react";

import {
  CommentsFilter,
  CommentsFilterContext,
  defaultCommentsPreset,
  negativeCommentsPreset,
  positiveCommentsPreset,
} from "../lib/context/CommentsFilterProvider";
import {
  PostsFilter,
  PostsFilterContext,
  defaultPostsPreset,
  negativePostsPreset,
  positivePostsPreset,
} from "../lib/context/PostsFilterProvider";
import useLocalStorage from "../lib/hooks/useLocalStorage";
import Card from "./Card";

type Props = {};

const Explaination: FC<Props> = () => {
  const [savedPostsFilter, setSavedPostsFilter] =
    useLocalStorage("postsFilter");
  const { postsFilter, setPostsFilter } = useContext(PostsFilterContext);

  useEffect(() => {
    if (savedPostsFilter) setPostsFilter(savedPostsFilter);
  }, [savedPostsFilter, setPostsFilter]);

  const applyPostsPreset = (preset: PostsFilter) => {
    setPostsFilter(preset);
    setSavedPostsFilter(preset);
  };

  const [savedCommentsFilter, setSavedCommentsFilter] =
    useLocalStorage("commentsFilter");
  const { commentsFilter, setCommentsFilter } = useContext(
    CommentsFilterContext
  );

  useEffect(() => {
    if (savedCommentsFilter) setCommentsFilter(savedCommentsFilter);
  }, [savedCommentsFilter, setCommentsFilter]);

  const applyCommentsPreset = (preset: CommentsFilter) => {
    setCommentsFilter(preset);
    setSavedCommentsFilter(preset);
  };

  return (
    <Card>
      <Heading size="2xl" w="full" my="4" textAlign="center">
        DoomScroll
      </Heading>
      <Heading textAlign="center">
        The{" "}
        <Tooltip label="Show more positive posts and comments.">
          <Button
            colorScheme="blue"
            variant="outline"
            isActive={postsFilter.id === positivePostsPreset.id}
            onClick={(event) => {
              event.stopPropagation();
              if (postsFilter.id === positivePostsPreset.id) {
                applyPostsPreset(defaultPostsPreset);
                applyCommentsPreset(defaultCommentsPreset);
              } else {
                applyPostsPreset(positivePostsPreset);
                applyCommentsPreset(positiveCommentsPreset);
              }
            }}
          >
            <Heading fontSize="2xl">Best</Heading>
          </Button>
        </Tooltip>{" "}
        and{" "}
        <Tooltip label="Show more negative posts and comments.">
          <Button
            colorScheme="red"
            variant="outline"
            isActive={postsFilter.id === negativePostsPreset.id}
            onClick={(event) => {
              event.stopPropagation();
              if (postsFilter.id === negativePostsPreset.id) {
                applyPostsPreset(defaultPostsPreset);
                applyCommentsPreset(defaultCommentsPreset);
              } else {
                applyPostsPreset(negativePostsPreset);
                applyCommentsPreset(negativeCommentsPreset);
              }
            }}
          >
            <Heading fontSize="2xl">Worst</Heading>
          </Button>
        </Tooltip>{" "}
        of Reddit
      </Heading>
      <Box
        p="4"
        bgColor="gray.700"
        rounded="md"
        shadow="md"
        w="90%"
        mx="auto"
        my="4"
      >
        <Box position="relative" top="4">
          <Text textAlign="left" fontSize="4xl" lineHeight="0">{`“`}</Text>
        </Box>
        <Text px="8" textAlign="left" sx={{ textIndent: "16px" }}>
          {`Doomscroll: the tendency to continue to surf or scroll through bad
          news, even though that news is saddening, disheartening, or
          depressing.`}
        </Text>
        <Box position="relative" top="0">
          <Text textAlign="right" fontSize="4xl" lineHeight="0">{`”`}</Text>
        </Box>
      </Box>
      <VStack>
        <Text>
          {`DoomScroll analyzes the sentiment of posts and comments and allows you
        to filter them by different metrics. Ensure that your Reddit feed is
        more positive (or negative). Or only see posts above a certain upvote
        ratio threshold.`}
        </Text>
        <Text>
          {`Overall, filtering by only positive posts will lead to more positive
        interactions, with more agreeable content. Fitlering by only negative posts will lead to more contoversial posts
        and comments, including more angry, edgy, or depressing content.`}
        </Text>
      </VStack>
    </Card>
  );
};

export default Explaination;