import React from "react";

const SongDetails = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <img
        src="https://via.placeholder.com/100"
        alt="Vinyl"
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />
      <h3 style={{ margin: "10px 0" }}>Song Name</h3>
      <p>Artist Name</p>
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>7</div>
    </div>
  );
};

export default SongDetails;
