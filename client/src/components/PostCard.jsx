import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="group relative w-[320px] h-[350px] overflow-hidden border border-teal-500  rounded-lg hover:border-4 transition-all duration-500">
      <div>
        <img
          src={post.photoURL}
          alt="img"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="font-bold">{post.title}</p>
        <span className="text-sm italic">{post.category}</span>
        <Link
          to={`/posts/${post.slug}`}
          className=" flex justify-center items-center z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white rounded-md transition-all duration-300 m-2 h-10"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
