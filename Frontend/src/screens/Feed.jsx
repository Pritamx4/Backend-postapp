import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import Logo from "../components/Logo";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="min-h-screen bg-black px-3 py-4 text-white sm:px-5 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Logo />
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
                className="masonry-card overflow-hidden rounded-lg bg-zinc-900 shadow-md shadow-black/30"
              >
                <img
                  src={post.image}
                  alt={post.caption || "Post"}
                  className="block h-auto w-full object-contain"
                />
                {post.caption && (
                  <p className="px-3 py-3 text-center text-sm leading-5 text-zinc-100 sm:text-base">
                    {post.caption}
                  </p>
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
