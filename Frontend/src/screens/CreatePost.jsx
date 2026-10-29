import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";

const CreatePost = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.target);
        try {
            await axios.post(getApiUrl("/api/posts"), formData);
            navigate("/feed");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Failed to create post. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-black px-4 py-8 text-white flex items-center justify-center">
            <div className="w-full max-w-md bg-[#111113] border border-zinc-800/80 rounded-2xl p-6 sm:p-8">
                <div className="mb-6">
                    <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase block mb-1">
                        New Publication
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Create Post
                    </h1>
                    <p className="text-xs text-zinc-400 mt-1">
                        Upload high-resolution photography with an optional
                        story or caption.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-xs text-red-300">
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={submitHandler}>
                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                            Select Image
                        </label>
                        <input
                            className="w-full rounded-xl border border-zinc-800 bg-[#18181b] p-3 text-xs text-zinc-300 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-700 transition-colors focus:border-zinc-500"
                            type="file"
                            name="image"
                            accept="image/*"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                            Caption
                        </label>
                        <textarea
                            className="w-full rounded-xl border border-zinc-800 bg-[#18181b] p-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors resize-none h-24"
                            name="caption"
                            placeholder="Write a caption or photography notes..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-2.5 px-4 bg-white text-black font-semibold rounded-lg text-sm hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                <span>Publishing shot...</span>
                            </>
                        ) : (
                            <span>Publish to Feed</span>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreatePost;
