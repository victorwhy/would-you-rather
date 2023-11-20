import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getTopics } from "~/models/topic.server";

interface TopicItem {
  id: string;
  title: string;
  votes: number;
}

export const loader = async () => {
  const topics = await getTopics();
  return json({ topics });
};

const TopicItem = ({ id, title, votes }: TopicItem) => {
  return (
    <div>
      <div>
        <p>{Number(votes)}</p>
      </div>
      <Link to={id}>
        {title}
      </Link>
    </div>
  )
}

export default function TopicIndexPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <ol>
        {data.topics.map((topic) => (
          <li key={topic.id}>
            <TopicItem
              id={topic.id}
              title={topic.title}
              votes={topic.votes}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
