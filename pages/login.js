import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import { useGoogleLogin } from "@react-oauth/google";

import AuthForm from "../components/forms/AuthForm";
import ParallaxBG from "../components/cards/ParallaxBG";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { state, setState } = useContext(UserContext);

  const [userGoogle, setUserGoogle] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (userGoogle && userGoogle.access_token) {
      // console.log(userGoogle)
      handleGoogleUser();
    }
  });

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) =>
      setUserGoogle(codeResponse) ||
      Cookies.set("GoogleToken", codeResponse.access_token),

    onError: (error) => console.log("Login Failed:", error),
  });

  const handleGoogleUser = async () => {
    try {
      const { data } = await axios.post(`/login`, {
        google_token: userGoogle.access_token, //send google token to backend
      });
      // console.log("data from login Google => ", data);

      setState({
        user: data.user,
        token: data.google_token,
      });

      window.localStorage.setItem("auth", JSON.stringify(data));
      // router.push("/user/dashboard");
    } catch (err) {
      //console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });
      // console.log("data from login => ", data);

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setState({
          user: data.user,
          token: data.token,
        });

        window.localStorage.setItem("auth", JSON.stringify(data));
        router.push("/user/dashboard");
      }
    } catch (err) {
      //console.log(err);
      toast.error(err.response.data);
      setLoading(false);
    }
  };

 

  if (state && state.google_token || state && state.token) router.push("/user/dashboard");
  // if (state && state.google_token) router.push("/user/dashboard");

  return (
    <>
      <ParallaxBG url="/images/default.jpg">Login</ParallaxBG>
      <div className="container-fluid">
        {/* <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Login</h1>
        </div>
      </div> */}

        <div className="row py-5">
          <div className="col-md-6 offset-md-3">
            <AuthForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              page="login"
            />
          </div>
        </div>

        <div className="d-flex justify-content-center mb-2 p-3">
          <button className="btn btn-success" onClick={loginGoogle}>
            Login with Google
          </button>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-center">
              Not yet registered?{" "}
              <Link className="link-underline-light" href="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p className="text-center">
              <Link
                className="text-danger link-underline-light"
                href="/forgot-password"
              >
                Forgot password
              </Link>
            </p>
          </div>
        </div>
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
    </>
  );
};

export default Login;
