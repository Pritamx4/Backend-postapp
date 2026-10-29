import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePost from "./screens/CreatePost";
import Home from "./screens/Home";
import Feed from "./screens/Feed";
import Auth from "./screens/Auth";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
};

export default App;
