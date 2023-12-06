import { UserProvider } from "../context";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';
import "@ant-design/cssinjs"
import { GoogleOAuthProvider } from '@react-oauth/google';


function MyApp({ Component, pageProps }) {

  return (
    <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_ID}`}>
    <UserProvider>
      <Head>
        <link rel="stylesheet" href="/css/style.css" />
      </Head>
      <Nav/>
      <ToastContainer position="top-center" />
      <Component {...pageProps} />;
      </UserProvider>
      </GoogleOAuthProvider>
  );
}

export default MyApp;
