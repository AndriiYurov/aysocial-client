import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";

import AuthForm from "../components/forms/AuthForm";
import ParallaxBG from "../components/cards/ParallaxBG";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const { state, setState } = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/register`, {
        name,
        email,
        password,
        secret,
      });
      setName("");
      setEmail("");
      setPassword("");
      setSecret("");
      setOk(data.ok);
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  if (state && state.token) router.push("/");

  return (
    <>
      <ParallaxBG url="/images/default.jpg">Register</ParallaxBG>
      <div className="container-fluid">
        {/* <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Register</h1>
        </div>
      </div> */}

        <div className="row py-5">
          <div className="col-md-6 offset-md-3">
            <AuthForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              secret={secret}
              setSecret={setSecret}
              loading={loading}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Modal
              title="Congratulation"
              open={ok}
              onCancel={() => setOk(false)}
              footer={null}
            >
              <p>You have successfully registered</p>
              <Link href="/login" className="btn btn-success btn-sm">
                Login
              </Link>
            </Modal>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p className="text-center">
              Already registered? <Link className="link-underline-light" href="/login">Login</Link>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p className="text-center mt-3" style={{fontSize: "10px"}}>
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

export default Register;
