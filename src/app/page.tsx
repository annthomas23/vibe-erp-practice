"use client";

import { UserIcon } from "@heroicons/react/16/solid";
import useSWR from "swr";

export default function Home() {
  const { data } = useSWR("/api/profile", {
    fetcher: (url: string) => fetch(url).then((res) => res.json()),
  });

  return (
    <div>
      <div className="flex justify-between border-b p-4">
        <h6 className="font-bold">Vibe ERP</h6>
        {data && (
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-gray-100 p-2">
              <UserIcon className="h-4 w-4" />
            </button>
            <div>{data.email}</div>
          </div>
        )}
      </div>
    </div>
  );
}
