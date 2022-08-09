import {
  BellIcon,
  CalendarIcon,
  StarIcon,
  TimeIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { Box, Button, Heading, Select, Stack } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import Frame from "../../../components/Frame";
import Post from "../../../components/Post";
import useMe from "../../../lib/hooks/useMe";
import { redditApi } from "../../../lib/reddit/redditApi";
import { withSessionSsr } from "../../../lib/session/withSession";
import buildUrlPath from "../../../lib/utils/buildUrlPath";

const getSubredditPath = (subreddit: string, sort: string, time: string) => {
  subreddit = subreddit || "popular";
  sort = sort || "hot";
  time = time || "day";

  let path = "/r/";
  path += subreddit;
  if (sort !== "hot") path += `/${sort}`;

  const query: Record<string, string> = {};
  if (sort === "top" && time) query["t"] = time;

  const fullpath = buildUrlPath(path, query);
  return { path, query, fullpath };
};

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (context) => {
    const { req } = context;

    const subreddit = context.query["subreddit"] as string;
    const sort = context.query["sort"] as string;
    const time = context.query["t"] as string;

    const { path, query } = getSubredditPath(subreddit, sort, time);

    const postsResponse = await redditApi(req, {
      method: "GET",
      path: path,
      query: query,
    });
    return {
      props: {
        initialPosts: postsResponse.data,
      },
    };
  }
);

type Props = {
  initialPosts: any;
};

const SubredditPage: FC<Props> = ({ initialPosts = {} }) => {
  const router = useRouter();
  const [posts, setPosts] = useState<any>(initialPosts);

  const subreddit = router.query["subreddit"] as string;
  const [sort, setSort] = useState<string>("best");
  const [time, setTime] = useState<string>("day");

  const { me } = useMe();

  useEffect(() => {
    (async () => {
      const { path, query } = getSubredditPath(subreddit, sort, time);
      const postsResponse = await axios.post("/api/reddit", {
        method: "GET",
        path: path,
        query: query,
      });
      setPosts(postsResponse.data);
    })();
  }, [me, subreddit, sort, time]);

  useEffect(() => {
    (() => {
      router.replace(
        getSubredditPath(subreddit, sort, time).fullpath,
        undefined,
        {
          shallow: true,
        }
      );
    })();
  }, [subreddit, sort, time]);

  const getHandleSortClick = (sortValue: string) => {
    const handleSortClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.preventDefault();
      setSort(sortValue);
    };
    return handleSortClick;
  };

  const handleTimeChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setTime(event.target.value);
  };

  return (
    <Frame>
      <Box>
        <Heading>{`r/${router.query["subreddit"]}`}</Heading>
      </Box>
      <Box>
        <Button leftIcon={<CalendarIcon />} onClick={getHandleSortClick("hot")}>
          Hot
        </Button>
        <Button leftIcon={<TimeIcon />} onClick={getHandleSortClick("new")}>
          New
        </Button>
        <Button leftIcon={<StarIcon />} onClick={getHandleSortClick("top")}>
          Top
        </Button>
        {sort === "top" && (
          <Select value={time} onChange={handleTimeChange}>
            <option value="hour">Now</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </Select>
        )}
        <Button
          leftIcon={<TriangleUpIcon />}
          onClick={getHandleSortClick("rising")}
        >
          Rising
        </Button>
      </Box>

      <Stack>
        {posts.data.children.map((post: any, index: number) => (
          <Post post={post} key={index} />
        ))}
      </Stack>
      <Button>more</Button>
    </Frame>
  );
};

export default SubredditPage;