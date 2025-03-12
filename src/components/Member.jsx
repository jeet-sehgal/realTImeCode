import Avatar from "react-avatar";
import React from "react";

function Member({ name, id, admin, youId, adminId, kick, edit, setEdit }) {
  // console.log(allow)
  // console.log(youId)
  function nameManage(name) {
    if (name.length > 9) {
      return name.slice(0, 9) + "...";
    }
    return name;
  }
  return (
    <div style={{ marginBottom: "5px", position: "relative" }} key={id}>
      <Avatar name={name} size="40" round="10px" />
      <h4 style={{ color: "white", display: "inline", marginLeft: "5px" }}>
        {nameManage(name)}
      </h4>
      {youId == id ? (
        <span style={{ color: "rgba(146, 146, 146, 0.735)" }}>(you)</span>
      ) : (
        ""
      )}

      <h6
        style={{
          color: "rgb(6, 215, 166)",
          display: "inline",
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "10px",
        }}
      >
        {admin ? "ADMIN" : ""}
        {/* {console.log(id)} */}
        {/* {console.log(adminId)} */}
        {/* {console.log("data:", edit)} */}
        {youId == adminId ? (
          admin ? (
            ""
          ) : !edit[0].edit ? (
            <button
              onClick={() => {
                setEdit(id);
              }}
              style={{
                backgroundColor: "transparent",
                color: "red",
                marginRight: "10px",
                border: "none",
                cursor:"pointer",
              }}
            >
              <i class="fa-solid fa-text-slash"></i>
            </button>
          ) : (
            <button
              onClick={() => setEdit(id)}
              style={{
                backgroundColor: "transparent",
                cursor:"pointer",
                color: "rgb(6, 215, 166)",
                marginRight: "10px",
                border: "none",
              }}
            >
              <i class="fa-solid fa-pencil"></i>
            </button>
          )
        ) : (
          // !edit[0].edit?<i class="fa-solid fa-eye"></i>:<i class="fa-solid fa-pencil"></i>
          admin?"":!edit[0].edit?<i class="fa-solid fa-eye" style={{color:'red',}}></i>:<i class="fa-solid fa-pencil"></i>
        )}
        {youId == adminId ? (
          admin ? (
            ""
          ) : (
            <button
              style={{
                backgroundColor: "transparent",
                color: "red",
                cursor: "pointer",
                border: "0px",
              }}
              onClick={() => {
                kick(id);
              }}
            >
              <i className="fa-solid fa-person-walking-arrow-right"></i>
            </button>
          )
        ) : (
          ""
        )}
      </h6>
    </div>
  );
}

export default Member;
