import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Toast,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteFailure,
  deleteSuccess,
  signOutSuccess,
} from "../redux/user/userSlice";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle, HiCheck } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

function DashProfile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [fileTransferPersantage, setFileTransferPersantage] = useState(null);
  const [fileTransferError, setFileTransferError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [photoUploading, setPhotoUploading] = useState(false);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [userUpdateFilure, setUserUpdateFilure] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userDeleteMessage, setUserDeleteMessage] = useState(null);

  const dispatch = useDispatch();

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
    setPhotoUploading(true);
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
        setPhotoUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPhotoURL(downloadURL);
          setFormData({ ...formData, photoURL: downloadURL });
          setFileTransferPersantage(null);
          setPhotoUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
   // console.log(formData);
  };

  const handleSubmit = async (e) => {
    setUserUpdateFilure(null);
    setUserUpdateSuccess(null);
    e.preventDefault();
    dispatch(updateStart());
    if (Object.keys(formData).length === 0) {
      setUserUpdateFilure("Form is empty");
      return;
    }
    if (photoUploading) {
      setUserUpdateFilure("image is uploading pls wait");
      return;
    }
    try {
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(data.errMessege));
        setUserUpdateFilure(data.errMessege);
      } else {
        dispatch(updateSuccess(data));
        setUserUpdateSuccess("User is updated successfully!");
      }
    } catch (error) {
      dispatch(updateFailure(error.errMessege));
      setUserUpdateFilure(error.errMessege);
    }
  };

  const handleDelete = async () => {
    setShowModal(false);
    dispatch(deleteStart());
    try {
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteFailure(data.errMessege));
        setUserDeleteMessage(data.errMessege);
      } else {
        dispatch(deleteSuccess());
      }

      navigate("/signin");
    } catch (err) {
      dispatch(deleteFailure(err.errMessege));
      setUserDeleteMessage(err.errMessege);
    //  console.log(err);
    }
  };
  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
       // console.log("user not signed out");
      } else {
        dispatch(signOutSuccess());
        navigate("/signin");
      }
    } catch (error) {
      //console.log(error);
    }
  };

  return (
    <div className="flex flex-col mx-auto w-[400px]">
      <h1 className="text-center m-4 font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5 w-full">
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
        <TextInput
          type="text"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          defaultValue={currentUser.email}
          id="email"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        {}
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || photoUploading}
        >
          {!loading ? "Update" : "Updating..."}
        </Button>
      </form>
      {currentUser.isAdmin && (
        <Link to={"/create-post"}>
          <Button className="w-[90%] mx-auto" gradientDuoTone="purpleToPink">
            Post a Blog
          </Button>
        </Link>
      )}
      <div className="text-red-500 flex flex-row justify-between cursor-pointer">
        <span onClick={() => setShowModal(true)}>delete account?</span>
        <span onClick={handleSignOut}>Sign Out</span>
      </div>
      {userUpdateSuccess && (
        <Alert color="success" className="mt-5">
          {userUpdateSuccess}
        </Alert>
      )}
      {userUpdateFilure && (
        <Alert color="failure" className="mt-5">
          {userUpdateFilure}
        </Alert>
      )}
      {userDeleteMessage && (
        <Alert color="failure" className="mt-5">
          {userDeleteMessage}
        </Alert>
      )}

      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to{" "}
              <span className="text-red-700">delete</span> this <b>account</b>?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile;
