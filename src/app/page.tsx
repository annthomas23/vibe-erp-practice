"use client";

import { UserIcon } from "@heroicons/react/16/solid";
import useSWR from "swr";
import Link from "next/link";

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
            <div>{data.name ?? "Guest"}</div> 
            <div className="text-sm text-grey-500">{data.email}</div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to Vibe ERP</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/products" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <p className="text-gray-600">View our ERP solutions and services</p>
          </Link>
          
          {/* Add more navigation cards here as needed */}
        </div>
      </div>
    </div>
  );
}
