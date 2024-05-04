import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgess, setImageUploadProgess] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
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
            setFormData({ ...formData, image: downloadURL });
            console.log(formData);
          });
        }
      );
    } catch (error) {
      setImageUploadError("something went wrong");
      setImageUploadProgess(null);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto">
      <h1 className="text-center text-3xl font-semibold my-10">
        Create a Post
      </h1>
      <form action="submit">
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput id="title" className="flex-1" required></TextInput>
          <Select id="category">
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
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover mb-4"
          />
        )}
        <ReactQuill
          theme="snow"
          className="h-72 mb-20"
          placeholder="Write something"
        />
        <Button
          type="submit"
          className="w-full mb-4"
          gradientDuoTone="purpleToPink"
        >
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
