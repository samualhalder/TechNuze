import React, { useEffect, useState } from "react";
import { Button, Carousel } from "flowbite-react";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

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
      <div className="p-2 flex flex-col gap-6  h-[500px]   items-start justify-center dark:bg-[#10172A]  backdrop-blur-md bg-white/30">
        <Carousel className=" relative text-gray-400 hover:border-4 border-cyan-400 rounded-lg duration-300">
          <Link
            className="h-full w-full group "
            to={`/posts/${recentPosts[0]?.slug}`}
          >
            <img
              className="h-full w-full hover:-translate-y-24  duration-200"
              src={recentPosts[0]?.photoURL}
              alt=""
            />
            <h1 className="item-1 md:hidden absolute bottom-0 left-10 text-5xl font-mono group-hover:block">
              {recentPosts[0]?.title}
              <p className="text-lg">{recentPosts[0]?.category}</p>
            </h1>
          </Link>

          <Link
            className="h-full w-full group"
            to={`/posts/${recentPosts[1]?.slug}`}
          >
            <img
              className="h-full w-full hover:-translate-y-24  duration-200"
              src={recentPosts[1]?.photoURL}
              alt=""
            />
            <h1 className="item-1 md:hidden absolute bottom-0 left-10 text-5xl font-mono group-hover:block">
              {recentPosts[1]?.title}
              <p className="text-lg">{recentPosts[1]?.category}</p>
            </h1>
          </Link>
          <Link
            className="h-full w-full group"
            to={`/posts/${recentPosts[2]?.slug}`}
          >
            <img
              className="h-full w-full hover:-translate-y-24  duration-200"
              src={recentPosts[2]?.photoURL}
              alt=""
            />
            <h1 className="item-1 md:hidden absolute bottom-0 left-10 text-5xl font-mono group-hover:block">
              {recentPosts[2]?.title}
              <p className="text-lg">{recentPosts[2]?.category}</p>
            </h1>
          </Link>
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
