import { Box, Button, Select, VStack } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEventHandler, FC, useEffect, useState } from "react";

import Card from "../components/Card";
import Frame from "../components/Frame";
import Post from "../components/Post";
import Posts from "../components/Posts";
import useMe from "../lib/hooks/useMe";
import { redditApi } from "../lib/reddit/redditApi";
import { withSessionSsr } from "../lib/session/withSession";
import { getSearchPath } from "../lib/utils/urlUtils";

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (context) => {
    const { req } = context;

    const searchQuery = context.query["q"] as string;
    const sort = context.query["sort"] as string;
    const time = context.query["t"] as string;

    const { path, query } = getSearchPath(searchQuery, sort, time);

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

const SearchPage: FC<Props> = ({ initialPosts = {} }) => {
  const router = useRouter();

  const searchQuery = router.query["q"] as string;
  const [sort, setSort] = useState<string>("relevance");
  const [time, setTime] = useState<string>("all");
  const { me } = useMe();

  const [postListings, setPostListings] = useState([initialPosts]);
  const [after, setAfter] = useState<string | null>(
    initialPosts["data"]["after"]
  );

  useEffect(() => {
    (() => {
      router.push(getSearchPath(searchQuery, sort, time).pathname, undefined, {
        shallow: true,
      });
    })();
  }, [searchQuery, sort, time]);

  useEffect(() => {
    (async () => {
      const { path, query } = getSearchPath(searchQuery, sort, time);
      const postsResponse = await axios.post("/api/reddit", {
        method: "GET",
        path: path,
        query: query,
      });
      setPostListings([postsResponse.data]);
      setAfter(postsResponse.data["data"]["after"]);
    })();
  }, [me, searchQuery, sort, time]);

  const handleSortChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setSort(event.target.value);
  };

  const handleTimeChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setTime(event.target.value);
  };

  const handleClickMore = async () => {
    const { path, query } = getSearchPath(searchQuery, sort, time);
    const postsResponse = await axios.post("/api/reddit", {
      method: "GET",
      path: path,
      query: {
        ...query,
        after: after,
      },
    });
    setPostListings([...postListings, postsResponse.data]);
    setAfter(postsResponse.data["data"]["after"]);
  };

  return (
    <Frame>
      <Box maxWidth="xl" mx="auto">
        <VStack>
          <Card>
            <Select value={sort} onChange={handleSortChange}>
              <option value="relevance">Relevance</option>
              <option value="hot">Hot</option>
              <option value="top">Top</option>k<option value="new">New</option>
              <option value="comments">Comments</option>
            </Select>
            <Select value={time} onChange={handleTimeChange}>
              <option value="all">All Time</option>
              <option value="year">Past Year</option>
              <option value="month">Past Month</option>
              <option value="week">Past Week</option>
              <option value="day">Past 24 Hours</option>
              <option value="hour">Past Hour</option>
            </Select>
          </Card>
          <VStack>
            {postListings.map((posts: any, listingIndex: number) => {
              return posts.data.children.map((post: any, index: number) => (
                <Card key={listingIndex + index}>
                  <Post post={post} />
                </Card>
              ));
            })}
            {after && <Button onClick={handleClickMore}>more</Button>}
          </VStack>
        </VStack>
      </Box>
    </Frame>
  );
};

export default SearchPage;
