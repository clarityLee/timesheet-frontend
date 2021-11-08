import React from 'react';
import axios from 'axios';
import AppContext from '../../contexts/AppContext';
import Select from 'react-select';
import NavBar from '../navbar/NavBar';
import Row from './Row';
import isHoliday from './holidays';
import { getDefaultTimesheet, setDefaultTimesheet } from "./TimeSheetModel";
import './TimeSheet.css';

class TimeSheet extends React.Component {
  static contextType = AppContext;
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
    }
    this.loadTimeSheet = this.fetchTimeSheet.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
    this.saveTimeSheet = this.saveTimeSheet.bind(this);
    this.setDefault = this.setDefault.bind(this);
  }
  btnSaved = '';
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
    // let dateSplit = sheet.weekEnding.split('-');
    // let date = new Date();
    // date.setFullYear(parseInt(dateSplit[0]));
    // date.setMonth(dateSplit[1]-1, parseInt(dateSplit[2]));
    // date.setHours(12);
    let date = this.convertToDate(sheet.weekEnding);
    for (let i = 6, j=0 ; i >= 0 ; --i, ++j) {

      let d = new Date(date);
      d.setDate(d.getDate() - i);
      let str = d.getFullYear() + '-' + (d.getMonth()+1) + '-' +
        (d.getDate() < 10 ? '0' : '') + d.getDate();
      console.log('adding data to i: ' + i + ', str: ' + str);
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
  
  fetchTimeSheet = (selectedOption) => {
    const username = window.sessionStorage.getItem('username');
    const url = this.getUrl + '?username=' + username + '&weekEnding=' + selectedOption.value;

    axios.get(url, { withCredentials: true }).then(
      resp => {
        let ts = resp.data;
        if (ts.id === null) ts = getDefaultTimesheet();

        if (ts.weekEnding === '') ts.weekEnding = selectedOption.value;
        this.setState({btnSaved: false});
        this.addData(ts);
        this.setState({timeSheet: ts, billing: ts.billingHours, compensated: ts.compensatedHours});
      },
      err => {
        console.log('get TimeSheet failed.');
        console.log(err);
      }
    );
  }

  convertToDate = dateStr => {
    let dateSplit = dateStr.split('-');
    let date = new Date();
    date.setFullYear(parseInt(dateSplit[0]));
    date.setMonth(dateSplit[1]-1, parseInt(dateSplit[2]));
    date.setHours(12);
    return date;
  };

  fetchTimeSheets = () => {
    const username = window.sessionStorage.getItem('username');
    axios.get(this.getAllList, { withCredentials: true}).then(
        resp => {
          let sheets = resp.data;
          let weekends = [];
          let thisWeekend = this.context.getCurrentWeekendOption();
          if (thisWeekend.value !== sheets[0].weekEnding) weekends.push(thisWeekend);
          console.log(thisWeekend);
          console.log(sheets[0].weekEnding);
          resp.data.forEach((sheet, idx) => {
            let date = this.convertToDate(sheet.weekEnding);
            weekends.push({
              value: sheet.weekEnding,
              label: date.toLocaleDateString("en-US", {day: 'numeric', month: 'short', year: 'numeric'})
            });
          });
          console.log(weekends);
          this.setState({weekends: weekends});
        },
        err => console.log(err)
    );
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
    this.fetchTimeSheet(this.state.selectedWeekend);
    this.fetchTimeSheets();
  }

  saveTimeSheet () {
    const setBtnSaved = this.setBtnSaved;
    const selectedFile = this.state.selectedFile;
    const saveFileUrl = this.saveFileUrl;
    const setState = this.setState;

    const formData = new FormData();
    if (selectedFile) {
      formData.append(
          'file', this.state.selectedFile, this.state.selectedFile.name);
      formData.append('weekEnding', this.state.timeSheet.weekEnding);
      formData.append('uploadType', this.uploadOption);
    }
    console.log(this.state.timeSheet.weekEnding);

    // 1. save timeSheet first
    this.state.timeSheet.uploadType = this.uploadOption;
    axios.post(this.saveUrl, this.state.timeSheet, {withCredentials: true}).then(
        resp => {
          console.log('save timeSheet succeed.');
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

  setBtnSaved() {
    this.setState({btnSaved: true});
    this.setState({selectedFile: null});
  }

  setDefault() {
    setDefaultTimesheet(this.state.timeSheet);
  }

  setUpload = e => {
    this.uploadOption = e.value;
    console.log('uploadOption: ' + this.uploadOption);
  }

  onFileChange = e => {
    this.setState({ selectedFile: e.target.files[0] });
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
                onChange={this.fetchTimeSheet}
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
          <button onClick={this.setDefault}>Set Default</button>
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
                {this.state.timeSheet && this.state.timeSheet.dayDetails.map((item, idx) => (
                  <Row key={idx} index={idx} day={item} onDayChange={this.onDayChange} />
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <Select className="selectUpload bottom-item"
                defaultValue = {this.uploadOptions[0]}
                options={this.uploadOptions}
                onChange={this.setUpload}
            />
            <input type="file" className="bottom-item" onChange={this.onFileChange} />
            <button
                className={`btnSave bottom-item ${this.state.btnSaved ? 'saved' : 'notSaved'}`}
                onClick={this.saveTimeSheet} >Save</button>
          </div>
        </div>
      </div>
    );
  }
}

export default TimeSheet;