import React from 'react';
import AppContext from './AppContext';
import axios from 'axios';

class AppContextProvider extends React.Component {
  
  constructor(props) {
    super(props);

    let today = new Date();
    let weekend = new Date();
    weekend.setDate(today.getDate() + (6 - today.getDay()));
    let curr = weekend;

    let weekends = [];
    while(weekends.length < 5) {
      let dd = curr.getDate();
      if (dd < 10) dd = '0' + dd.toString();
      weekends.push({
        value: curr.getFullYear() + '-' + (curr.getMonth() + 1) + '-' + dd,
        label: curr.toLocaleDateString("en-US", {day: 'numeric', month: 'short', year: 'numeric'})
      });
      curr.setDate(curr.getDate() - 7);
    }

    this.selectedWeekend = weekends[0];
    this.weekends = weekends;
  }

  selectedWeekend = '';
  getSelectedWeekend = () => {
    return this.selectedWeekend;
  }
  setSelectedWeekend = (selected) => {
    this.selectedWeekend = selected;
  };
  setSelectedWeekendStr = (str) => {
    let splitDate = str.split('-');
    let date = new Date();
    date.setFullYear(splitDate[0]);
    date.setMonth(splitDate[1]-1, splitDate[2]);
    date.setHours(12);
    this.selectedWeekend = {
      value: str,
      label: date.toLocaleDateString("en-US", {day: 'numeric', month: 'short', year: 'numeric'})};
  }
  weekends = [];
  getWeekends = () => {
    return this.weekends;
  };
  setWeekends = (weekends) => {
    this.weekends = weekends;
  };

  isAuthed = window.sessionStorage.getItem("username") != null;

  getIsAuthed = () => {
    return this.isAuthed;
  };

  defaultTimeSheet = null;
  getDefaultTimeSheet = () => {
      return this.defaultTimeSheet;
  }
  setDefaultTimeSheet= (timeSheet) => {
      this.defaultTimeSheet = timeSheet;
  }

  login = (username, password, onSuccess, onFail) => {
    let data = {'username': username, 'password': password};
    axios.post(`http://localhost:9000/auth/login`, data, {withCredentials:true})
    .then(
      (resp) => {
        this.isAuthed = true;
        window.sessionStorage.setItem("username", username);
        console.log("login success");
        onSuccess();
      }, 
      (error) => {
        console.log("login failes");
        onFail();
      }
    )
  };

  logout = () => {
    window.sessionStorage.removeItem("username");
    this.isAuthed = false;
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          isAuthed: this.getIsAuthed,
          login: this.login,
          logout: this.logout,
          getSelectedWeekend: this.getSelectedWeekend,
          setSelectedWeekend: this.setSelectedWeekend,
          setSelectedWeekendStr: this.setSelectedWeekendStr,
          getWeekends: this.getWeekends,
          setWeekends: this.setWeekends,
          getDefaultTimeSheet: this.getDefaultTimeSheet,
          setDefaultTimeSheet: this.setDefaultTimeSheet
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;