import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import DashBoard from "./pages/DashBoard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterComp from "./components/FooterComp";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/about" element={<About></About>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/signin" element={<Signin></Signin>}></Route>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashBoard></DashBoard>}></Route>
          </Route>
          <Route element={<AdminPrivateRoute />}>
            <Route
              path="/create-post"
              element={<CreatePost></CreatePost>}
            ></Route>
            <Route
              path="/update-post/:postID"
              element={<UpdatePost></UpdatePost>}
            ></Route>
          </Route>
          <Route path="/projects" element={<Projects></Projects>}></Route>
          <Route path="/posts/:slug" element={<PostPage />}></Route>
        </Routes>
        <FooterComp />
      </BrowserRouter>
    </>
  );
}

export default App;
