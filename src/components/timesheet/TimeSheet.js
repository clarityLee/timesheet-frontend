import React from "react";
import NavBar from "../navbar/NavBar";

const TimeSheet = (prop) => {
  return (
    <div>
        <NavBar setAuthed={prop.setAuthed}/>
      <div>
        Time Sheet
      </div>
    </div>
  );
};

export default TimeSheet;