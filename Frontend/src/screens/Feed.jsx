import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { getApiUrl } from "../config/api";

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
    <div className="flex flex-col p-4 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <h1 className="text-center text-2xl">Loading posts...</h1>
        ) : error ? (
          <h1 className="text-center text-2xl">{error}</h1>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-zinc-800 p-4 rounded-lg shadow-md"
            >
              <img
                src={post.image}
                alt="Post"
                className="w-full h-auto rounded-lg mb-2"
              />
              <p className="text-center">{post.caption}</p>
            </div>
          ))
        ) : (
          <h1 className="text-center text-2xl">No posts available.</h1>
        )}
      </div>
    </div>
  );
};

export default Feed;
