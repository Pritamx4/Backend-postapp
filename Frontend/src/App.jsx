import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePost from "./screens/CreatePost";
import Home from "./screens/Home";
import Feed from "./screens/Feed";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
};

export default App;
