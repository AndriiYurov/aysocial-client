const ParallaxBG = ({ url, children }) => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: "url( " + url + " )",
        backgroundAttachment: "fixed",
        padding: "100px 0px 75px 0px",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto",
        backgroundPosition: "center center",
        display: "block",
        height: "auto",
        margin: "-70px 0 0 0",
      }}
    >
      <h1 className="display-1 font-weight-bold text-center bg-text">
        {children}
      </h1>
    </div>
  );
};

export default ParallaxBG;
