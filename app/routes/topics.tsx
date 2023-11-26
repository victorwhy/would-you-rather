import { Outlet } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useState } from "react";

import Menu from "~/components/Menu";
import { MenuIcon } from "~/images/Menu";
import { useOptionalUser } from "~/utils";

export default function NotesPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useOptionalUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-black p-4 text-white">
        <Link to="/topics" className="font-bold">
          Would You Rather?
        </Link>
        <Menu
          user={!!user}
          isOpen={isOpen}
          setClose={() => setIsOpen(false)}
        />
        <button
          className="mxl-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MenuIcon />
        </button>
      </header>

      <main className="flex h-full bg-white">
        <Outlet />
      </main>
    </div>
  );
}
