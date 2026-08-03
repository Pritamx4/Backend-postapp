import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";

const CreatePost = () => {
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    axios.post(getApiUrl("/create-post"), formData).then((res) => {
      console.log(res);
      navigate("/feed"); // Navigate back to the feed page
    });
  };

  return (
    <main className="min-h-screen bg-black px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link
            to="/feed"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-400"
          >
            Feed
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center py-10 sm:py-16">
          <div className="w-full max-w-md">
            <h1 className="mb-4 text-2xl font-semibold sm:text-3xl">
              Create Post
            </h1>
            <form
              className="flex w-full flex-col gap-5 rounded-lg bg-zinc-900 p-4 shadow-md shadow-black/30 sm:p-6"
              onSubmit={submitHandler}
            >
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-white outline-none file:mr-3 file:rounded-md file:border-0 file:bg-blue-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-blue-500"
                type="file"
                name="image"
                accept="image/*"
              />
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-blue-500"
                type="text"
                name="caption"
                placeholder="Enter captions..."
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-500 p-3 font-semibold text-white transition hover:bg-blue-600"
              >
                Create Post
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CreatePost;
