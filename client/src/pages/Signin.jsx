import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFail,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

function Signin() {
  const [formData, setFormData] = useState({});
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const navigate=useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFail("pls enter all the fields"));
    }
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success === false) {
        dispatch(signInFail(data.errMessege));
      }

      if (response.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFail(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex p-4 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1 ">
          <Link to={"/"} className="text-4xl text-bold mt-10 text-center">
            <span className="p-2 bg-gradient-to-r from-indigo-500 via-purple-700 to-pink-400 text-white rounded-lg">
              CodeBlogs
            </span>
            365
          </Link>
          <p className="mt-4 text-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque
            nemo ab, eaque iusto, odit asperiores ducimus quis aspernatur fuga
            ipsam reiciendis non deserunt vitae eveniet, totam tempore quasi
            similique voluptate.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="m-10 flex flex-col gap-3">
            <div>
              <Label>email</Label>
              <TextInput
                type="email"
                placeholder="email@company.com"
                id="email"
                onChange={(e) => handleChange(e)}
              ></TextInput>
            </div>
            <div>
              <Label>Password</Label>
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={(e) => handleChange(e)}
              ></TextInput>
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="mx-4" />
                  <span>Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            {error && <Alert className=" bg-red-400 text-white">{error}</Alert>}
          </form>
          <span className="m-10 text-sm">
            Dont have an account?{"  "}
            <Link to={"/signup"} className="text-blue-500 ">
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signin;
