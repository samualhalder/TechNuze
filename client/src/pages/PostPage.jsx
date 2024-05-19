import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";

function PostPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [post, setPost] = useState(null);
  console.log(post);
  useEffect(() => {
    try {
      setLoading(true);
      const getPost = async () => {
        const response = await fetch(`/api/post/getposts?slug=${slug}`);
        const data = await response.json();
        console.log("data", data);
        if (response.ok) {
          setPost(data.posts[0]);
          setLoading(false);
        } else {
          setLoading(false);
          setErrors(data.errMessage);
        }
      };
      getPost();
    } catch (error) {
      setErrors(error);
      setLoading(false);
    }
  }, [slug]);
  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="xl"></Spinner>
      </div>
    );
  else {
    return (
      <main className="min-h-screen flex flex-col m-4">
        <h1 className="text-3xl m-4 mx-auto text-center font-serif mb-8">
          {post && post.title}
        </h1>
        <img
          src={post && post.photoURL}
          alt="post image"
          className="w-[600px] max-h-[100%] self-center mt-6"
        />
        <div className="p-1 mt-7 text-sm sm:min-w-[600px] sm:self-center text-gray-400 flex justify-between border border-gray-300  border-t-0 border-l-0 border-r-0 border-b-2">
          <span>{post && new Date(post.createdAt).toLocaleString()}</span>
          <span>{post && (post.content.length / 1000).toFixed(0)} mins</span>
        </div>
        <div
          className=" w-[600px] mx-auto mt-8 post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <div>
          <CommentSection postID={post?._id} />
        </div>
      </main>
    );
  }
}

export default PostPage;
