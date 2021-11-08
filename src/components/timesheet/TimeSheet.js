import React from 'react';
import axios from 'axios';
import AppContext from '../../contexts/AppContext';
import Select from 'react-select';
import NavBar from '../navbar/NavBar';
import Row from './Row';
import isHoliday from './holidays';
import {getDefaultTimesheet, setDefaultTimesheet} from "./TimeSheetModel";
import './TimeSheet.css';

class TimeSheet extends React.Component {
  static contextType = AppContext;
  userUrl = 'http://localhost:9000/user-service/user';
  saveUrl = 'http://localhost:9000/timesheet-service/save';
  saveFileUrl = 'http://localhost:9000/timesheet-service/saveFile'
  getUrl = 'http://localhost:9000/timesheet-service/read';
  getAllList = 'http://localhost:9000/timesheet-service/getAllList'

  constructor(props, context) {
    super(props);
    this.state = {
      billing: 0,
      compensated: 0,
      timeSheet: null,
      selectedWeekend: context.getSelectedWeekend(),
      weekends:  [],
      selectedFile: null,
      btnSaved: false,
      floatingLeft: 0,
      vacationLeft: 0
    }
    this.loadTimeSheet = this.fetchTimeSheet.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
    this.saveTimeSheet = this.saveTimeSheet.bind(this);
    this.setDefault = this.setDefault.bind(this);
    this.saveTimeSheet = this.saveTimeSheet.bind(this);
    this.fetchTimeSheet = this.fetchTimeSheet.bind(this);
  }
  user = {floating: 0, vacation: 0};

  componentDidMount () {
    this.fetchUserData();
    this.fetchTimeSheet(this.state.selectedWeekend);
    this.fetchTimeSheets();
  }

  btnSaved = '';
  floatingRequired = 0;
  vacationRequired = 0;
  maxFloating = 0;
  maxVacation = 0;
  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  labels = [
    '0:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', 
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];
  uploadOption = 'approved';
  uploadOptions = [
    {value: 'approved', label: 'Approved Timesheet'},
    {value: 'unapproved', label: 'Unapproved Timesheet'}
  ];
  addData = (sheet) => {
    let date = this.convertToDate(sheet.weekEnding);
    for (let i = 6, j=0 ; i >= 0 ; --i, ++j) {

      let d = new Date(date);
      d.setDate(d.getDate() - i);
      let str = d.getFullYear() + '-' + (d.getMonth()+1) + '-' +
        (d.getDate() < 10 ? '0' : '') + d.getDate();
      let weekday = this.weekdays[j];
      let day = sheet.dayDetails[j];
      if (isHoliday(str)) {
        day['holiday'] = true;
        day.totalHours = 0;
      }

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

  fetchUserData = () => {
    axios.get(this.userUrl, { withCredentials: true}).then(
        resp => {
          this.user = resp.data;
          this.maxFloating = this.user.floating + this.floatingRequired;
          this.maxVacation = this.user.vacation + this.vacationRequired;
          this.setState({
            floatingLeft: this.maxFloating - this.floatingRequired,
            vacationLeft: this.maxVacation - this.vacationRequired
          });
        },
        err => console.log(err)
    );
  }

  fetchTimeSheet = (selectedOption) => {
    const username = window.sessionStorage.getItem('username');
    const url = this.getUrl + '?username=' + username + '&weekEnding=' + selectedOption.value;

    axios.get(url, { withCredentials: true }).then(
      resp => {
        let ts = resp.data;
        if (ts.id === null) {
          ts = getDefaultTimesheet();
        }

        if (ts.weekEnding === '') ts.weekEnding = selectedOption.value;
        this.setState({btnSaved: false});
        this.addData(ts);

        this.floatingRequired = ts.floatingRequired;
        this.vacationRequired = ts.vacationRequired;
        this.maxFloating = this.user.floating + this.floatingRequired;
        this.maxVacation = this.user.vacation + this.vacationRequired;

        this.setState({
          timeSheet: ts,
          billing: ts.billingHours,
          compensated: ts.compensatedHours,
          floatingLeft: this.maxFloating - this.floatingRequired,
          vacationLeft: this.maxVacation - this.vacationRequired
        });
        this.fetchUserData();
      },
      err => {
        console.log('get TimeSheet failed.');
        console.log(err);
      }
    );
  }

  fetchTimeSheets = () => {
    axios.get(this.getAllList, { withCredentials: true}).then(
        resp => {
          let sheets = resp.data;
          let weekends = [];
          let thisWeekend = this.context.getCurrentWeekendOption();
          if (sheets.length === 0 || thisWeekend.value !== sheets[0].weekEnding) weekends.push(thisWeekend);
          resp.data.forEach((sheet, idx) => {
            let date = this.convertToDate(sheet.weekEnding);
            weekends.push({
              value: sheet.weekEnding,
              label: date.toLocaleDateString("en-US", {day: 'numeric', month: 'short', year: 'numeric'})
            });
          });
          this.setState({weekends: weekends});
        },
        err => console.log(err)
    );
    // this.setState({weekends: this.context.getDefaultWeekends()});
  }

  convertToDate = dateStr => {
    let dateSplit = dateStr.split('-');
    let date = new Date();
    date.setFullYear(parseInt(dateSplit[0], 10));
    date.setMonth(dateSplit[1]-1, parseInt(dateSplit[2], 10));
    date.setHours(12);
    return date;
  };
  onDayChange = (idx, day, callback) => {
    let ts = this.state.timeSheet;
    // ts.dayDetails[idx] = day;
    let bh = 0;
    let ch = 0;
    let floatingRequired = 0, vacationRequired = 0;
    for (let i = 1 ; i <= 5 ; ++i) {

      let day = ts.dayDetails[i];
      bh += day.totalHours;

      if (day.floating || day.holiday || day.vacation) ch += 8;
      else ch += day.totalHours;

      if (day.floating) ++floatingRequired;
      if (day.vacation) ++vacationRequired;
    }
    ts.billingHours = bh;
    ts.compensatedHours = ch;
    this.floatingRequired = floatingRequired;
    this.vacationRequired = vacationRequired;

    this.setState({
      billing: bh,
      compensated: ch,
      floatingLeft: this.maxFloating - this.floatingRequired,
      vacationLeft: this.maxVacation - this.vacationRequired
    });
  }

  saveTimeSheet () {
    const selectedFile = this.state.selectedFile;
    const saveFileUrl = this.saveFileUrl;
    const timeSheet = this.state.timeSheet;
    timeSheet.floatingRequired = this.floatingRequired;
    timeSheet.vacationRequired = this.vacationRequired;
    let comment = '';
    if (this.floatingRequired > 0) comment = this.floatingRequired + ' Floating day required';
    if (this.vacationRequired > 0) {
      if (comment.length > 0) comment += '\n';
      comment += this.vacationRequired + ' Vacation day required';
    }
    timeSheet.comment = comment;

    const formData = new FormData();
    if (selectedFile) {
      formData.append(
          'file', this.state.selectedFile, this.state.selectedFile.name);
      formData.append('weekEnding', this.state.timeSheet.weekEnding);
      formData.append('uploadType', this.uploadOption);
    }

    // 1. save timeSheet first
    axios.post(this.saveUrl, this.state.timeSheet, {withCredentials: true}).then(
        resp => {

          this.user.floating = this.state.floatingLeft;
          this.user.vacation = this.state.vacationLeft;

          // 2.1 no need to save file
          if (!selectedFile) {
            // setBtnSaved();
            this.setState({btnSaved: true});
            this.setState({selectedFile: null});
            return;
          }
          // 2.2 need to save file
          axios.post(saveFileUrl, formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(
              resp => {
                // setBtnSaved();
                this.setState({btnSaved: true});
                this.setState({selectedFile: null});
              },
              err => {
                // save file failed
                console.log(err);
                console.log('save timeSheet without file failed.');
              }
          );
        },
        err => {
          // save timesheet failed
          console.log(err);
          console.log('save file for timeSheet failed.');
        }
    );
  }

  setDefault() {
    setDefaultTimesheet(this.state.timeSheet);
  }

  setUpload = e => {
    this.uploadOption = e.value;
  }

  onFileChange = e => {
    this.setState({ selectedFile: e.target.files[0] });
  }

  render () {
    return (
      <div>
        <NavBar />
        {/* <NavBar setAuthed={this.props.setAuthed}/> */}
        <div className="container">
          <div className="top row">
            <div className="d-flex justify-content-between">
              <div className="top-item weekend">
                <span style={{fontWeight: "bold"}}>Week Ending </span>
                <Select className="top-item options" 
                  values={this.state.selectedWeekend} 
                  options={this.state.weekends} 
                  defaultValue={this.state.selectedWeekend} 
                  onChange={this.fetchTimeSheet}
                />
              </div>
              <div className="top-item billing">
                <span style={{fontWeight: "bold"}}>Total Billing Hours </span>
                <input type="text" disabled value={this.state.billing} />
              </div>
              <div className="top-item compensated">
                <span style={{fontWeight: "bold"}}>Total Compensated Hours </span>
                <input type="text" disabled value={this.state.compensated} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="d-flex flex-row-reverse">
              <button className="btn btn-outline-primary btn-lg align-self-center" onClick={this.setDefault}>Set Default</button>
            </div>
          </div>
          <div className="row">
            <table className="table">
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
                {this.state.timeSheet && this.state.timeSheet.dayDetails.map((item, idx) => (
                  <Row key={idx} index={idx} day={item} onDayChange={this.onDayChange}
                       floatingLeft={this.state.floatingLeft} vacationLeft={this.state.vacationLeft}
                       approvalStatus={this.state.timeSheet.approvalStatus}   />
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <Select className="selectUpload bottom-item"
                  defaultValue={this.uploadOptions[0]}
                  options={this.uploadOptions}
                  onChange={this.setUpload}
              />
              <input type="file" className="bottom-item" onChange={this.onFileChange} />
            </div>
            <div>
              <button
                  // className={`btnSave bottom-item ${this.state.btnSaved ? 'saved' : 'notSaved'}`}
                  className={`btn bottom-item btn-lg ${this.state.btnSaved ? 'btn-success' : 'btn-outline-primary'}`}
                  onClick={this.saveTimeSheet} >Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TimeSheet;