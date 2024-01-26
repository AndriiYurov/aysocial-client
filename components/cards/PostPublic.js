import { useContext } from "react";
import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import PostImage from "../images/PostImage";
import { HeartOutlined, HeartFilled, CommentOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";
import { imageSource } from "../../functions";
import { MDBRipple } from "mdb-react-ui-kit";

const PostPublic = ({ post, commentsCount = 3 }) => {
  const { state } = useContext(UserContext);

  return (
    <div>
      {post && post.postedBy && (
        <div key={post._id} className="card mb-5">
          <div className="card-header">
            {/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar> */}
            <Avatar
              size={40}
              src={imageSource(post.postedBy)}
              alt="user avatar"
            />
            <span className="pt-2 ml-3" style={{ marginLeft: "0.5rem" }}>
              {post.postedBy.name}
            </span>
            <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="card-body">{renderHTML(post.content)}</div>
          <div className="card-footer">
            {/* {post.image && <PostImage url={post.image.url} />} */}
            {post.image && (
              <MDBRipple
                className="d-flex justify-content-center"
                rippleTag="a"
              >
                <img
                  src={post.image.url}
                  className="img-fluid rounded"
                  alt="post image"
                />
              </MDBRipple>
            )}
            <div className="d-flex  justify-content-between p-2">
              <div className="d-flex align-items-center">
                {state &&
                state.user &&
                post.likes &&
                post.likes.includes(state.user._id) ? (
                  <HeartFilled className="text-secondary pt-2 h5 px-1" />
                ) : (
                  <HeartOutlined className="text-secondary pt-2 h5 px-1" />
                )}
                <div className="p-2">{post.likes.length} likes</div>
              </div>
              <div className="d-flex align-items-center">
                <CommentOutlined className="text-secondary pt-2 h5 px-1" />
                <div className="p-2">{post.comments.length} comments</div>
              </div>
            </div>
          </div>
          {/* 2 comments */}
          {post.comments && post.comments.length > 0 && (
            <ol
              className="list-group m-2"
              style={{ maxHeight: "125px", overflow: "scroll" }}
            >
              {post.comments.slice(0, commentsCount).map((c) => (
                <li
                  key={c._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div>
                      <Avatar
                        size={20}
                        className="m-1"
                        src={imageSource(c.postedBy)}
                        alt="user avatar"
                      />
                      {c.postedBy.name}
                    </div>
                    <div>{c.text}</div>
                  </div>
                  <span className="badge rounded-pill text-muted">
                    {moment(c.created).fromNow()}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
};

export default PostPublic;
