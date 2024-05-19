import { Alert, Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, json } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
function CommentSection({ postID }) {
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      setError("comment should contain less than 200 cherectes.");
      return;
    }
    try {
      const response = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          userID: currentUser._id,
          postID,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setComment(data.errMessage);
      } else {
        setComment("");
        setError(null);
      }
    } catch (error) {
      setError(error.errMessage);
    }
  };
  return (
    <div className="max-w-[600px] mx-auto mt-8 p-2 border-2  border-gray-300 border-b-0 border-l-0 border-r-0">
      {currentUser ? (
        <div className="flex items-center gap-2">
          <img
            className="h-7 w-7 rounded-full"
            src={currentUser.photoURL}
            alt="user"
          />
          <Link to={"/dashboard?tab=profile"}>@{currentUser.username}</Link>
        </div>
      ) : (
        <div>
          <p>Please sign in for comment</p>
          <Link to={"/signin"}>
            <Button className="mt-4" gradientDuoTone="purpleToPink" outline>
              Sign In
            </Button>
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="border-2 border-green-300 p-3 mt-3 rounded-md"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></Textarea>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-400">
              {200 - comment.length} charectes remaining
            </p>
            <Button type={"submit"} gradientDuoTone="greenToBlue" outline>
              <IoMdSend />
            </Button>
          </div>
          {error && <Alert color="faliure">{error}</Alert>}
        </form>
      )}
    </div>
  );
}

export default CommentSection;
