import { FC, useEffect, useState } from "react";

import useReddit from "../lib/hooks/useReddit";
import {
  RedditComment,
  RedditLink,
  RedditListing,
  RedditMore,
} from "../lib/reddit/redditDataStructs";
import { getCommentsPath } from "../lib/reddit/redditUrlUtils";
import Card from "./Card";
import Comments from "./Comments";
import Post from "./Post";

type Props = {
  subreddit: string;
  article: string;
  commentId?: string;
  initialPost?: RedditLink;
  initialComments?: RedditListing<RedditComment | RedditMore>;
  openModal?: boolean;
};

const PostAndComments: FC<Props> = ({
  subreddit,
  article,
  commentId,
  initialPost,
  initialComments,
  openModal = true,
}) => {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState(initialComments);

  const { path, query } = getCommentsPath(subreddit, article, commentId);
  const postAndComments = useReddit<any>({ method: "GET", path, query });

  useEffect(() => {
    if (postAndComments) {
      setPost(postAndComments[0].data.children[0]);
      setComments(postAndComments[1]);
    }
  }, [postAndComments]);

  // if (location.pathname === pathname) {
  //   history.replaceState(
  //     null,
  //     "",
  //     getPathname(
  //       postsResponse.data[0]["data"]["children"][0]["data"]["permalink"],
  //       query
  //     )
  //   );
  // }

  return (
    <>
      <Card>
        <Post post={post} openModal={openModal} />
      </Card>
      <Card>
        <Comments
          initialComments={comments}
          subreddit={subreddit}
          article={article}
        />
      </Card>
    </>
  );
};

export default PostAndComments;
