import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useFetcher,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { incrementChoice } from "~/models/choice.server";
import { getTopic } from "~/models/topic.server";
import { addChoiceToSession, getChoicesFromSession } from "~/session.server";
import { calculatePercentage } from "~/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.topicId, "topicId not found");
  const sessionChoices = await getChoicesFromSession(request);

  const topic = await getTopic({ id: params.topicId });
  if (!topic) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ topic, sessionChoices });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.topicId, "topicId not found");

  const formData = await request.formData();
  const choiceId = formData.get("choiceId");

  if (typeof choiceId !== "string" || choiceId.length === 0) {
    return json(
      { status: 400 },
    );
  }

  console.log("submitted ChoiceId", choiceId);

  const choice = await incrementChoice({ id: parseInt(choiceId) });
  const cookie = await addChoiceToSession(request, parseInt(choiceId));

  return json(
    { choice },
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
};

export default function TopicPage() {
  const fetcher = useFetcher();
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
      <fetcher.Form
        className="choices-container flex flex-col md:flex-row w-full h-full text-2xl"
        method="post"
      >
        <button
          className="bg-black basis-1/2 p-5 hover:bg-gray-700 focus:bg-gray-700 transition-all"
          value={choice1.id}
          name="choiceId"
          disabled={hasSubmitted}
        >
          <p className="text-white">{choice1.body} {choice1Picked ? " picked" : null}</p>
          <p className={`text-white ${hasSubmitted ? "" : " hidden"}`}>{calculatePercentage(choice1.votes, totalVotes)}</p>
        </button>
        <button
          className="bg-white basis-1/2 p-5 hover:bg-gray-100 focus:bg-gray-100 transition-all"
          value={choice2.id}
          name="choiceId"
          disabled={hasSubmitted}
        >
          <p>{choice2.body}  {choice2Picked ? " picked" : null}</p>
          <p className={`${hasSubmitted ? "" : "hidden"}`}>{calculatePercentage(choice2.votes, totalVotes)}</p>
        </button>
      </fetcher.Form>
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
