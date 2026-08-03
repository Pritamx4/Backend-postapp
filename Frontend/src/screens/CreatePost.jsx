import axios from "axios";
import {useNavigate} from "react-router-dom";


const CreatePost = () => {
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    axios.post("http://localhost:3000/create-post", formData)
    .then((res) => {
      console.log(res);
      navigate("/feed"); // Navigate back to the feed page
    });
    
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div>
        <h1 className="text-2xl font-semibold mb-2 px-4">Create Post</h1>
        <form
          className="flex flex-col gap-5 bg-zinc-800 p-8 shadow-md rounded-lg"
          onSubmit={submitHandler}
        >
          <input
            className="p-2 bg-zinc-800 text-white outline-none border border-zinc-600"
            type="file"
            name="image"
            accept="image/*"
          />
          <input
            className="p-2 bg-zinc-800 text-white outline-none border-b border-zinc-600"
            type="text"
            name="caption"
            placeholder="Enter captions..."
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
