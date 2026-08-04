import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null); // track which post's menu is open

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(getApiUrl("/posts"));
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
    console.log("Deleting:", _id);
    try {
      await axios.delete(getApiUrl(`/delete-post/${_id}`));
      setPosts((prev) => prev.filter((post) => post._id !== _id));
    } catch (err) {
      console.error(err);
    }
  };

  const [updatePostId, setUpdatePostId] = useState(null);
  const [updatedCaptions, setUpdatedCaptions] = useState("");

  const handleUpdate = async (_id) => {
    try {
      await axios.patch(getApiUrl(`/update-post/${_id}`), {
        caption: updatedCaptions,
      });
      setPosts((prev) =>
        prev.map((post) =>
          post._id === _id ? { ...post, caption: updatedCaptions } : post,
        ),
      );
      setUpdatePostId(null);
      setUpdatedCaptions("");
      setMenuOpenId(null); // Close the menu after updating
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-black px-3 py-4 text-white sm:px-5 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/create-post"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Create Post
          </Link>
        </header>

        <h1 className="mb-5 text-2xl font-bold sm:text-3xl">Posts</h1>

        {isLoading && (
          <p className="py-16 text-center text-xl text-zinc-300">
            Loading posts...
          </p>
        )}

        {!isLoading && error && (
          <p className="py-16 text-center text-xl text-zinc-300">{error}</p>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <div className="masonry-feed">
            {posts.map((post) => (
              <article
                key={post._id}
                className="relative masonry-card overflow-hidden rounded-lg bg-zinc-900 shadow-md shadow-black/30"
              >
                <img
                  src={post.image}
                  alt={post.caption || "Post"}
                  className="block h-auto w-full object-contain"
                />
                {post.caption && (
                  updatePostId === post._id ? (
                    <div className="p-3">
                      <input
                        value={updatedCaptions}
                        onChange={(e) => setUpdatedCaptions(e.target.value)}
                        className="w-full rounded bg-zinc-800 p-2 text-white"
                      />

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleUpdate(post._id)}
                          className="rounded bg-green-600 px-3 py-1"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setUpdatePostId(null);
                            setUpdatedCaptions("");
                          }}
                          className="rounded bg-red-600 px-3 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="px-3 py-3 text-center text-sm leading-5 text-zinc-100 sm:text-base">
                      {post.caption}
                    </p>
                  )
                )}

                {/* 3-dots menu button */}
                <button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === post._id ? null : post._id)
                  }
                  className="absolute bottom-1 right-3 p-2 rounded  hover:bg-zinc-600 text-zinc-400"
                >
                  ⋮
                </button>

                {/* Dropdown menu */}
                {menuOpenId === post._id && (
                  <div className="absolute bottom-12 right-3 w-32 rounded-md bg-zinc-800 shadow-lg">
                    <button
                      onClick={() => {
                        setUpdatePostId(post._id);
                        setUpdatedCaptions(post.caption || "");
                        setMenuOpenId(null); // Close the menu after clicking update
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-zinc-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-zinc-700"
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
          <p className="py-16 text-center text-xl text-zinc-300">
            No posts available.
          </p>
        )}
      </div>
    </main>
  );
};

export default Feed;
