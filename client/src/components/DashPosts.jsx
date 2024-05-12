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

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState([false, null]);
  const [postDeleteMessege, setPostDeleteMessege] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `/api/post/getposts?userID=${currentUser._id}`
      );
      const data = await response.json();
      if (response.ok) {
        if (data.posts.length < 9) setShowMore(false);
        setPosts(data.posts);
        console.log("data", data);
      }
      console.log(posts);
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    try {
      const response = await fetch(
        `/api/post/getposts?userID=${currentUser._id}&startIndex=${posts.length}`
      );
      const data = await response.json();
      if (response.ok) {
        console.log("show more", data);
        setPosts([...posts, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      } else {
        setPostDeleteMessege(response.errMessage);
      }
    } catch (error) {
      setPostDeleteMessege(error);
    }
  };
  const handleDelete = async () => {
    const postID = openModal[1]._id;
    try {
      const response = await fetch("/api/post/delete-post", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postID, user: currentUser._id }),
      });
      console.log(response);
      if (response.ok) {
        setPosts(posts.filter((elm) => elm._id !== postID));
        console.log("post delted successfully");
        setOpenModal([false, null]);
      }
    } catch (error) {
      console.log(error);
      setOpenModal([false, null]);
    }
  };
  return (
    <div className="mt-4  border-gray-800 md:mx-auto overflow-x-scroll scrollbar scrollbar-track-slate-150 scrollbar-thumb-slate-400">
      {postDeleteMessege && <Alert color="failure">{postDeleteMessege}</Alert>}
      <Modal
        show={openModal[0]}
        size="md"
        onClose={() => setOpenModal([false, null])}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-bold">{openModal[1]?.title}</span>?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal([false, null])}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {currentUser.isAdmin && posts.length ? (
        <Table className="dark:bg-gray-800 rounded-md bg-gray-200 shadow-md">
          <TableHead>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>title</TableHeadCell>
            <TableHeadCell>image</TableHeadCell>
            <TableHeadCell>categoryz</TableHeadCell>
            <TableHeadCell>Delete</TableHeadCell>
            <TableHeadCell>
              <span>Edit</span>
            </TableHeadCell>
          </TableHead>
          {posts.map((post, ind) => (
            <TableBody key={ind} className="divide-y">
              <TableRow>
                <TableCell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link className="font-bold" to={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <img className="max-h-24 max-w-30" src={post.photoURL} />
                </TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <span
                    className="text-red-500 hover:cursor-pointer"
                    onClick={(e) => setOpenModal([true, post])}
                  >
                    DELETE
                  </span>
                </TableCell>
                <TableCell>
                  <Link to={`/update-post/${post.slug}`}>
                    <span className="text-teal-500">UPDATE</span>
                  </Link>
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

export default DashPosts;
