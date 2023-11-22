import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { createTopic } from "~/models/topic.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description") as string | null;
  const choice1 = formData.get("choice1");
  const choice2 = formData.get("choice2");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", description: null, choice1: null, choice2: null } },
      { status: 400 },
    );
  }

  if (typeof choice1 !== "string" || choice1.length === 0) {
    return json(
      { errors: { title: null, description: null, choice1: "Choice 1 is required", choice2: null } },
      { status: 400 },
    );
  }

  if (typeof choice2 !== "string" || choice2.length === 0) {
    return json(
      { errors: { title: null, choice2: "Choice 2 is required", choice1: null, description: null } },
      { status: 400 },
    );
  }

  const topic = await createTopic({ title, description, choice1, choice2, userId });

  return redirect(`/topics/${topic.id}`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  return null;
};

const CHOICE1_PLACEHOLDER = "Eat red pasta";
const CHOICE2_PLACEHOLDER = "Eat white pasta";

export default function NewTopicPage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const choice1Ref = useRef<HTMLInputElement>(null);
  const choice2Ref = useRef<HTMLInputElement>(null);
  const [choice1, setChoice1] = useState<string>("");
  const [choice2, setChoice2] = useState<string>("");

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    } else if (actionData?.errors?.choice1) {
      choice1Ref.current?.focus();
    } else if (actionData?.errors?.choice2) {
      choice2Ref.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="w-full p-4 max-w-md mx-auto">
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-xl font-bold">
            Would you rather... 
          </h1>
          <div className="mt-2 font-bold">
            <p className="text-lg">
              {choice1 ? `${choice1}?` : (<span className="opacity-50">{CHOICE1_PLACEHOLDER}?</span>)}
            </p>
            <p className="text-center">
              or
            </p>
            <p className="text-lg text-right">
              {choice2 ? `${choice2}?` : (<span className="opacity-50">{CHOICE2_PLACEHOLDER}?</span>)}
            </p>
          </div>
        </div>
      </div>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%"
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Title: </span>
            <input
              ref={titleRef}
              name="title"
              placeholder="Red or White Pasta?"
              className="flex-1 border-2 border-black px-3 text-lg leading-loose"
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
            <span>Choice 1: </span>
            <input
              ref={choice1Ref}
              name="choice1"
              placeholder="Eat red pasta?"
              className="flex-1 border-2 border-black px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.choice1 ? true : undefined}
              aria-errormessage={
                actionData?.errors?.choice1 ? "choice1-error" : undefined
              }
              value={choice1}
              onChange={(e) => setChoice1(e?.target.value)}
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
              placeholder="Eat white pasta?"
              className="flex-1 border-2 border-black px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.choice2 ? true : undefined}
              aria-errormessage={
                actionData?.errors?.choice2 ? "choice2-error" : undefined
              }
              value={choice2}
              onChange={(e) => setChoice2(e?.target.value)}
            />
          </label>
          {actionData?.errors?.choice2 ? (
            <div className="pt-1 text-red-700" id="choice2-error">
              {actionData.errors.choice2}
            </div>
          ) : null}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Description: </span>
            <textarea
              ref={descriptionRef}
              name="description"
              placeholder="(Optional) Give a little context here... red - tomato, white - butter/cream!"
              rows={4}
              className="w-full flex-1 border-2 border-black px-3 py-2 text-lg leading-6"
            />
          </label>
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="bg-black px-4 py-2 text-white hover:bg-gray-600 focus:bg-gray-400"
          >
            Save
          </button>
        </div>
      </Form>
    </div>
  );
}
