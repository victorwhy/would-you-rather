import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-black sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden bg-white">
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-black drop-shadow-md">
                  Would You Rather
                </span>
              </h1>
                {user ? null : (
                  <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-black px-4 py-3 font-medium text-white hover:bg-gray-500"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <Link
                  to="/topics"
                  className="flex items-center justify-center rounded-md border border-transparent bg-black px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-500 sm:px-8"
                >
                  See Topics
                </Link>
              </div>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <Link
                  to="/topics/play"
                  className="flex items-center justify-center rounded-md border border-transparent bg-black px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-500 sm:px-8"
                >
                  Play
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
