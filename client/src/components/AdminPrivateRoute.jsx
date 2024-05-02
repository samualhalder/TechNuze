import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function AdminPrivateRoute() {
  const currentUser = useSelector((state) => state.user.currentUser);
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/"></Navigate>
  );
}

export default AdminPrivateRoute;
