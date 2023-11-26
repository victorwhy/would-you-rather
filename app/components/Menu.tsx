import { Link } from "@remix-run/react";

import { Close } from "~/images/Close"

interface Menu {
  isOpen: boolean;
  user: boolean;
  setClose: () => void;
}

export default function Menu({ isOpen, user, setClose }: Menu) {
  const openClass = isOpen ? "" : "hidden";

  return (
    <div className={`fixed inset-0 flex flex-col h-screen w-screen bg-white z-10 justify-center items-center ${openClass}`}>
      <Link
        to="/topics" className="block p-2 text-xl text-black"
        onClick={setClose}
      >
        Topics
      </Link>
      {
        user ? (
          <>
          <Link
            to="/topics/new" className="block p-2 text-xl text-black"
            onClick={setClose}
          >
            New Topic
          </Link>
          <Link
            to="/logout" className="block p-2 text-xl text-black"
            onClick={setClose}
          >
            Log Out
          </Link>
          </>
        ) : (
          <>
            <Link
              to="/topics/new" className="block p-2 text-xl text-black"
              onClick={setClose}
            >
              New Topic
            </Link>
            <Link
              to="login" className="block p-2 text-xl text-black"
              onClick={setClose}
            >
              Log in
            </Link>
          </>
        )
      }
      <button className="pt-20" onClick={setClose}>
        <Close />
      </button>
    </div>
  )
}