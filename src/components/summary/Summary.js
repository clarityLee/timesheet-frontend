import React, { useState, useEffect } from "react";
import NavBar from "../navbar/NavBar";

import axios from "axios";
import { withRouter } from "react-router-dom";

const URL = "http://localhost:9000/user"; //endpoint to get data

const Summary = (prop) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await axios.get(URL);
    setEmployees(response.data);
  };

  const renderHeader = () => {
    let headerElement = [
      "id",
      "WeekEnding",
      "Total Hours",
      "Submission Status",
      "Approval Status",
      "Option",
      "Comment",
    ];

    return headerElement.map((key, index) => {
      return <th key={index}>{key}</th>;
    });
  };

  const renderBody = () => {
    return (
      employees &&
      employees.map(
        ({
          id,
          weekEnding,
          billingHours,
          submissionStatus,
          approvalStatus,
          comment,
        }) => {
          return (
            <tr key={id}>
              <td>{weekEnding}</td>
              <td>{billingHours}</td>
              <td>{submissionStatus}</td>
              <td>{approvalStatus}</td>
              <td className="option">
                <button className="button" onClick={() => editData(id)}>
                  edit
                </button>
              </td>
              <td>{comment}</td>
            </tr>
          );
        }
      )
    );
  };

  const editData = (id) => {
    this.props.history.push("/timesheet");
  };

  return (
    <div>
      <NavBar setAuthed={prop.setAuthed}/>

      <h1 id="title">Employee Summary</h1>
      <table id="employee">
        <thead>
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
};

export default Summary;