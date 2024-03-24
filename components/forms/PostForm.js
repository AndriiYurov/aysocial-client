import { Avatar } from "antd";
// import dynamic from "next/dynamic";
// const Editor = dynamic(() => import("./Editor"), { ssr: false });
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";
import { Editor } from "primereact/editor";

const PostForm = ({
  content,
  setContent,
  postSubmit,
  handleImage,
  uploading,
  image,
}) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      // ["blockquote", "code-block"],
      ["link"],

      // [{ header: 1 }, { header: 2 }], // custom button values
      // [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      // [{ script: "sub" }, { script: "super" }], // superscript/subscript
      // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      // [{ direction: "rtl" }], // text direction

      // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      // [{ font: [] }],
      [{ align: [] }],

      ["clean"],
    ],
  };

  return (
    <div className="card">
      <div className="card-body pb-3">
        <form className="form-group">
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
            style={{ height: "200px" }}
            modules={modules}
            headerTemplate
          />
          {/* <Editor value={content} onChange={(e) => setContent(e)} /> */}
        </form>
      </div>
      <div className="card-footer d-flex justify-content-between text-muted">
        <button onClick={postSubmit} className="btn btn-success btn-sm mt-1">
          Post
        </button>
        <label>
          {image && image.url ? (
            <Avatar size={30} src={image.url} className="mt-1" />
          ) : uploading ? (
            <LoadingOutlined className="mt-2" />
          ) : (
            <CameraOutlined className="mt-2" />
          )}
          <input
            onChange={handleImage}
            type="file"
            accept="capture=camera,image/*"
            hidden
          />
        </label>
      </div>
    </div>
  );
};

export default PostForm;
