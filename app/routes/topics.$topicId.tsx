import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { incrementChoice } from "~/models/choice.server";
import { createComment } from "~/models/comment.server";
import { getTopic } from "~/models/topic.server";
import { addChoiceToSession, getChoicesFromSession, getUser } from "~/session.server";
import { calculatePercentage } from "~/utils";

enum FormTypes {
  TOPIC_FORM = "choice",
  COMMENT_FORM = "comment"
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.topicId, "topicId not found");
  const sessionChoices = await getChoicesFromSession(request);
  const user = await getUser(request);

  const topic = await getTopic(params.topicId);
  if (!topic) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ topic, sessionChoices, user });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.topicId, "topicId not found");

  const formData = await request.formData();
  const formName = formData.get("formName");

  switch (formName) {
    case FormTypes.TOPIC_FORM: {
      const choiceId = formData.get("choiceId");

      if (typeof choiceId !== "string" || choiceId.length === 0) {
        return json(
          { status: 400 },
        );
      }

      const choice = await incrementChoice(parseInt(choiceId));
      const cookie = await addChoiceToSession(request, parseInt(choiceId));

      return json(
        { choice },
        {
          headers: {
            "Set-Cookie": cookie,
          },
        }
      );
    }
    case FormTypes.COMMENT_FORM: {
      const user = await getUser(request);
      const commentBody = formData.get("commentBody");

      if (user === null) {
        return json(
          { status: 400 },
        );
      };

      if (typeof commentBody !== "string" || commentBody.length === 0) {
        return json(
          { status: 400 },
        );
      }

      const comment = await createComment({
        body: commentBody,
        topicId: params.topicId,
        authorId: user.id
      })

      return json(
        { comment },
      );
    }
  }
};

export default function TopicPage() {
  const data = useLoaderData<typeof loader>();
  const sortedChoices = data.topic.choices.sort((a, b) => a.id - b.id);
  const choice1 = sortedChoices[0];
  const choice2 = sortedChoices[1];
  const choice1Picked = data.sessionChoices.includes(choice1.id);
  const choice2Picked = data.sessionChoices.includes(choice2.id)
  const hasSubmitted = choice1Picked || choice2Picked;
  const totalVotes = choice1.votes + choice2.votes;

  return (
    <div className="w-full">
      <h1 className="text-2xl text-center font-bold px-2 py-5">{data.topic.title}?</h1>
      {
        data.topic.description ? (
          <p className="text-center px-3 pt-0 pb-5 max-w-lg mx-auto">{data.topic.description}</p>
        ) : null
      }
      <div className="choices-container flex flex-col md:flex-row w-full h-full text-2xl">
        <Form method="post" className="bg-black basis-1/2">
          <input value={choice1.id} name="choiceId" hidden readOnly/>
          <button
            className="w-full h-full p-5 hover:bg-gray-700 focus:bg-gray-700 transition-all"
            value={FormTypes.TOPIC_FORM}
            name="formName"
            disabled={hasSubmitted}
          >
            <p className="text-white">{choice1.body} {choice1Picked ? " picked" : null}</p>
            <p className={`text-white ${hasSubmitted ? "" : " hidden"}`}>{calculatePercentage(choice1.votes, totalVotes)}</p>
          </button>
        </Form>
        <Form method="post" className="bg-white basis-1/2">
          <input value={choice2.id} name="choiceId" hidden readOnly />
          <button
            className="w-full h-full p-5 hover:bg-gray-100 focus:bg-gray-100 transition-all"
            value={FormTypes.TOPIC_FORM}
            name="formName"
            disabled={hasSubmitted}
          >
            <p>{choice2.body}  {choice2Picked ? " picked" : null}</p>
            <p className={`${hasSubmitted ? "" : "hidden"}`}>{calculatePercentage(choice2.votes, totalVotes)}</p>
          </button>
        </Form>
      </div>
      <div className="p-3">
        <p>Comments</p>
        { data.user ? (
          <Form
            method="post"
          >
            <textarea
              className="block border-2 border-black px-3 text-sm w-full md:w-2/3 h-20 leading-loose"
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
        ): null}
        <div className={`${data.topic.comments.length ? "" : "hidden"}`}>
          {
            data.topic.comments.map((comment) => {
              return (
                <p key={comment.id}>{comment.body}</p>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Topic not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
