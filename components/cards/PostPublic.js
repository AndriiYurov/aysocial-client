import { useContext } from "react";
import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import PostImage from "../images/PostImage";
import { HeartOutlined, HeartFilled, CommentOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";
import { imageSource } from "../../functions";

const PostPublic = ({ post, commentsCount = 3 }) => {
  const { state } = useContext(UserContext);

  return (
    <div>
      {post && post.postedBy && (
        <div key={post._id} className="card mb-5">
          <div className="card-header">
            {/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar> */}
            <Avatar size={40} src={imageSource(post.postedBy)} />
            <span className="pt-2 ml-3" style={{ marginLeft: "0.5rem" }}>
              {post.postedBy.name}
            </span>
            <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="card-body">{renderHTML(post.content)}</div>
          <div className="card-footer">
            {post.image && <PostImage url={post.image.url} />}
            <div className="d-flex p-2">
              {state &&
              state.user &&
              post.likes &&
              post.likes.includes(state.user._id) ? (
                <HeartFilled className="text-danger pt-2 h5 px-1" />
              ) : (
                <HeartOutlined className="text-danger pt-2 h5 px-1" />
              )}
              <div className="pt-2 pl-3" style={{ marginRight: "1rem" }}>
                {post.likes.length} likes
              </div>
              <CommentOutlined className="text-danger pt-2 h5 px-1" />
              <div className="pt-2 pl-3">{post.comments.length} comments</div>
            </div>
          </div>
          {/* 2 comments */}
          {post.comments && post.comments.length > 0 && (
            <ol
              className="list-group"
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
