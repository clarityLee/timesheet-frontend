import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import { useAppContext } from "../../contexts/AppContext";

import axios from "axios";
import { Link } from "react-router-dom";
import "./Summary.css";
import ReactTooltip from "react-tooltip";
const URL = "http://localhost:9000/user-service/user"; //endpoint to get data
const ALLURL = "http://localhost:9000/timesheet-service/getAllList";

const Summary = (prop) => {
  const context = useAppContext();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [check, setCheck] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const getData = async () => {
    const response = await axios.get(URL, { withCredentials: true });

    setData(response.data);
  };

  const getAll = async () => {
    const response = await axios.get(ALLURL, { withCredentials: true });

    setData2(response.data);
  };

  useEffect(() => {
    getData();
    getAll();

    hasCurrent();
  }, []);

  const hasCurrent = () => {
    setCheck(false);
  };

  const renderCurrent = () => {
    return (
      <tr>
        <td>{context.getCurrentWeekendStr()}</td>
        <td>N/A</td>
        <td>Not Started</td>
        <td>N/A</td>
        <td>
          <Link to="/timesheet" className="navItem">
            edit
          </Link>
        </td>
        <td></td>
      </tr>
    );
  };

  const renderHeader = () => {
    console.log(data.username);
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

  const gotoTimeSheet = (e) => {
    e.preventDefault();
    context.setSelectedWeekendStr(e.target.attributes.weekending.value);
    navigate("/timesheet");
  };

  const renderBody = () => {
    console.log(data.timeSheets);
    console.log(data);
    console.log(context.getCurrentWeekendStr());

    return (
      data.timeSheets &&
      data.timeSheets.map(
        ({
          id,
          weekEnding,
          billingHours,
          submissionStatus,
          approvalStatus,
          comment,
          floating,
          vacation,
        }) => {
          return (
            <tr key={id}>
              <td>{weekEnding}</td>
              <td>{billingHours}</td>
              <td>
                {submissionStatus != "Incomplete" ? (
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
                {approvalStatus == "Not Approved" ? (
                  <Link to="/timesheet" className="navItem">
                    edit
                  </Link>
                ) : (
                  <a
                    href=""
                    className="navItem"
                    onClick={gotoTimeSheet}
                    weekending={weekEnding}
                  >
                    view
                  </a>
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
                      remaining floating/vacation days: {data.floating}
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

  const changeCheck = () => {
    console.log(check);
    setCheck(true);
    console.log(check);
  };
  const renderBodyAll = () => {
    console.log(data2);
    console.log(check);
    console.log(context.getCurrentWeekendStr());

    return (
      data2 &&
      data2.map(
        ({
          id,
          weekEnding,
          billingHours,
          submissionStatus,
          approvalStatus,
          comment,
          floating,
          vacation,
        }) => {
          console.log(data.timeSheets.approvalStatus);
          return (
            <tr key={id}>
              <td>{weekEnding}</td>
              <td>{billingHours}</td>
              <td>
                {submissionStatus != "Incomplete" ? (
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
                {approvalStatus == "Not Approved" ? (
                  <Link to="/timesheet" className="navItem">
                    edit
                  </Link>
                ) : (
                  <a
                    href=""
                    className="navItem"
                    onClick={gotoTimeSheet}
                    weekending={weekEnding}
                  >
                    view
                  </a>
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
                      remaining floating/vacation days: {data.floating}
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
      {showMore == false ? (
        <table className="table" id="employee">
          <thead>
            <tr>{renderHeader()}</tr>
          </thead>
          {check ? (
            <tbody>{renderBody()}</tbody>
          ) : (
            <tbody>
              {renderCurrent()}, {renderBody()}
            </tbody>
          )}
        </table>
      ) : (
        <table className="table" id="employee">
          <thead>
            <tr>{renderHeader()}</tr>
          </thead>
          {check ? (
            <tbody>{renderBodyAll()}</tbody>
          ) : (
            <tbody>
              {renderCurrent()}, {renderBodyAll()}
            </tbody>
          )}
        </table>
      )}
      ,
      {showMore == false ? (
        <button className="btn" onClick={() => setShowMore(!showMore)}>
          Show more
        </button>
      ) : (
        <button className="btn" onClick={() => setShowMore(!showMore)}>
          Show Less
        </button>
      )}
    </div>
  );
};

export default Summary;
