import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="h-screen relative flex items-center bg-black text-white">
      <div className="absolute left-0 top-0 p-4 w-40 h-40">
        <h1 id="logo" className="h-full w-full">
          Post App
        </h1>
      </div>
      <div className=" h-96 w-full flex flex-col justify-center items-center">
        <h1 className="text-6xl">Welcome to the Post App</h1>
        <div className="flex gap-4 mt-4">
        <Link to="/create-post"><button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Create Post
          </button></Link>
          <Link to="/feed"><button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            View Posts
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
