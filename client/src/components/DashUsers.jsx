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

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState([false, null]);
  const [postDeleteMessege, setPostDeleteMessege] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/user/get-all-users`);
      const data = await response.json();
      if (response.ok) {
        if (data.users.length < 9) setShowMore(false);
        setUsers(data.users);
       // console.log("data", data);
      }
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    try {
      const response = await fetch(
        `/api/user/get-all-users?startIndex=${users.length}`
      );
      const data = await response.json();
      if (response.ok) {
       // console.log("show more", data);
        setUsers([...users, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      } else {
        setPostDeleteMessege(response.errMessage);
      }
    } catch (error) {
      setPostDeleteMessege(error);
    }
  };
  const handleDelete = async () => {
    const userID = openModal[1]._id;
    try {
      const response = await fetch(`/api/user/delete/${userID}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    //  console.log(response);
      if (response.ok) {
        setUsers(users.filter((elm) => elm._id !== userID));
        //console.log("post delted successfully");
        setOpenModal([false, null]);
      }
    } catch (error) {
    //  console.log(error);
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
              <span className="font-bold">{openModal[1]?.username}</span>?
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
      {currentUser.isAdmin && users.length ? (
        <Table className="dark:bg-gray-800 rounded-md bg-gray-200 shadow-md">
          <TableHead>
            <TableHeadCell>Created At</TableHeadCell>
            <TableHeadCell>User Name</TableHeadCell>
            <TableHeadCell>Image</TableHeadCell>
            <TableHeadCell>email</TableHeadCell>
            <TableHeadCell>Admin</TableHeadCell>
            <TableHeadCell>
              <span>Delete</span>
            </TableHeadCell>
          </TableHead>
          {users.map((user, ind) => (
            <TableBody key={ind} className="divide-y">
              <TableRow>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link className="font-bold" to={`/posts/${user.slug}`}>
                    {user.username}
                  </Link>
                </TableCell>
                <TableCell>
                  <img className="h-10 w-10 rounded-full" src={user.photoURL} />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "✅" : "❌"}</TableCell>
                <TableCell>
                  <span
                    className="text-red-500"
                    onClick={(e) => setOpenModal([true, user])}
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

export default DashUsers;
