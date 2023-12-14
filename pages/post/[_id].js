import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import UserRoute from "../../components/routes/UserRoute";
import { toast } from "react-toastify";
import Post from "../../components/cards/Post";
import Link from "next/link";
import { RollbackOutlined } from "@ant-design/icons";
import ParallaxBG from "../../components/cards/ParallaxBG";
import CommentForm from "../../components/forms/CommentForm";
import { Modal } from "antd";

const PostComments = () => {
  const [post, setPost] = useState({});
  const router = useRouter();
  const _id = router.query._id;

  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  //pagination
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);

      setPost(data);
    } catch (err) {
      console.log(err);
    }
  };

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/news-feed/${page}`);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (_id) => {
    // console.log("like this post => ", _id);
    try {
      const { data } = await axios.put("/like-post", { _id });
      // console.log("liked", data);
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    // console.log("unlike this post => ", _id);
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      // console.log("unliked", data);
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    // console.log("add comment to this post id", currentPost)._id;
    // console.log("save comment to db", comment);
    try {
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comment,
      });
      // console.log("add coment", data);
      setComment("");
      setVisible(false);
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (postId, comment) => {
    // console.log(postId, comment);
    let answer = window.confirm("Are you sure?");
    if (!answer) return;
    try {
      const { data } = await axios.put("/remove-comment", {
        postId,
        comment,
      });
      console.log("comment removed", data);
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ParallaxBG url="/images/default.jpg">Comments</ParallaxBG>
      <div className="container-fluid">
        <div className="container col-md-5  pt-5">
          <Post
            post={post}
            commentsCount={100}
            removeComment={removeComment}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleComment={handleComment}
            addComment={addComment}
          />
        </div>
        <div
          className="d-flex justify-content-center p-5 pointer"
          onClick={() => router.back()}
        >
          <RollbackOutlined />
        </div>
      </div>
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        title="Comment"
        footer={null}
      >
        <CommentForm
          comment={comment}
          setComment={setComment}
          addComment={addComment}
        />
      </Modal>
    </>
  );
};

export default PostComments;
