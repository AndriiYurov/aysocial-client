import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

const AdminRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const { state } = useContext(UserContext);

  useEffect(() => {
    state && state.token && getCurrentAdmin();
  }, [state && state.token]);

  const getCurrentAdmin = async () => {
    try {
      const { data } = await axios.get(
        `/current-admin`
        // `${process.env.NEXT_PUBLIC_API}/current-user`,
        // {
        //   headers: {
        //     Authorization: `${state.token}`,
        //   },
        // }
      );
      if (data.ok) setOk(true);
    } catch (err) {
      router.push("/");
    }
  };

  const isBrowser = () => typeof window !== "undefined";
  isBrowser &&
    state === null &&
    setTimeout(() => {
      getCurrentAdmin();
    }, 1000);

  return !ok ? (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-primary p-5"
    />
  ) : (
    <>{children}</>
  );
};

export default AdminRoute;
