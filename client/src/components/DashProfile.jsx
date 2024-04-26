import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [fileTransferPersantage, setFileTransferPersantage] = useState(null);
  const [fileTransferError, setFileTransferError] = useState(null);

  const filePickRef = useRef();
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (e.target.value) {
      setPhoto(file);
      setPhotoURL(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (photo) {
      uploadImage();
    }
  }, [photo]);
  const uploadImage = async () => {
    setFileTransferError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + photo.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, photo);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileTransferPersantage(progress.toFixed(0));
      },
      (error) => {
        setFileTransferError(
          "Could not upload the image (size may be more than 2 MB or select  a image file)"
        );
        setFileTransferPersantage(null);
        setPhoto(null);
        setPhotoURL(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPhotoURL(downloadURL);
          setFileTransferPersantage(null);
        });
      }
    );
  };

  return (
    <div className="flex flex-col mx-auto w-[400px]">
      <h1 className="text-center m-4 font-semibold text-3xl">Profile</h1>
      <form action="" className="flex flex-col gap-3 p-5 w-full">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handlePhoto(e)}
          ref={filePickRef}
          hidden
        />
        <div
          className=" relative self-center w-32 h-32 overflow-hidden rounded-full cursor-pointer"
          onClick={(e) => filePickRef.current.click()}
        >
          {fileTransferPersantage && (
            <CircularProgressbar
              value={fileTransferPersantage}
              text={`${fileTransferPersantage}%`}
              strokeWidth={5}
              styles={{
                root: {
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62,152,199,${fileTransferPersantage / 100})`,
                },
              }}
            ></CircularProgressbar>
          )}
          <img
            src={photoURL || currentUser.photoURL}
            alt="userphoto"
            className={`rounded-full h-full w-full object-cover border-8 border-[lightgray] ${
              fileTransferPersantage &&
              fileTransferPersantage < 100 &&
              "opacity-40"
            }`}
          />
        </div>
        {fileTransferError && (
          <Alert color="failure">{fileTransferError}</Alert>
        )}
        <TextInput type="text" value={currentUser.username} id="username" />
        <TextInput type="email" value={currentUser.email} id="email" />
        <TextInput type="text" placeholder="password" id="password" />
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
