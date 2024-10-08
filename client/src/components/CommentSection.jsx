import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
function CommentSection({ postID }) {
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteCommentID, setDeleteCommentID] = useState(null);

  const navigator = useNavigate();
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
        setError("pls logout and login again there some issue.");
      } else {
        setError(null);
        setAllComments([data, ...allComments]);
      }
      setComment("");
    } catch (error) {
      setError(error.errMessage);
    }
  };
  const handleLike = async (commentID) => {
    if (!currentUser) {
      navigator("/signin");
    }
    try {
      setError(null);
      const res = await fetch(`/api/comment/like-comment/${commentID}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setError(null);
        setAllComments((pre) =>
          pre.map((comment) =>
            comment._id === commentID
              ? { ...comment, noOflikes: data.noOflikes, likes: data.likes }
              : comment
          )
        );
      } else {
        setError(data.errMessage);
      }
    } catch (error) {
      setError(error);
    }
  };
  const isEdit = async (comment, text) => {
    try {
      const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        allComments((pre) =>
          pre.map((c) =>
            c._id === comment._id ? { ...c, content: data.content } : c
          )
        );
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/comment/delete-comment/${deleteCommentID}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        //console.log("commetn delete succefully");
        setShowModal(false);
        setDeleteCommentID(null);
      } else {
        setShowModal(false);
        setDeleteCommentID(null);
        console.log(data.errMessage);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    try {
      const getComments = async () => {
        const response = await fetch(`/api/comment/getComments/${postID}`);
        const data = await response.json();

        if (response.ok) {
          setAllComments(data);
        } else {
          // console.log(data.errMessage);
        }
      };
      getComments();
    } catch (error) {
      // console.log(error);
    }
  }, [postID]);

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
          {error && (
            <Alert className="my-2" color="red">
              {error}
            </Alert>
          )}
        </form>
      )}
      {allComments.length === 0 ? (
        <p>Be the first user to comment on this post.</p>
      ) : (
        <div>
          <div className="flex my-4 gap-2 font-bold">
            <div className="border-gray-400 ">{allComments.length}</div>
            <p>Comments</p>
          </div>
          {allComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={isEdit}
              onDelete={(commentID) => {
                setShowModal(true);
                setDeleteCommentID(commentID);
              }}
            ></Comment>
          ))}
        </div>
      )}
      {showModal && (
        <Modal
          show={showModal}
          size="md"
          onClose={() => setShowModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this comment?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDelete}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default CommentSection;
