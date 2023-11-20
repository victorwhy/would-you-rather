import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { UpvoteArrow } from "~/images/Upvote";
import { getTopics } from "~/models/topic.server";
import { calculatePercentage } from "~/utils";

interface Choice {
  body: string;
  votes: number;
}

interface TopicItem {
  id: string;
  title: string;
  votes: number;
  choices: Choice[];
}

export const loader = async () => {
  const topics = await getTopics();
  return json({ topics });
};

const TopicItem = ({ id, title, votes, choices }: TopicItem) => {
  const choice1 = choices[0];
  const choice2 = choices[1];
  const totalVotes = choice1.votes + choice2.votes;

  return (
    <div className="flex flex-row p-3 border border-solid border-slate-200 w-full">
      <div className="flex">
        <button>
          <UpvoteArrow />
        </button>
        <p>{Number(votes)}</p>
      </div>
      <Link to={id}>
        <div className="flex flex-row">
          <p>
            {title}
          </p>
          <div className="flex flex-row">
            <p>
              {choice1.body}
            </p>
            <p>
              {calculatePercentage(choice1.votes, totalVotes)}
            </p>
          </div>
          <div  className="flex flex-row">
            <p>
              {choice2.body}
            </p>
            <p>
              {calculatePercentage(choice2.votes, totalVotes)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function TopicIndexPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <ol>
        {data.topics.map((topic) => (
          <li key={topic.id}>
            <TopicItem
              id={topic.id}
              title={topic.title}
              votes={topic.votes}
              choices={topic.choices}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
