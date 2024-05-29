import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { LuDot } from "react-icons/lu";
import moment from "moment";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);

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
      {isEditing ? (
        <>
          <Textarea
            className="m-2"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          ></Textarea>
          <div className="flex justify-end gap-4">
            <Button
              gradientDuoTone="greenToBlue"
              onClick={() =>
                onEdit(comment, editedText)
                  .then(() => setIsEditing(false))
                  .catch((err) => console.log(err))
              }
            >
              save
            </Button>
            <Button
              // gradientDuoTone="pinkToBlue"
              color="red"
              outline
              onClick={() => setIsEditing(false)}
            >
              cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="w-[90%] mx-auto text-sm">{comment.content}</p>
          <div className="w-[90%] mx-auto flex items-center mt-2 text-sm">
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
            {currentUser && currentUser._id === comment.userID && (
              <button
                className="ml-5 text-sm hover:text-blue-500"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
            {currentUser &&
              (currentUser._id === comment.userID || currentUser.isAdmin) && (
                <button
                  className="ml-5 text-sm hover:text-blue-500"
                  onClick={() => onDelete(comment._id)}
                >
                  Delete
                </button>
              )}
          </div>
        </>
      )}
      
    </div>
  );
}

export default Comment;
