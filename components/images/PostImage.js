const PostImage = ({ url }) => {
  return (
    <div
      style={{
        backgroundImage: "url(" + url + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "contain",
        height: "400px",
        
      }}
    ></div>
  );
};

export default PostImage;
