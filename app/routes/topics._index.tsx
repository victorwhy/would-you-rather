import type { Choice, Topic } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getTopics, getTopicsVotes } from "~/models/topic.server";
import { calculatePercentage } from "~/utils";

interface TopicItem {
  id: string;
  title: string;
  choices: Choice[];
  index: number;
}

export const loader = async () => {
  const topics = await getTopics();
  const topicVotes = await getTopicsVotes() as {id: string, topic_votes: number}[];
  const topicsSorted = topicVotes.map(({id}:{id: string}) => id);
  console.log(topicVotes);
  return json({ topics, topicsSorted });
};

const TopicItem = ({ id, title, choices, index }: TopicItem) => {
  const sortedChoices = choices.sort((a, b) => a.id - b.id);
  const choice1 = sortedChoices[0];
  const choice2 = sortedChoices[1];
  const totalVotes = choice1.votes + choice2.votes;

  return (
    <Link to={id} className="w-full flex flex-row">
      <div className="flex justify-center items-center w-10 bg-black text-white border-t border-r">
        {index}
      </div>
      <div className="w-full">
        <div className="flex justify-between p-1 pl-2 pr-2 border-r border-l border-r-black border-l-white">
          <p>{title}</p>
          <p> Total Votes: {totalVotes}</p>
        </div>
        <div className="flex flex-row">
          <div className="relative flex flex-row basis-1/2 justify-center p-2 text-center bg-black text-white items-center">
            <p className="capitalize">
              {choice1.body}?
            </p>
            <div className="absolute inset-0 left-auto bg-white opacity-40" style={{width: calculatePercentage(choice1.votes, totalVotes)}} />
          </div>
          <div className="relative flex flex-row basis-1/2 justify-center p-2 text-center border border-black items-center">
            <p className="capitalize">
              {choice2.body}?
            </p>
            <div className="absolute inset-0 bg-black opacity-10" style={{width: calculatePercentage(choice2.votes, totalVotes)}} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function TopicIndexPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <ol>
        {data.topicsSorted.map((topicId, index) => {
          const topicData = data.topics.find(({id}) => id === topicId);
          if (!topicData) return null;

          return (
            <li key={topicData.id}>
              <TopicItem
                id={topicData.id}
                title={topicData.title}
                choices={topicData.choices as unknown as Choice[]}
                index={index + 1}
              />
            </li>
          )
        })}
      </ol>
    </div>
  );
}
