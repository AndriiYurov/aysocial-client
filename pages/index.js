import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import ParallaxBG from "../components/cards/ParallaxBG";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import PostPublic from "../components/cards/PostPublic";
import Post from "../components/cards/Post";
import { useRouter } from "next/router";
import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKETIO,
  { path: "/socket.io" },
  {
    reconnection: true,
  }
);

const Home = ({ posts }) => {
  const { state, setState } = useContext(UserContext);
  const router = useRouter();
  const [newsFeed, setNewsFeed] = useState([]);

  // useEffect(() => {
  //   socket.on("receive-message", (newMessage) => {
  //     setText(newMessage);
  //   });
  // }, []);

  useEffect(() => {
    socket.on("new-post", (newPost) => {
      setNewsFeed([newPost, ...posts]);
    });
  }, []);

  const collection = newsFeed.length > 0 ? newsFeed : posts;

  return (
    <>
      <Head>
        <title>AY Social - A social network</title>
        <meta
          name="description"
          content="A social network by Andrii Yurov dev"
        />
        <meta
          property="og:description"
          content="A social network by Andrii Yurov dev"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AY Social" />
        <meta property="og:url" content="http://aysocial.com" />
        <meta
          property="og:image:secure_url"
          content="http://aysocial.com/images/default.jpg"
        />
      </Head>
      <ParallaxBG url="/images/default.jpg" />
      <div className="container">
        {/* <button
          onClick={() => {
            socket.emit("send-message", "This is rayan!!!");
          }}
        >
          Send message
        </button> */}

        <div className="row pt-5">
          {collection.map((post) => (
            <div key={post._id} className="col-md-4">
              <Link className="nav-link" href={`/post/view/${post._id}`}>
                <PostPublic post={post} />
              </Link>
            </div>

            // <div onClick={() => router.push(`/post/${post._id}`)} key={post._id} className="col-md-4">
            //     <PostPublic  post={post} />

            //     </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get("/posts");
  // console.log(data);
  return {
    props: {
      posts: data,
    },
  };
}

export default Home;