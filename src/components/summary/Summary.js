import React, { useState, useEffect } from "react";
import NavBar from "../navbar/NavBar";

import axios from "axios";
import { Link } from "react-router-dom";
import "./Summary.css";
import ReactTooltip from "react-tooltip";
const URL = "http://localhost:9000/user-service/user"; //endpoint to get data

const Summary = (prop) => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await axios.get(URL, { withCredentials: true });

    setData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const renderHeader = () => {
    let headerElement = [
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
    console.log(data.timeSheets);

    return (
      data.timeSheets &&
      data.timeSheets.map(
        ({
          id,
          weekEnding,
          billingHouse,
          submissionStatus,
          approvalStatus,
          comment,
        }) => {
          console.log(data.timeSheets.approvalStatus);
          return (
            <tr key={id}>
              <td>{weekEnding}</td>
              <td>{billingHouse}</td>
              <td>
                {submissionStatus != "incomplete" ? (
                  <p>{submissionStatus}</p>
                ) : (
                  <p>
                    {submissionStatus}
                    <img
                      src="https://www.pngitem.com/pimgs/m/517-5177855_info-icon-svg-hd-png-download.png"
                      width="25"
                      height="20"
                      data-tip
                      data-for="submissionTip"
                    />
                    <ReactTooltip id="submissionTip" place="top" effect="solid">
                      Proof of approved time sheet is required OR Approval
                      denied by Admin, please contact your HR manager
                    </ReactTooltip>
                  </p>
                )}
              </td>
              <td>{approvalStatus}</td>
              <td className="option">
                {approvalStatus == "approved" ? (
                  <Link to="/timesheet" className="navItem">
                    edit
                  </Link>
                ) : (
                  <Link to="/timesheet" className="navItem">
                    view
                  </Link>
                )}
              </td>
              <td>
                {comment == "" ? (
                  <p>{comment}</p>
                ) : (
                  <p>
                    {comment}
                    <img
                      src="https://www.pngitem.com/pimgs/m/517-5177855_info-icon-svg-hd-png-download.png"
                      width="25"
                      height="20"
                      data-tip
                      data-for="commentTip"
                    />
                    <ReactTooltip id="commentTip" place="top" effect="solid">
                      remaining floating/vacation days: 2
                    </ReactTooltip>
                  </p>
                )}
              </td>
            </tr>
          );
        }
      )
    );
  };

  return (
    <div>
      <NavBar setAuthed={prop.setAuthed} />

      <h1 id="title">Employee Summary</h1>
      <table class="table" id="employee">
        <thead>
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
};

export default Summary;
