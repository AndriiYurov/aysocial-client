import { useContext, useState, useEffect } from "react";
import { Avatar, Card } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import { toast } from "react-toastify";

const { Meta } = Card; // <Card.Meta></Card.Meta>

const Username = () => {
  const { state, setState } = useContext(UserContext);
  const [user, setUser] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      fetchUser();
    }
  }, [router.query.username, state]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
      //   console.log("following =>", data);
      setUser(data);
    } catch (err) {
      //console.log(err);
    }
  };

  const imageSource = (user) => {
    if (user.image) {
      return user.image.url;
    } else {
      return "/images/logo.png";
    }
  };

  const handleFollow = async (user) => {
    // console.log("add this user to following list", user)
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      // console.log("handle follow response => ", data);
      // update local storage, update user, keep token
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update context
      setState({ ...state, user: data });
      //update people state
      // let filtered = people.filter((p) => p._id !== user._id);
      // setPeople(filtered);
      toast.success(`Following ${user.name}`);
      //rerender the posts
      newsFeed();
    } catch (err) {
      //console.log(err);
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
      // let filtered = people.filter((p) => p._id !== user._id);
      // setPeople(filtered);
      toast.success(`Unfollowed ${user.name}`);
    } catch (err) {
      //console.log(err);
    }
  };

  return (
    <div className="row col-md-6 offset-md-3">
      {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}
      <div className="mt-3 d-flex justify-content-center pt-5 pb-5">
        <Card className="w-50" hoverable cover={<img src={imageSource(user)} alt={user.name} />}>
          <Meta title={user.username} description={user.about} />

          <p className="pt-2 text-muted">
            Joinet {moment(user.createdAt).fromNow()}
          </p>

          <div className="d-flex justify-content-between ">
            <span className="btn btn-sm">
              {user.followers && user.followers.length} Followers
            </span>
            <span className="btn btn-sm">
              {user.following && user.following.length} Following
            </span>
          </div>
          <div className="d-flex justify-content-center w-100">
           
            {state &&
                  state.user &&
                  user.followers &&
                  user.followers.includes(state.user._id) ? (
                    <span
                      onClick={() => handleUnfollow(user)}
                      className="text-primary pointer"
                    >
                      Unfollow
                    </span>
                  ) : (
                    <span
                      onClick={() => handleFollow(user)}
                      className="text-primary pointer"
                    >
                      Follow
                    </span>
                  )}
            

          </div>
          
        </Card>
      </div>

      <Link
        className="d-flex justify-content-center pt-5"
        href="/user/dashboard"
      >
        <RollbackOutlined />
      </Link>
    </div>
  );
};

export default Username;
