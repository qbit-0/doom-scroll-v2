import { GetServerSideProps } from "next";
import { FC } from "react";

import NavFrame from "../../../../../components/NavFrame";
import PageFrame from "../../../../../components/PageFrame";
import SubredditBanner from "../../../../../components/SubredditBanner";
import AboutSubredditPanel from "../../../../../components/panel/AboutSubredditPanel";
import SubredditRulesPanel from "../../../../../components/panel/SubredditRulesPanel";
import PostAndComments from "../../../../../components/panel_collection/PostAndComments";
import useReddit from "../../../../../lib/hooks/useReddit";
import {
  RedditRules,
  RedditSubreddit,
} from "../../../../../lib/reddit/redditDataStructs";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const subreddit = context.query["subreddit"] || "";
  const article = context.query["article"] || "";

  return {
    props: {
      subreddit: subreddit,
      article: article,
    },
  };
};

type Props = {
  article: string;
  subreddit: string;
};

const CommentsPage: FC<Props> = ({ article, subreddit }) => {
  const { data: subredditAbout } = useReddit<RedditSubreddit>({
    method: "GET",
    path: `/r/${subreddit}/about`,
  });
  const { data: subredditRules } = useReddit<RedditRules>({
    method: "GET",
    path: `/r/${subreddit}/about/rules`,
  });

  return (
    <NavFrame>
      <PageFrame
        top={
          <SubredditBanner
            subreddit={subreddit}
            subredditAbout={subredditAbout}
          />
        }
        left={<PostAndComments subreddit={subreddit} article={article} />}
        right={
          <>
            <AboutSubredditPanel subredditAbout={subredditAbout} />
            <SubredditRulesPanel subredditRules={subredditRules} />
          </>
        }
      />
    </NavFrame>
  );
};

export default CommentsPage;
