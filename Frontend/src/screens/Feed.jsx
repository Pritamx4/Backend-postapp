import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../config/api";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(getApiUrl("/api/posts"));
        const nextPosts = Array.isArray(res.data?.posts)
          ? res.data.posts
          : Array.isArray(res.data)
            ? res.data
            : [];

        setPosts(nextPosts);
        setError("");
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
        setError("Unable to load posts right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (_id) => {
    try {
      await axios.delete(getApiUrl(`/api/posts/${_id}`));
      setPosts((prev) => prev.filter((post) => post._id !== _id));
    } catch (err) {
      console.error(err);
    }
  };

  const [updatePostId, setUpdatePostId] = useState(null);
  const [updatedCaptions, setUpdatedCaptions] = useState("");

  const handleUpdate = async (_id) => {
    try {
      await axios.patch(getApiUrl(`/api/posts/${_id}`), {
        caption: updatedCaptions,
      });
      setPosts((prev) =>
        prev.map((post) =>
          post._id === _id ? { ...post, caption: updatedCaptions } : post
        )
      );
      setUpdatePostId(null);
      setUpdatedCaptions("");
      setMenuOpenId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-baseline justify-between border-b border-zinc-900 pb-4">
          <div>
            <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase block mb-0.5">
              Community Gallery
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Public Feed
            </h1>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {posts.length} {posts.length === 1 ? "Post" : "Posts"}
          </span>
        </div>

        {isLoading && (
          <div className="py-24 text-center">
            <div className="inline-block w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
            <p className="text-xs font-mono text-zinc-500">Loading gallery...</p>
          </div>
        )}

        {!isLoading && error && (
          <p className="py-16 text-center text-sm font-mono text-zinc-400">{error}</p>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <div className="masonry-feed">
            {posts.map((post) => (
              <article
                key={post._id}
                className="relative masonry-card overflow-hidden rounded-xl bg-[#111113] border border-zinc-800/80 hover:border-zinc-700 transition-colors shadow-none"
              >
              {/* Post content */}
                <img
                  src={post.image}
                  alt={post.caption || "Post"}
                  className="block h-auto w-full object-contain bg-zinc-950"
                  loading="lazy"
                />
                {post.caption && (
                  updatePostId === post._id ? (
                    <div className="p-3 bg-[#18181b]">
                      <input
                        value={updatedCaptions}
                        onChange={(e) => setUpdatedCaptions(e.target.value)}
                        className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-2 text-xs text-white outline-none focus:border-zinc-400"
                        placeholder="Edit caption..."
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleUpdate(post._id)}
                          className="rounded-lg bg-white text-black px-3 py-1 text-xs font-semibold hover:bg-zinc-200 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setUpdatePostId(null);
                            setUpdatedCaptions("");
                          }}
                          className="rounded-lg bg-[#27272a] text-zinc-300 px-3 py-1 text-xs hover:bg-zinc-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="px-3.5 py-3 text-sm text-zinc-200">
                      {post.caption}
                    </p>
                  )
                )}

                {/* 3-dots menu button */}
                <button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === post._id ? null : post._id)
                  }
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Post actions"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {menuOpenId === post._id && (
                  <div className="absolute bottom-10 right-2 w-28 rounded-lg bg-[#18181b] border border-zinc-800 shadow-xl overflow-hidden z-20 text-xs">
                    <button
                      onClick={() => {
                        setUpdatePostId(post._id);
                        setUpdatedCaptions(post.caption || "");
                        setMenuOpenId(null);
                      }}
                      className="block w-full px-3 py-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      Edit Caption
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="block w-full px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm text-zinc-400 mb-1">No community posts yet.</p>
            <p className="text-xs text-zinc-600">Be the first photographer to upload a shot!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Feed;
