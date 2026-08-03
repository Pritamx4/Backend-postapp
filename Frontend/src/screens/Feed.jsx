import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/posts`).then((res) => {
      setPosts(res.data.posts);
    });
  }, []);

  return (
    <div className="flex flex-col p-4 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0 ? (
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
