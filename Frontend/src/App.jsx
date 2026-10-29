import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import CreatePost from "./screens/CreatePost";
import Feed from "./screens/Feed";
import Auth from "./screens/Auth";

const App = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: "#0A0A0A", color: "#EDEDED" }}>
                <Navigation />
                <div className="flex-1 min-w-0 pb-16 md:pb-0 overflow-y-auto">
                    <Routes>
                        {/* Option 3: Unified Bento Gallery & Continuous Feed */}
                        <Route path="/" element={<Feed />} />
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="*" element={<Feed />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
