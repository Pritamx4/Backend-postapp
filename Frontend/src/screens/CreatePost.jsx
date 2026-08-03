import React from "react";

const CreatePost = () => {
  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Create Post</h1>
        <form
          className="flex flex-col gap-5 bg-zinc-800 p-8"
          onSubmit={submitHandler}
        >
          <label className="text-zinc-100">Upload Image</label>
          <input
            className="p-2 bg-zinc-800 text-white outline-none border border-zinc-600"
            type="file"
            name="image"
            accept="image/*"
          />
          <label className="text-zinc-100">Captions</label>
          <input
            className="p-2 bg-zinc-800 text-white outline-none border-b border-zinc-600"
            type="text"
            name="captions"
            placeholder="Captions..."
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
