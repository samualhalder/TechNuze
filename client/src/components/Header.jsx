import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { HiMoon } from "react-icons/hi2";
import { IoMdSunny } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

function Header() {
  const path = useLocation().pathname;
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const [searchTearm, setSearchTearm] = useState("");
  const location = useLocation();
  const [mobileSearchPage, setMobileSearchPage] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParams = urlParams.get("searchTearm");
    if (searchParams) {
      setSearchTearm(searchParams);
    }
  }, [location.search]);
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
        //  console.log("user not signed out");
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      //   console.log(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTearm", searchTearm);
    const searchParams = urlParams.toString();
    navigate(`/search?${searchParams}`);
  };
  const handleMobileSearch = () => {
    if (mobileSearchPage) {
      setMobileSearchPage(false);
      navigate("/");
    } else {
      setMobileSearchPage(true);
      navigate("/search");
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
      <form onSubmit={handleSubmit}>
        <TextInput
          className="border-purple-600 hidden md:block"
          type="text"
          value={searchTearm}
          placeholder="search..."
          rightIcon={CiSearch}
          onChange={(e) => setSearchTearm(e.target.value)}
        />
      </form>
      <button
        onClick={handleMobileSearch}
        className="lg:hidden rounded-lg border hover:bg-gray-800 border-cyan-600 w-12 h-10 cursor-pointer"
      >
        <CiSearch className="mx-auto" />
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
