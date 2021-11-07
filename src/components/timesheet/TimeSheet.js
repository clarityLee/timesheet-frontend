import React, { useState, useEffect } from "react";
// import axios from "axios";
import AppConext, { useAppContext } from "../../contexts/AppContext";
import NavBar from "../navbar/NavBar";
import Select from "react-select";
import './TimeSheet.css';
import Row from './Row';
import axios from "axios";

class TimeSheet extends React.Component {
  static contextType = AppConext;
  saveUrl = 'http://localhost:9000/timesheet-service/save';
  getUrl = 'http://localhost:9000/timesheet-service/read';

  constructor(props, context) {
    super(props);
    this.state = {
      billing: 0,
      compensated: 0,
      timeSheet: null,
      selectedWeekend: context.selectedWeekend,
      weekends:  context.weekends
    }
    this.loadTimeSheet = this.loadTimeSheet.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
    this.saveTimeSheet = this.saveTimeSheet.bind(this);
    this.setDefaultTimeSheet = this.setDefaultTimeSheet.bind(this);
    if (context.getDefaultTimeSheet() != null)
      this.defaultTimeSheet = context.getDefaultTimeSheet();
  }

  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  defaultTimeSheet = {
    "weekEnding": '',
    "billingHours": 45,
    "compensatedHours": 45,
    "submissionStatus": "Not Started",
    "submissionInfo": "",
    "approvalStatus": "N/A",
    "comment": "",
    "commentInfo": "",
    "dayDetails": [
      {"start": "N/A", "end": "N/A", "totalHours": 0, "floating": false, "holiday": false, "vacation": false},
      {"start": "9:00 AM", "end": "6:00 PM", "totalHours": 9, "floating": false, "holiday": false, "vacation": false},
      {"start": "9:00 AM", "end": "6:00 PM", "totalHours": 9, "floating": false, "holiday": false, "vacation": false},
      {"start": "9:00 AM", "end": "6:00 PM", "totalHours": 9, "floating": false, "holiday": false, "vacation": false},
      {"start": "9:00 AM", "end": "6:00 PM", "totalHours": 9, "floating": false, "holiday": false, "vacation": false},
      {"start": "9:00 AM", "end": "6:00 PM", "totalHours": 9, "floating": false, "holiday": false, "vacation": false},
      {"start": "N/A", "end": "N/A", "totalHours": 0, "floating": false, "holiday": false, "vacation": false}
    ]
  };
  labels = [
    '0:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', 
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];
  addData = (sheet) => {
    // console.log(sheet.weekEnding);
    let dateSplit = sheet.weekEnding.split('-');
    // console.log(dateSplit);
    let date = new Date();
    date.setFullYear(dateSplit[0]);
    date.setMonth(dateSplit[1]-1, dateSplit[2]);
    date.setHours(12);
    // console.log(date);
    // console.log(sheet);
    // let date = new Date(sheet.weekEnding);
    for (let i = 6, j=0 ; i >= 0 ; --i, ++j) {
      let d = new Date(date);
      d.setDate(d.getDate() - i);
      // console.log(d);
      let str = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + 
        (d.getDate() < 10 ? '0' : '') + d.getDate();
      // console.log(str);
      let weekday = this.weekdays[j];
      let day = sheet.dayDetails[j];
      day['date'] = str;
      day['weekday'] = weekday;
      day['floatingDisabled'] = false;
      day['vacationDisabled'] = false;
      day['startVal'] = this.labels.findIndex(element => element === day.start);
      day['savedStartVal'] = day.startVal;
      day['endVal'] = this.labels.findIndex(element => element === day.end);
      day['savedEndVal'] = day.endVal;
      day['isWeekend'] = weekday === 'Sunday' || weekday === 'Saturday' || day.holiday;
      day['optionDisabled'] = day.isWeekend || day.floating || day.holiday || day.vacation;
      day['resetOptions'] = true;
      
    }
  };
  
  loadTimeSheet = (selectedOption) => {
    const username = window.sessionStorage.getItem("username");
    const url = this.getUrl + '?username=' + username + '&weekEnding=' + selectedOption.value;
    const defaultTimeSheet = this.defaultTimeSheet;
    axios.get(url, {WithCredentials: true}).then(
      resp => {
        console.log(resp);
        let ts = resp.data;
        if (ts.id === null) {
          console.log('loading default timeSheet');
          console.log(this.defaultTimeSheet);
          ts = JSON.parse(JSON.stringify(defaultTimeSheet));
        }

        if (ts.weekEnding === '') ts.weekEnding = selectedOption.value;
        this.addData(ts);
        this.setState({timeSheet: ts, billing: ts.billingHours, compensated: ts.compensatedHours});
      },
      err => {
        console.log('get TimeSheet failed.');
      }
    );
  }

  onHourChange = (ts) => {
    if (!ts && !this.state.timeSheet) return;
    if (!ts || !ts.hasOwnProperty('dayDetails'))
      ts = this.state.timeSheet;
    let bh = 0;
    let ch = 0;
    for (let i = 1 ; i <= 5 ; ++i) {

      let day = ts.dayDetails[i];
      bh += day.totalHours;
      
      if (day.floating || day.holiday || day.vacation) ch += 8;
      else ch += day.totalHours;
    }
    ts.billingHours = bh;
    ts.compensatedHours = ch;
    this.setState({billing: bh});
    this.setState({compensated: ch});
  }

  onDayChange = (idx, day) => {
    let ts = this.state.timeSheet;
    ts.dayDetails[idx] = day;
    let bh = 0;
    let ch = 0;
    for (let i = 1 ; i <= 5 ; ++i) {

      let day = ts.dayDetails[i];
      bh += day.totalHours;
      
      if (day.floating || day.holiday || day.vacation) ch += 8;
      else ch += day.totalHours;
    }
    ts.billingHours = bh;
    ts.compensatedHours = ch;
    this.setState({billing: bh});
    this.setState({compensated: ch});
  }

  componentDidMount () {
    this.setState({selectedWeekend: this.state.selectedWeekend});
    this.setState({weekends: this.state.weekends});
    this.loadTimeSheet(this.state.selectedWeekend);
  }

  saveTimeSheet () {
    axios.post(this.saveUrl, this.state.timeSheet, {withCredentials:true}).then(
      () => console.log('save succeessed.'), 
      () => console.log('save failed.')
    );
  }

  setDefaultTimeSheet() {
    let t = this.defaultTimeSheet;
    let s = this.state.timeSheet;
    Object.assign(t, {
      billingHours: s.billingHours,
      compensatedHours: s.compensatedHours,
      dayDetails: JSON.parse(JSON.stringify((s.dayDetails)))
    })
    this.context.setDefaultTimeSheet(t);
  }
  
  render () {
    return (
      <div>
        <NavBar />
        {/* <NavBar setAuthed={this.props.setAuthed}/> */}
        <div>
          <div className="top">
            <div className="top-item weekend">
              <span>Week Ending</span>
              <Select className="top-item options" 
                values={this.state.selectedWeekend} 
                options={this.state.weekends} 
                defaultValue={this.state.selectedWeekend} 
                onChange={this.loadTimeSheet}
              />
            </div>
            <div className="top-item billing">
              <span>Total Billing Hours</span>
              <input type="text" disabled value={this.state.billing} />
            </div>
            <div className="top-item compensated">
              <span>Total Compensated Hours</span>
              <input type="text" disabled value={this.state.compensated} />
            </div>
          </div>
          <button onClick={this.setDefaultTimeSheet}>Set Default</button>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Starting Time</th>
                  <th>Ending Time</th>
                  <th>Total hours</th>
                  <th>Floating Day</th>
                  <th>Holiday</th>
                  <th>Vacation</th>
                </tr>
              </thead>
              <tbody>
                {/* {this.state.timeSheet && <Details timeSheet={this.state.timeSheet} onHourChange={this.onHourChange}/>} */}
                {this.state.timeSheet && this.state.timeSheet.dayDetails.map((item, idx) => (
                  <Row key={idx} index={idx} day={item} onDayChange={this.onDayChange} />
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <button>update time sheet</button>
            <button>Choose File</button>
            <button onClick={this.saveTimeSheet}>Save</button>
          </div>
        </div>
      </div>
    );
  }
};

export default TimeSheet;