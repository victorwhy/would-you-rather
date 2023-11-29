import type { Comment } from "@prisma/client"
import {
  Form
} from "@remix-run/react";
import { useState } from "react";

import { FormTypes } from "~/routes/topics.$topicId";

interface CommentProps {
  comment: Comment;
  commentList: Comment[];
  level: number;
  canReply: boolean;
}

export default function Comment({ comment, commentList, level, canReply }: CommentProps) {
  const [replyOpen, setReplyOpen] = useState(false)

  const childComments = commentList.filter((childComment) => comment.id === childComment.parentId);
  const nestedComments = commentList.filter((childComment) => comment.id !== childComment.parentId);
  return (
    <div
      className="relative"
      style={{ paddingLeft: `${level / 2}rem`}}
    >
      <div className="flex flex-row w-full max-w-xl">
        <p>{comment.body}</p>
        <button
          className="pl-2"
          onClick={() => setReplyOpen(!replyOpen)}
        >
          Reply
        </button>
      </div>
      {
        canReply && replyOpen ? (
          <Form
            method="post"
            className="w-full max-w-xl"
          >
            <input
              name="parentCommentId"
              value={comment.id}
              hidden
              readOnly
            />
            <textarea
              className="block border-2 border-black px-3 text-sm w-full h-20 leading-loose"
              name="commentBody"
              placeholder="Reply"
            />
            <button
              className="bg-black mt-3 px-4 py-2 text-white hover:bg-gray-600 focus:bg-gray-400 transition-all"
              name="formName"
              value={FormTypes.COMMENT_FORM}
            >
              Post
            </button>
          </Form>
        ) : null
      }
      {
        childComments.map((comment) => {
          return (
            <Comment
              key={comment.id}
              comment={comment}
              commentList={nestedComments}
              level={level + 1}
              canReply={canReply}
            />
          )
        })
      }
    </div>
  )
}