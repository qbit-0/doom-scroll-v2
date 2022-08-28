import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Link,
  PropsOf,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";

import useNlp from "../lib/hooks/useNlp";
import useReddit from "../lib/hooks/useReddit";
import getRedditCommentsText from "../lib/reddit/getRedditCommentsText";
import {
  RedditLink,
  RedditPostAndComments,
} from "../lib/reddit/redditDataStructs";
import { getCommentsPath } from "../lib/reddit/redditUrlUtils";
import { getElapsedString } from "../lib/utils/getElapsedString";
import Card from "./Card";
import PostBody from "./PostBody";
import PostSkeleton from "./PostSkeleton";
import PostsAndCommentsModal from "./PostsAndCommentsModal";

type Props = {
  post?: RedditLink;
  openModal?: boolean;
} & PropsOf<typeof Card>;

const Post: FC<Props> = ({ post, openModal = true, ...innerProps }) => {
  const router = useRouter();
  const savedPath = router.asPath;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: titleNlp } = useNlp(post?.data.title);

  const { path, query } = post
    ? getCommentsPath(post?.data.subreddit, post?.data.id)
    : { path: undefined, query: undefined };

  const { data: postAndComments } = useReddit<RedditPostAndComments>(
    path && query ? { method: "GET", path, query } : null
  );
  const comments = postAndComments ? postAndComments[1] : undefined;

  const commentsText = comments ? getRedditCommentsText(comments) : null;
  const { data: commentsNlp } = useNlp(commentsText);

  if (!post) {
    return <PostSkeleton />;
  }

  const handleOpenModal = () => {
    const pathname = `/r/${post.data.subreddit}/comments/${post.data.id}`;
    history.replaceState(null, "", pathname);
    onOpen();
  };

  return (
    <Card {...innerProps}>
      <Box>
        <Flex>
          <Box bgColor="red.100" w="18" p="4">
            <VStack w="18" alignItems="start">
              <Text>Sentiment</Text>
              <Box>
                <Text>{`${Math.round(post.data.upvote_ratio * 100)}%`}</Text>
                <Text>upvote</Text>
              </Box>
              {titleNlp && (
                <Box>
                  <Text>{`${titleNlp.sentiment}`}</Text>
                  <Text>title</Text>
                </Box>
              )}
              {commentsNlp && (
                <Box>
                  <Text>{`${commentsNlp.sentiment}`}</Text>
                  <Text>comments</Text>
                </Box>
              )}
            </VStack>
          </Box>
          <Box p="4" bgColor="blue.100" flex="1">
            <HStack>
              <Avatar
                name={"r /"}
                src={
                  post.data?.sr_detail?.community_icon ||
                  post.data?.sr_detail?.icon_img
                }
                size="sm"
              />
              <HStack display="inline" divider={<> &middot; </>}>
                <Heading size="sm" display="inline" color="red">
                  <NextLink href={`/r/${post.data.subreddit}`}>
                    <Link size="sm">{post.data.subreddit}</Link>
                  </NextLink>
                </Heading>
                <Heading size="sm" display="inline">
                  {post.data.author}
                </Heading>
                <Heading size="sm" display="inline" color="gray">
                  {getElapsedString(post.data.created_utc)}
                </Heading>
              </HStack>
            </HStack>
            <Link
              size="sm"
              onClick={() => {
                if (openModal) handleOpenModal();
              }}
            >
              <Heading>{post.data.title}</Heading>
            </Link>
            <Box mt="2" bgColor="gray.100">
              <PostBody post={post} />
            </Box>
          </Box>
        </Flex>
        <HStack
          px="4"
          py="2"
          bgColor="green.100"
          divider={<StackDivider borderColor="black" />}
        >
          <Box>
            <IconButton
              display="inline"
              icon={<Icon as={BiUpvote} />}
              aria-label="upvote"
            />
            <Text display="inline">{post.data.score}</Text>
            <IconButton
              display="inline"
              icon={<Icon as={BiDownvote} />}
              aria-label="downvote"
            />
          </Box>
          <Box>
            <Text display="inline">{`${post.data.num_comments}`}</Text>
            <IconButton
              display="inline"
              icon={<Icon as={IoChatboxOutline} />}
              aria-label="comments"
              onClick={() => {
                if (openModal) handleOpenModal();
              }}
            />
          </Box>
        </HStack>
      </Box>
      <PostsAndCommentsModal
        post={post}
        isOpen={isOpen}
        onClose={() => {
          history.replaceState(null, "", savedPath);
          onClose();
        }}
      />
    </Card>
  );
};

export default Post;
