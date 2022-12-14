import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import useLocalStorage from "../lib/hooks/useLocalStorage";
import { RedditAccount } from "../lib/reddit/redditDataStructs";
import { getUserAccessToken } from "../lib/reddit/redditOAuth";
import { requestReddit } from "../lib/reddit/redditServerApi";
import { withSessionSsr } from "../lib/session/withSession";

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (context) => {
    const { req } = context;
    // const error = context.query["error"] as string;
    const code = context.query["code"] as string;
    const state = JSON.parse(context.query["state"] as string);

    const accessTokenResponse = await getUserAccessToken(code);
    const userAccessToken = accessTokenResponse.data["access_token"];
    const userRefreshToken = accessTokenResponse.data["refresh_token"];
    const expiresIn = accessTokenResponse.data["expires_in"];

    const meResponse = await requestReddit(req, {
      method: "GET",
      path: "/api/v1/me",
      accessToken: userAccessToken,
    });
    const me = meResponse.data;

    req.session.user = {
      userAccessToken: {
        userAccessToken,
        userAccessTokenExpirationTime: Date.now().valueOf() + expiresIn,
      },
      userRefreshToken: userRefreshToken,
    };
    await req.session.save();

    return {
      props: { me, state },
    };
  }
);

type Props = {
  me: RedditAccount;
  state: { rand: string; next: string };
};

const AuthorizeCallbackPage: FC<Props> = ({ me, state }) => {
  const [_, setMe] = useLocalStorage<RedditAccount["data"]>("me");

  const router = useRouter();

  useEffect(() => {
    setMe(me);
    router.replace(state.next);
  }, [me, setMe, router, state.next]);

  return null;
};

export default AuthorizeCallbackPage;
