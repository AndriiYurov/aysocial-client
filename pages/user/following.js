import { useContext, useState, useEffect } from "react";
import { Avatar, List } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import { toast } from "react-toastify";

const Following = () => {
  const { state, setState } = useContext(UserContext);
  const [people, setPeople] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (state && state.token || state && state.google_token) {
      fetchFollowing();
    }
  }, [state && state.token, state && state.google_token]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/user-following");
    //   console.log("following =>", data);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const imageSource = (user) => {
    if (user.image) {
      return user.image.url;
    } else {
      return "/images/logo.png";
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
    //   console.log("Unfollow data =>", data)
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update context
      setState({ ...state, user: data });
      //update people state
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      toast.success(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row mt-5 col-md-6 offset-md-3">
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imageSource(user)} />}
              title={
                <div className="d-flex justify-content-between">
                  {/* {user.username}{" "} */}
                  <Link
                    className="link-underline-light"
                    href={`/user/${user.username}`}
                  >
                    {user.username}
                  </Link>
                  <span
                    onClick={() => handleUnfollow(user)}
                    className="text-primary pointer"
                  >
                    Unfollow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Link
        className="d-flex justify-content-center pt-5"
        href="/user/dashboard"
      >
        <RollbackOutlined />
      </Link>
    </div>
  );
};

export default Following;
