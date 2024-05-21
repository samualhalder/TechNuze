import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { LuDot } from "react-icons/lu";
import moment from "moment";

function Comment({ comment }) {
  const { userID, content, noOflikes } = comment;
  const [user, setUser] = useState({});
  useEffect(() => {
    try {
      const getUser = async () => {
        const response = await fetch(`/api/user/${userID}`);
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
      <p className="w-[90%] mx-auto text-sm">{content}</p>
      <div className="flex items-center">
        <AiOutlineLike />
        {noOflikes}
      </div>
    </div>
  );
}

export default Comment;
