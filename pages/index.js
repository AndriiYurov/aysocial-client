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
import { ArrowUpOutlined } from "@ant-design/icons";

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
  const [ok, setOk] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // set scroll restoration to manual
  useEffect(() => {
    if ('scrollRestoration' in history && history.scrollRestoration !== 'manual') {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // handle and store scroll position
  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // restore scroll position
  useEffect(() => {
    if ('scrollPosition' in sessionStorage) {
      window.scrollTo(0, Number(sessionStorage.getItem('scrollPosition')));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  useEffect(() => {
    socket.on("new-post", (newPost) => {
      setNewsFeed([newPost, ...posts]);
    });

   

    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if ((state && state.token) || (state && state.google_token)) {
      getCurrentUser();
    }
    // state && state.token && getCurrentUser();
    // state && state.google_token && getCurrentUser();
  }, [state && state.token, state && state.google_token]);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
  };

  const scrollToTop = () => {
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get(`/current-user`);
      if (data.ok) setOk(true);
    } catch (err) {
      router.push("/login");
    }
  };

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
      <ParallaxBG url="/images/default.jpg">AY Social</ParallaxBG>
      <div className="container-fluid flex-column d-flex align-items-center">
        {/* <button
          onClick={() => {
            socket.emit("send-message", "This is rayan!!!");
          }}
        >
          Send message
        </button> */}

        <button
          className={`scroll-to-top-button ${isVisible ? "visible" : ""}`}
          onClick={scrollToTop}
        >
          <ArrowUpOutlined />
        </button>

        <div className="pt-3 custom-scrollbar col-md-6">
          {collection.map((post) => (
            <div key={post._id} id={post._id}>
              <Link
                className="nav-link"
                href={!ok ? `/post/view/${post._id}` : `/post/${post._id}`}
              >
                <PostPublic post={post} />
              </Link>
            </div>

            // <div onClick={() => router.push(`/post/${post._id}`)} key={post._id} className="col-md-4">
            //     <PostPublic  post={post} />

            //     </div>
          ))}
        </div>
      </div>
      {/* <footer className="bd-footer py-2  bg-light">
        <div className="row">
          <div className="col">
            <p className="text-center mt-2">
              Created by{" "}
              <Link
                className="link-underline-light"
                href="https://www.linkedin.com/in/andrii-yurov-b7138925a/"
                target="blank"
              >
                Andrii Yurov
              </Link>
            </p>
          </div>
        </div>
      </footer> */}
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
