import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function About() {
  const { theme } = useSelector((state) => state.theme);
  console.log(theme);
  return (
    <div className="flex flex-col h-screen justify-center">
      <Link
        to={"/"}
        className="whitespace-nowrap text-sm sm:text-lg self-center"
      >
        <img
          className="p-2 bg-gradient-to-r h-40 text-white rounded-lg"
          src={
            theme === "dark"
              ? "white-transparent.png"
              : "../.././public/black-transparent.png"
          }
          alt="logo"
        />
      </Link>
      <div className="m-10 text-lg text-gray-600 dark:text-white">
        Welcome to Technuze, your ultimate source for the latest and most
        exciting technical news from around the globe. Our app is dedicated to
        bringing you up-to-the-minute updates, in-depth analyses, and insightful
        commentary on everything tech. From groundbreaking innovations and
        emerging technologies to industry trends and startup stories, Technuze
        covers it all. Whether you're a tech enthusiast, a professional in the
        field, or just curious about the latest advancements, Technuze is your
        go-to platform for staying informed and inspired. Join us as we explore
        the ever-evolving world of technology and keep you ahead of the curve.
      </div>
    </div>
  );
}

export default About;
