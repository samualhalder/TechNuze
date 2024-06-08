import {
  Alert,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState([false, null]);
  const [commentDeleteMessege, setCommentDeleteMessege] = useState(null);
  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/comment/getall-comments`);
      const data = await response.json();

      if (response.ok) {
        if (data.comments.length < 9) setShowMore(false);
        setComments(data.comments);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    try {
      const response = await fetch(
        `/api/comment/getall-comments?startInd=${comments.length}`
      );
      const data = await response.json();
      if (response.ok) {
        // console.log("show more", data);
        setComments([...comments, ...data.user]);
        if (data.users.length < 9) setShowMore(false);
      } else {
        setCommentDeleteMessege(response.errMessage);
      }
    } catch (error) {
      setCommentDeleteMessege(error);
    }
  };
  const handleDelete = async () => {
    const commentID = openModal[1];
    //  console.log(commentID);
    try {
      const response = await fetch(`/api/comment/delete-comment/${commentID}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      //  console.log(response);
      if (response.ok) {
        setComments(comments.filter((elm) => elm._id !== commentID));
        // console.log("post delted successfully");
        setOpenModal(false, null);
      }
    } catch (error) {
      //console.log(error);
      setOpenModal(false, null);
    }
  };
  return (
    <div className="mt-4  border-gray-800 md:mx-auto overflow-x-scroll scrollbar scrollbar-track-slate-150 scrollbar-thumb-slate-400">
      {commentDeleteMessege && (
        <Alert color="failure">{commentDeleteMessege}</Alert>
      )}
      <Modal
        show={openModal[0]}
        size="md"
        onClose={() => setOpenModal(false, null)}
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
              <Button
                color="gray"
                onClick={() => setOpenModal(...[false, null])}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {currentUser.isAdmin && comments.length ? (
        <Table className="dark:bg-gray-800 rounded-md bg-gray-200 shadow-md mx-1">
          <TableHead>
            <TableHeadCell>Created At</TableHeadCell>
            <TableHeadCell>Post ID</TableHeadCell>
            <TableHeadCell>Content</TableHeadCell>
            <TableHeadCell>Likes</TableHeadCell>
            <TableHeadCell>User ID</TableHeadCell>
            <TableHeadCell>
              <span>Delete</span>
            </TableHeadCell>
          </TableHead>
          {comments.map((comment, ind) => (
            <TableBody key={ind} className="divide-y">
              <TableRow>
                <TableCell>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link className="font-bold">{comment.postID}</Link>
                </TableCell>
                <TableCell>
                  <p>{comment.content}</p>
                </TableCell>
                <TableCell>{comment.noOflikes}</TableCell>
                <TableCell>{comment.userID}</TableCell>
                <TableCell>
                  <span
                    className="text-red-500 cursor-pointer"
                    onClick={(e) => setOpenModal([true, comment._id])}
                  >
                    DELETE
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      ) : (
        <p>noposts</p>
      )}
      {showMore && (
        <Button className="mx-auto mt-3" onClick={handleShowMore}>
          Show more
        </Button>
      )}
    </div>
  );
}

export default DashComments;
