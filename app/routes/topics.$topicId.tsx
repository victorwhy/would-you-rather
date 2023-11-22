import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { getTopic } from "~/models/topic.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.topicId, "topicId not found");

  const topic = await getTopic({ id: params.topicId });
  if (!topic) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ topic });
};

export default function TopicPage() {
  const data = useLoaderData<typeof loader>();
  const choice1 = data.topic.choices[0];
  const choice2 = data.topic.choices[1];

  return (
    <div className="w-full">
      <h1 className="text-2xl text-center font-bold py-5">{data.topic.title}?</h1>
      <div className="flex flex-col md:flex-row w-full h-full text-2xl">
        <button className="bg-black basis-1/2 p-5">
          <p className="text-white">{choice1.body}</p>
        </button>
        <button className="bg-white basis-1/2 p-5">
          <p>{choice2.body}</p>
        </button>
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
