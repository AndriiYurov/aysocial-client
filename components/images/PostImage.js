const PostImage = ({ url }) => {
  const src = `${url.replace("/upload/", "/upload/h_400,c_fill/")}`;
  return (
    <div
      style={{
        backgroundImage: "url(" + src + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "contain",
        height: "300px",
      }}
    ></div>
  );
};

export default PostImage;
