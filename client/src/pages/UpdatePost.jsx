import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";

function UpdatePost() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [imageUploadProgess, setImageUploadProgess] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formUplaodError, setFormUplaodError] = useState(null);
  const params = useParams();
  const { postID } = params;
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const response = await fetch(`/api/post/getposts?postID=${postID}`);
        const data = await response.json();
        //console.log("data", data);
        if (response.ok) {
          setFormData(data.posts[0]);
          //console.log("formdata", formData);
        } else {
          setFormUplaodError(data.errMessege);
        }
      };
      fetchPost();
    } catch (error) {
      // console.log(error);
      setFormUplaodError(error);
    }
  }, [postID]);
  const handleImage = async () => {
    try {
      if (!file) {
        setImageUploadError("select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgess(progress.toFixed(0));
        },
        () => {
          setImageUploadError("some thing went wrong");
          setImageUploadProgess(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgess(null);
            setFormData({ ...formData, photoURL: downloadURL });
            // console.log(formData);
          });
        }
      );
    } catch (error) {
      setImageUploadError("something went wrong");
      setImageUploadProgess(null);
      // console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/post/update-post/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return setFormUplaodError(data.errMessege);
      }
      setFormUplaodError(null);
      //  console.log(data, response);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setFormUplaodError(error.errMessege);
      //  console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto">
      <h1 className="text-center text-3xl font-semibold my-10">
        Update this Post
      </h1>
      <form action="submit" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            id="title"
            className="flex-1"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          ></TextInput>
          <Select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="nocategory">select a option</option>
            <option value="javascript">javaScript</option>
            <option value="react">React</option>
            <option value="next">Next</option>
            <option value="node">Node</option>
          </Select>
        </div>
        <div className="flex w-full justify-between gap-4 my-5 border-2 border-teal-400 border-dotted p-6">
          <FileInput
            className="flex-1"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          ></FileInput>
          <Button onClick={handleImage} disabled={imageUploadProgess}>
            {imageUploadProgess ? (
              <div className="h-16 w-16 bg-white">
                <CircularProgressbar
                  value={imageUploadProgess}
                  text={`${imageUploadProgess}%` || 0}
                ></CircularProgressbar>
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color="failure" className="mb-2">
            {imageUploadError}
          </Alert>
        )}
        {formData.photoURL && (
          <img
            src={formData.photoURL}
            alt="upload"
            className="w-full h-72 object-cover mb-4"
          />
        )}
        <ReactQuill
          theme="snow"
          className="h-72 mb-20"
          value={formData.content}
          placeholder="Write something"
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button
          type="submit"
          className="w-full mb-4"
          gradientDuoTone="purpleToPink"
        >
          Update
        </Button>
        {formUplaodError && <Alert color="failure">{formUplaodError}</Alert>}
      </form>
    </div>
  );
}

export default UpdatePost;
