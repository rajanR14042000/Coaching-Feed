"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getSocket } from "./lib/socket";
import Link from "next/link";

export default function Home() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeds();

    const socket = getSocket();

    socket.on("new-feed", (newFeed) => {
      setFeeds((prev) => {
        if (prev.find((f) => f._id === newFeed._id)) return prev;
        return [newFeed, ...prev];
      });
    });

    return () => socket.off("new-feed");
  }, []);

  const fetchFeeds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feeds");
      setFeeds(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Coaching Feed
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Real-time feed updates
            </p>
          </div>

          {/* Admin Button */}
          <Link href="/admin">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition">
              Send Message
            </button>
          </Link>
        </div>
      </div>

      {/* Feed Section */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : feeds.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No feeds available
            </h2>

            <p className="text-gray-500 mt-2">
              Messages will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {feeds.map((feed) => (
              <div
                key={feed._id}
                className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {feed.message?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Coaching Update
                      </h3>

                      <p className="text-xs text-gray-500">
                        Live Feed
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(feed.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {feed.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}