import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const ProfileButton = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <button onClick={handleClick} className="profile-button" style={{fontSize: 22, background: 'none', border: 'none', cursor: 'pointer'}}>
      👤
    </button>
  );
};

export default ProfileButton; 