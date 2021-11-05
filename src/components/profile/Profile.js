import React from "react";
import NavBar from "../navbar/NavBar";

const Profile = (prop) => {
  return (
    <div>
        <NavBar setAuthed={prop.setAuthed}/>
      <div>
        Profile
      </div>
    </div>
  );
};

export default Profile;