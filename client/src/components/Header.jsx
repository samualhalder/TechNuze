import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { HiMoon } from "react-icons/hi2";
import { IoMdSunny } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import {signOutSuccess} from '../redux/user/userSlice'

function Header() {
  const path = useLocation().pathname;
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const handleTheme = () => {
    dispatch(toggleTheme());
  };
  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("user not signed out");
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar className="border-b-2 ">
      <Link
        to={"/"}
        className="whitespace-nowrap text-sm sm:text-lg self-center"
      >
        <span className="p-2 bg-gradient-to-r from-indigo-500 via-purple-700 to-pink-400 text-white rounded-lg">
          CodeBlogs
        </span>
        365
      </Link>
      <form action="">
        <TextInput
          className="border-purple-600 hidden lg:block"
          type="text"
          placeholder="search..."
          rightIcon={CiSearch}
        />
      </form>

      <button className="lg:hidden rounded-lg bg-gray-50 w-12 h-10">
        <CiSearch className="mx-auto " />
      </button>
      <div className="flex md:order-2 gap-2">
        <button
          className={
            theme === "dark"
              ? "w-12 h-10 rounded-lg hidden sm:inline bg-gray-700"
              : "w-12 h-10 rounded-lg hidden sm:inline bg-gray-50"
          }
          onClick={handleTheme}
        >
          {theme === "light" ? (
            <HiMoon className="mx-auto" />
          ) : (
            <IoMdSunny className="mx-auto bg-gray-700"></IoMdSunny>
          )}
        </button>
        {currentUser.currentUser !== null ? (
          <Dropdown
            inline
            arrowIcon={false}
            label={
              <Avatar
                alt="user"
                img={currentUser.currentUser.photoURL}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm truncate">
                @{currentUser.currentUser.username}
              </span>
              <span className="text-bold font-medium truncate">
                {currentUser.currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/signin"}>
            <Button
              className="h-10  rounded-lg mx-2 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg text-white"
              outline
            >
              Sign in
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
