import React from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

interface CommentSectionProps {
  comments: UserComment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
    <div style={{ padding: "10px" }}>
      {comments.map((c, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ccc",
              marginRight: "10px",
            }}
          ></div>
          <div>
            <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>
              {c.username}
            </p>
            <p style={{ margin: 0 }}>{c.comment}</p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <AiOutlineLike size={16} style={{ marginRight: "5px" }} />
            {c.upvotes}
            <AiOutlineDislike size={16} style={{ marginLeft: "10px" }} />
          </div>
        </div>
      ))}
      <input
        type="text"
        placeholder="Add a comment..."
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          marginTop: "10px",
        }}
      />
    </div>
  );
};

export default CommentSection;
