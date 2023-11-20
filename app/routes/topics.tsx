import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getTopics } from "~/models/topic.server";
import { useOptionalUser } from "~/utils";

export const loader = async () => {
  const topics = await getTopics();
  return json({ topics });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      {
        user ? (
        <Link to="new" className="block p-4 text-xl text-blue-500">
          + New Topic
        </Link>
        ) : (
        <Link to="new" className="block p-4 text-xl text-blue-500">
          Log in
        </Link>
        )
      }
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <ol>
            {data.topics.map((topic) => (
              <li key={topic.id}>
                <Link to={topic.id}>
                  {topic.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
