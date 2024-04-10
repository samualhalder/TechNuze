import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";

function Signup() {
  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex p-4 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1 ">
          <Link to={"/"} className="text-4xl text-bold mt-10 text-center">
            <span className="p-2 bg-gradient-to-r from-indigo-500 via-purple-700 to-pink-400 text-white rounded-lg">
              Blog
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
              <Label>username</Label>
              <TextInput
                type="text"
                placeholder="username"
                id="username"
              ></TextInput>
            </div>
            <div>
              <Label>Email</Label>
              <TextInput
                type="text"
                placeholder="email@company.com"
                id="email"
              ></TextInput>
            </div>
            <div>
              <Label>Password</Label>
              <TextInput
                type="text"
                placeholder="Password"
                id="password"
              ></TextInput>
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Sign up
            </Button>
          </form>
          <span className="m-10 text-sm">
            Have an account?{"  "}
            <Link to={"/signin"} className="text-blue-500 ">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
