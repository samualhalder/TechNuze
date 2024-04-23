import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="flex flex-col mx-auto">
      <h1 className="text-center m-4 font-semibold text-3xl">Profile</h1>
      <form action="" className="flex flex-col gap-3 p-5">
        <div className="self-center w-32 h-32 rounded-full border-8 border-green-300 cursor-pointer">
          <img
            src={currentUser.photoURL}
            alt="userphoto"
            className="h-full w-full rounded-[50%]"
          />
        </div>
        <TextInput
          type="text"
          value={currentUser.username}
          id="username"
          sizing="lg"
        />
        <TextInput
          type="email"
          value={currentUser.email}
          id="email"
          sizing="lg"
        />
        <TextInput
          type="text"
          placeholder="password"
          id="password"
          sizing="lg"
        />
        <Button action="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex flex-row justify-between cursor-pointer">
        <span>delete account?</span>
        <span>Sign Out</span>
      </div>
    </div>
  );
}

export default DashProfile;
