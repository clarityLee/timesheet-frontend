import React from "react";
import NavBar from "../navbar/NavBar";

const Summary = (prop) => {
  return (
    <div>
        <NavBar setAuthed={prop.setAuthed}/>
      <div>
        Summary
      </div>
    </div>
  );
};

export default Summary;