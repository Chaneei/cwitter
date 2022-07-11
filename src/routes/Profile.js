import React from "react";
import { authService } from "../fbase";
import { useNavigate } from "react-router-dom";
function Profile() {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  return (
    <div>
      Profile
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
}

export default Profile;
