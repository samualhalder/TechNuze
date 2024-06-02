import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch("/api/post/getposts?limit=9");
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
     // console.log(error);
    }
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6  h-[500px]   items-start justify-center bg-[url(https://www.pixelstalk.net/wp-content/uploads/2016/06/Plain-light-blue-background-1920x1080.jpg)] dark:bg-[url(https://e0.pxfuel.com/wallpapers/37/754/desktop-wallpaper-cool-website-background-best-background.jpg)] object-cover  backdrop-blur-md bg-white/30">
        <h1 className="text-3xl text-white lg:text-5xl font-sans ">
          Welcome to <span>Code 365</span> blog application{" "}
        </h1>
        <p className="text-gray-00">
          it's a blog side fouccsing on Next.js ,MERN stack Leetcode and other
          Web ralted tech.
        </p>
      </div>
      <div className="">
        <div className="flex flex-wrap gap-7 justify-center items-center m-6">
          {recentPosts &&
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post}></PostCard>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
