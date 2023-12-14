import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import {Avatar} from "antd";

const Nav = () => {
  const [current, setCurrent] = useState("");
  const { state, setState } = useContext(UserContext);

  const isBrowser = () => typeof window !== "undefined";
  useEffect(() => {
    isBrowser && setCurrent(window.location.pathname);
  }, [isBrowser]);

  const router = useRouter();

  const logout = () => {
    
    window.localStorage.removeItem("auth");
    setState(null);
    setTimeout(() => {
      router.push("/login");
    }, 1000);
    
    
  };
  return (
    <nav className="nav fixed-top d-flex bg-dark justify-content-between" style={{opacity: "0.5", margin: "10px", borderRadius: "10px"}}>
      <div className={`${current === "/" && "active"}`}>
        <Link href="/" className=" text-light hover">
          <Avatar className="logo" size={80} src="/images/logo.png"/>
        </Link>
      </div>

      {state !== null ? (
        <div className="dropdown">
          <a
            className="btn dropdown-toggle text-light hover"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {state && state.user && state.user.name}
          </a>
          <ul className="dropdown-menu">
            <li>
              <div className={`${current === "/user/dashboard" && "active"} ` }>
                <Link
                  href="/user/dashboard"
                  className="dropdown-item hover"
                >
                  Dashboard
                </Link>
              </div>
            </li>
            <li>
              <div className={`${current === "/user/profile/update" && "active"}` }>
                <Link
                  href="/user/profile/update"
                  className="dropdown-item hover"
                >
                  Profile
                </Link>
              </div>
            </li>
            {state && state.user && state.user.role === "Admin" && (
              <li>
              <div className={`${current === "/admin" && "active"}` }>
                <Link
                  href="/admin"
                  className="dropdown-item hover"
                >
                 Admin
                </Link>
              </div>
            </li>
            )}
            <li>
              <Link href="" onClick={logout} className="dropdown-item hover">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <>
          <div className={`${current === "/login" && "active"}`}>
            <Link href="/login" className="nav-link text-light hover">
              Login
            </Link>
          </div>

          <div className={`${current === "/register" && "active"}`}>
            <Link href="/register" className="nav-link text-light hover">
              Register
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Nav;
