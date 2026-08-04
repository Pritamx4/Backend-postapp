import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="min-h-screen bg-black relative px-4 py-5 text-white sm:px-6 lg:px-8">
      <img className="h-16 w-16 m-2 absolute top-0 left-0" src="./public/image.png" alt="logo" />
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col">
        <header className="flex items-start justify-start">
          <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Post App
          </h1>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center sm:py-20">
          <h2 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Welcome to the Post App
          </h2>
          <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Link
              to="/create-post"
              className="rounded-lg bg-blue-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-600"
            >
              Create Post
            </Link>
            <Link
              to="/feed"
              className="rounded-lg bg-zinc-800 px-5 py-3 text-center font-semibold text-white transition hover:bg-zinc-700"
            >
              View Posts
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
