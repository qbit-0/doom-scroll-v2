import { Box, Heading } from "@chakra-ui/react";
import { FC } from "react";

import { RedditAccount } from "../lib/reddit/redditDataStructs";
import PostSkeleton from "./PostSkeleton";
import RedditAvatar from "./RedditAvatar";

type Props = { user?: RedditAccount };

const User: FC<Props> = ({ user }) => {
  if (!user) {
    return <PostSkeleton />;
  }

  return (
    <Box p="4">
      <RedditAvatar username={user.data.name} />
      <Heading>{user.data.name}</Heading>
    </Box>
  );
};

export default User;
