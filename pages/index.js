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
import Pagination from "../components/Pagination";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKETIO,
  { path: "/socket.io" },
  {
    reconnection: true,
  }
);

const Home = ({ posts }) => {
  const { state, setState } = useContext(UserContext);
  const { currentPage, setCurrentPage } = useContext(UserContext);
  const router = useRouter();
  const [newsFeed, setNewsFeed] = useState([]);
  const [ok, setOk] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  //const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    try {
      axios.get("/total-posts").then(({ data }) => setTotalPosts(data));
    } catch (err) {
      //console.log(err);
    }
  }, [newsFeed]);

  useEffect(() => {
    const handleUpdatedPost = (result) => {
      
      setNewsFeed(result);
    };

    if (currentPage === 1) {
      socket.on("updated-post", handleUpdatedPost);
    }

    return () => {
      // Cleanup the socket event listener when the component unmounts or when currentPage changes.
      socket.off("updated-post", handleUpdatedPost);
    };
  }, [currentPage]);

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchMoreData();
  }, [currentPage]);

  const fetchMoreData = async () => {
    const { data } = await axios.get(`/posts/${currentPage}`);
    setNewsFeed(data);
  };

  // // infinite scroll
  // useEffect(() => {
  //   window.addEventListener("scroll", handleInfiniteScroll);
  //   console.log(currentPage);

  //   fetchMoreData();
  //   return () => {
  //     window.removeEventListener("scroll", handleInfiniteScroll);
  //   };
  // }, [currentPage]);

  // const fetchMoreData = async () => {
  //   const { data } = await axios.get(`/posts/${currentPage}`);
  //   console.log("PAGE", currentPage);
  //   console.log(data);
  //   setNewsFeed((prevData) => [...prevData, ...data]);
  // };

  // const handleInfiniteScroll = () => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop ===
  //     document.documentElement.offsetHeight
  //   ) {
  //     setCurrentPage((prev) => prev + 1);
  //   }
  // };

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
    <div>
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
            <div
              onClick={() =>
                router.push(
                  !ok ? `/post/view/${post._id}` : `/post/${post._id}`
                )
              }
              key={post._id}
            >
              <PostPublic post={post} />
              {/* <Link
                className="nav-link"
                href={!ok ? `/post/view/${post._id}` : `/post/${post._id}`}
              >
                <PostPublic post={post} />
              </Link> */}
            </div>

            // <div onClick={() => router.push(`/post/${post._id}`)} key={post._id} className="col-md-4">
            //     <PostPublic  post={post} />

            //     </div>
          ))}
        </div>
        <Pagination
          page={currentPage}
          setPage={setCurrentPage}
          postCount={totalPosts}
          scrollToTop={scrollToTop}
        />
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
      <div className="row">
        <div className="col">
          <p className="text-center mt-3" style={{ fontSize: "10px" }}>
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
    </div>
  );
};

export async function getServerSideProps() {
  const currentPage = 1;
  const { data } = await axios.get(`/posts/${currentPage}`);
  // console.log(data);
  return {
    props: {
      posts: data,
    },
  };
}

export default Home;
