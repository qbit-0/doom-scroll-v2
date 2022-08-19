import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { FC } from "react";

import NavBarFrame from "./NavBarFrame";
import PageFrame from "./PageFrame";
import PostAndComments from "./PostAndComments";
import SubredditAbout from "./SubredditAbout";
import SubredditBanner from "./SubredditBanner";
import SubredditRules from "./SubredditRules";

type Props = {
  post: any;
  isOpen: boolean;
  onClose: () => void;
};

const PostsAndCommentsModal: FC<Props> = ({ post, isOpen, onClose }) => {
  const subreddit = post["data"]["subreddit"];
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      motionPreset="slideInBottom"
      scrollBehavior="outside"
    >
      <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
      <ModalContent mt="0">
        <ModalBody p="2">
          <NavBarFrame subreddit={post["data"]["subreddit"]}>
            <PageFrame
              top={<SubredditBanner showTitle={false} subreddit={subreddit} />}
              left={
                <PostAndComments
                  article={post["data"]["id"]}
                  initialPost={post}
                  openModal={false}
                />
              }
              right={
                <>
                  <SubredditAbout subreddit={subreddit} />
                  <SubredditRules subreddit={subreddit} />
                </>
              }
            />
          </NavBarFrame>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PostsAndCommentsModal;
