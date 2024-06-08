import React, { useEffect, useState } from "react";
import { Button, Carousel } from "flowbite-react";
import PostCard from "../components/PostCard";

function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch("/api/post/getposts?limit=8");
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
  const handleMorePosts = async () => {
    try {
      const res = await fetch(
        `/api/post/getposts?limit=${recentPosts.length * 2}`
      );
      const data = await res.json();
      if (res.ok) {
        setRecentPosts(data.posts);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <div>
      <div className="p-2 flex flex-col gap-6  h-[500px]   items-start justify-center bg-[url(https://www.pixelstalk.net/wp-content/uploads/2016/06/Plain-light-blue-background-1920x1080.jpg)] dark:bg-[url(https://e0.pxfuel.com/wallpapers/37/754/desktop-wallpaper-cool-website-background-best-background.jpg)] dark:bg-cover  backdrop-blur-md bg-white/30">
        <Carousel>
          <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
            Slide 1
          </div>
          <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
            Slide 2
          </div>
          <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
            Slide 3
          </div>
        </Carousel>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-7 justify-center items-center m-6">
          {recentPosts &&
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post}></PostCard>
            ))}
        </div>
        {recentPosts.length % 8 === 0 && (
          <Button onClick={handleMorePosts} className="mx-auto my-2">
            See more
          </Button>
        )}
      </div>
    </div>
  );
}

export default Home;
