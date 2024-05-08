import {
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

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState({});
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `/api/post/getposts?userID=${currentUser._id}`
      );
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts);
        console.log("data", data);
      }
      console.log(posts);
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);
  return (
    <div className="mt-4  border-gray-800 md:mx-auto overflow-x-scroll scrollbar scrollbar-track-slate-150 scrollbar-thumb-slate-400">
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
                  <span className="text-red-500 hover:cursor-pointer">
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
    </div>
  );
}

export default DashPosts;
