import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFail,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

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
          <Link
            to={"/"}
            className="whitespace-nowrap text-sm sm:text-lg self-center"
          >
            <img
              className="p-2 bg-gradient-to-r h-20 text-white rounded-lg"
              src="../../public/white-transparent.png"
              alt="logo"
            />
          </Link>
          <p className="mt-4 text-sm">
            your premier destination for the latest and most exciting tech news
            from around the world. Stay informed with up-to-the-minute updates,
            in-depth analyses, and insightful commentary on all things tech.
            Join us and stay ahead of the curve in the ever-evolving world of
            technology
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
            <OAuth />
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
