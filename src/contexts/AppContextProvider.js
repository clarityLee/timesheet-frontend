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

    let defaultWeekends = [];
    while(defaultWeekends.length < 8) {
      let dd = curr.getDate();
      if (dd < 10) dd = '0' + dd.toString();
      let mm = curr.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      defaultWeekends.push({
        value: curr.getFullYear() + '-' + mm + '-' + dd,
        label: curr.toLocaleDateString("en-US", {day: 'numeric', month: 'short', year: 'numeric'})
      });
      curr.setDate(curr.getDate() - 7);
    }
    // console.log('default weekends:');
    // console.log(defaultWeekends);

    this.selectedWeekend = defaultWeekends[0];
    this.defaultWeekends = defaultWeekends;
    this.currentWeekendOption = defaultWeekends[0];
  }

  getCurrentWeekendStr = () => {
    let today = new Date();
    let weekendDate = new Date();
    weekendDate.setDate(today.getDate() + (6 - today.getDay()));
    let dd = weekendDate.getDate();
    if (dd < 10) dd = '0' + dd.toString();
    return weekendDate.getFullYear() + '-' + (weekendDate.getMonth() + 1) + '-' + dd;
  }

  currentWeekendOption = null;
  getCurrentWeekendOption = () => {
    return this.currentWeekendOption;
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
  defaultWeekends = [];
  getDefaultWeekends = () => {
    return this.defaultWeekends;
  };
  setDefaultWeekends = (defaultWeekends) => {
    this.defaultWeekends = defaultWeekends;
  };

  isAuthed = window.sessionStorage.getItem("username") != null;

  getIsAuthed = () => {
    return this.isAuthed;
  };

  login = (username, password, onSuccess, onFail) => {
    let data = {'username': username, 'password': password};
    axios.post(`http://localhost:9000/auth/login`, data, {withCredentials:true})
    .then(
      (resp) => {
        this.isAuthed = true;
        window.sessionStorage.setItem("username", username);
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
          getDefaultWeekends: this.getDefaultWeekends,
          setDefaultWeekends: this.setDefaultWeekends,
          getCurrentWeekendStr: this.getCurrentWeekendStr,
          getCurrentWeekendOption: this.getCurrentWeekendOption
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;