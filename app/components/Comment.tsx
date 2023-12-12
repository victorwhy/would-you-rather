import type { Comment } from "@prisma/client"
import { useFetcher } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";

import { FormTypes } from "~/routes/topics.$topicId";
import { action as topicActionType } from "~/routes/topics.$topicId";

interface CommentProps {
  comment: Comment;
  commentList: Comment[];
  level: number;
  canReply: boolean;
  isAdding: boolean;
}

export default function Comment({ comment, commentList, level, canReply }: CommentProps) {
  const [replyOpen, setReplyOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher<typeof topicActionType>();
  const isAdding = fetcher.state === "submitting";
  const commentError = fetcher.data?.errors?.comment;

  useEffect(() => {
    if (!isAdding && !commentError) {
      setReplyOpen(false);
      formRef.current?.reset();
    }
  }, [isAdding, commentError])

  console.log(comment);

  const childComments = commentList.filter((childComment) => comment.id === childComment.parentId);
  const nestedComments = commentList.filter((childComment) => comment.id !== childComment.parentId);
  return (
    <div
      className="relative"
      style={{ paddingLeft: `${level / 2}rem`}}
    >
      <div className="flex flex-col w-full max-w-xl items-baseline">
        <p>{comment.body}</p>
        <button
          className=""
          onClick={() => setReplyOpen(!replyOpen)}
        >
          Reply
        </button>
      </div>
      {
        canReply && replyOpen ? (
          <fetcher.Form
            method="post"
            className="w-full max-w-xl"
            ref={formRef}
            preventScrollReset={true}
          >
            <input
              name="parentCommentId"
              value={comment.id}
              hidden
              readOnly
            />
            <textarea
              className="block border-2 border-black p-2 text-sm w-full h-20 leading-normal"
              name="commentBody"
              placeholder="Reply"
            />
            {commentError ? (
              <em className="block text-red-600">{commentError}</em>
            ) : null}
            <button
              className="bg-black mt-3 px-4 py-2 text-white hover:bg-gray-600 focus:bg-gray-400 transition-all"
              name="formName"
              value={FormTypes.COMMENT_FORM}
            >
              Post
            </button>
          </fetcher.Form>
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
              isAdding={isAdding}
            />
          )
        })
      }
    </div>
  )
}