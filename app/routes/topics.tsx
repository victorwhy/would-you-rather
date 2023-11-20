import { Link, Outlet } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function NotesPage() {
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
        <>
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Topic
          </Link>
          <Link to="new" className="block p-4 text-xl text-blue-500">
            Log in
          </Link>
        </>
        )
      }
      </header>

      <main className="flex h-full bg-white">
        <Outlet />
      </main>
    </div>
  );
}
