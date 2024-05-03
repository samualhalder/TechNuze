import { Button, FileInput, Select, TextInput } from "flowbite-react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost() {
  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
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
          <FileInput className="flex-1" accept="image/*"></FileInput>
          <Button>Upload</Button>
        </div>
        <ReactQuill
          theme="snow"
          className="h-72 mb-20"
          placeholder="Write something"
        />
        <Button
          type="submit"
          className="w-full "
          gradientDuoTone="purpleToPink"
        >
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
