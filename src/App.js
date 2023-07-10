import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Post from "./components/Post";
import Posts from "./components/Posts";
import AddPost from "./components/AddPost";
import Galery from "./components/Galery";

function App() {
  return (
    <div className="container">
      <Router>
        <Navbar path="/navbar" element={<Navbar />}/>
        <Routes>
        <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<Post/>} />
          <Route path="/galery" element={<Galery/>} />
          <Route
            path="/"
            element={
              <div className="postContainer">
                <div className="post">
                  <Posts />
                </div>
                <div className="addPost">
                  <AddPost />
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
