import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    user: {},
    token: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);

  const router = useRouter();

  const token = state && state.token ? state.token : state && state.google_token ? state.google_token : "";
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
  axios.defaults.headers.common["Authorization"] = `${token}`;

  axios.interceptors.response.use(
    function (response) {
      // Do something before request is sent
      return response;
    },
    function (error) {
      // Do something with request error
      let res = error.response;
      if (res.status === 401 && res.config && !res.config._isRetryRequest) {
        setState(null);
        window.localStorage.removeItem("auth");
        // router.push("/login");
      }
      return Promise.reject(error);
    }
  );

  return (
    <UserContext.Provider value={{ state, setState, currentPage, setCurrentPage, scrollPosition, setScrollPosition }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
