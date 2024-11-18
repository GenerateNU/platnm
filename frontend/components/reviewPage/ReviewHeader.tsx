import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiOutlineFilter } from "react-icons/ai";

const ReviewHeader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <IoArrowBackOutline size={24} />
      <h2 style={{ margin: 0 }}>Review</h2>
      <AiOutlineFilter size={24} />
    </div>
  );
};

export default ReviewHeader;
