import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createTopic } from "~/models/topic.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("title");
  const choice1 = formData.get("choice1");
  const choice2 = formData.get("choice2");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { description: null, choice1: null, choice2: null, title: "Title is required" } },
      { status: 400 },
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { title: null, choice1: null, choice2: null, description: "Description is required" } },
      { status: 400 },
    );
  }

  if (typeof choice1 !== "string" || choice1.length === 0) {
    return json(
      { errors: { title: null, choice2: null, description: null, choice1: "Choice 1 is required" } },
      { status: 400 },
    );
  }

  if (typeof choice2 !== "string" || choice2.length === 0) {
    return json(
      { errors: { title: null, choice1: null, description: null, choice2: "Choice 2 is required" } },
      { status: 400 },
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { title: null, choice1: null, description: null, choice2: "Choice 2 is required" } },
      { status: 400 },
    );
  }

  const topic = await createTopic({ title, description, choice1, choice2, userId });

  return redirect(`/topics/${topic.id}`);
};

export default function NewTopicPage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const choice1Ref = useRef<HTMLInputElement>(null);
  const choice2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            rows={4}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.description ? (
          <div className="pt-1 text-red-700" id="description-error">
            {actionData.errors.description}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Choice 1: </span>
          <input
            ref={choice1Ref}
            name="choice1"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.choice1 ? true : undefined}
            aria-errormessage={
              actionData?.errors?.choice1 ? "choice1-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.choice1 ? (
          <div className="pt-1 text-red-700" id="choice1-error">
            {actionData.errors.choice1}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Choice 2: </span>
          <input
            ref={choice2Ref}
            name="choice2"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.choice2 ? true : undefined}
            aria-errormessage={
              actionData?.errors?.choice2 ? "choice2-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.choice2 ? (
          <div className="pt-1 text-red-700" id="choice2-error">
            {actionData.errors.choice2}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
