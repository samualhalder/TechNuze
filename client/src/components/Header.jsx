import { Navbar, TextInput, Button } from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { HiMoon } from "react-icons/hi2";

function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2 ">
      <Link
        to={"/"}
        className="whitespace-nowrap text-sm sm:text-lg self-center"
      >
        <span className="p-2 bg-gradient-to-r from-indigo-500 via-purple-700 to-pink-400 text-white rounded-lg">
          Blog
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
        <button className="w-12 h-10 rounded-lg hidden sm:inline bg-gray-50">
          <HiMoon className="mx-auto" />
        </button>
        <Link to={"/signin"}>
          <Button
            className="h-10  rounded-lg mx-2 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg text-white"
            outline
          >
            Sign in
          </Button>
        </Link>
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
