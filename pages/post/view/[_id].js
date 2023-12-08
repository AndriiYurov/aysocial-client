import ParallaxBG from "../../../components/cards/ParallaxBG";
import axios from "axios";
import Head from "next/head";
import PostPublic from "../../../components/cards/PostPublic";

import { useRouter } from "next/router";
import UserRoute from "../../../components/routes/UserRoute";
import Post from "../../../components/cards/Post";

const SinglePost = ({ post }) => {
  const router = useRouter();

  const imageSource = (post) => {
    if (post.image) {
      return post.image.url;
    } else {
      return "/images/default.jpg";
    }
  };

  return (
    <>
      <Head>
        <title>AY Social - A social network</title>
        <meta name="description" content={post.content} />
        <meta
          property="og:description"
          content="A social network by Andrii Yurov dev"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AY Social" />
        <meta
          property="og:url"
          content={`http://aysocial.com/post/view/${post._id}`}
        />
        <meta property="og:image:secure_url" content={imageSource(post)} />
      </Head>
      <ParallaxBG url="/images/default.jpg" />
      <div className="container">
        <div className="row pt-5">
          <div className="col-md-8 offset-md-2">
            <PostPublic post={post} />
            <UserRoute>
              
            <Post
            post={post}
            
          />
            </UserRoute>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { data } = await axios.get(`/post/${ctx.params._id}`);
  // console.log(data);
  return {
    props: {
      post: data,
    },
  };
}

export default SinglePost;
