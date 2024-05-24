import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { LuDot } from "react-icons/lu";
import moment from "moment";
import { useSelector } from "react-redux";

function Comment({ comment, onLike }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const getUser = async () => {
        const response = await fetch(`/api/user/${comment.userID}`);
        if (response.ok) {
          const data = await response.json();

          setUser(data);
        } else {
          console.log("no such user");
        }
      };
      getUser();
    } catch (error) {
      console.log(error);
    }
  }, [comment]);

  return (
    <div className="m-4">
      <div className="w-full">
        <img
          src={user.photoURL}
          alt=""
          className="h-7 w-7 rounded-full inline"
        />
        <span className="mx-3">
          @{user.username}
          <LuDot className="inline" />
        </span>
        <span className="text-sm">{moment(comment.createdAt).fromNow()}</span>
      </div>
      <p className="w-[90%] mx-auto text-sm">{comment.content}</p>
      <div className="w-[90%] mx-auto flex items-center mt-2">
        <button
          className={` ${
            currentUser &&
            comment.likes.includes(currentUser._id) &&
            "!text-blue-600"
          }`}
        >
          <AiOutlineLike onClick={() => onLike(comment._id)} />
        </button>
        {comment.noOflikes}
      </div>
    </div>
  );
}

export default Comment;
