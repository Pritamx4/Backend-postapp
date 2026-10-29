import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import CreatePost from "./screens/CreatePost";
import Home from "./screens/Home";
import Feed from "./screens/Feed";
import Auth from "./screens/Auth";

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
                {/* Desktop: Left Docked Sidebar | Mobile: Bottom Docked Bar */}
                <Navigation />

                {/* Main Content Viewport */}
                <div className="flex-1 min-w-0 pb-16 md:pb-0 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/auth" element={<Auth />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
