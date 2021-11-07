import React from 'react';
import AppContext from './AppContext';
import axios from 'axios';

class AppContextProvider extends React.Component {
  
  constructor(props) {
    super(props);

    let today = new Date();
    let weekend = new Date();
    weekend.setDate(today.getDate() + (6 - today.getDay()));
    let offset = weekend.getTimezoneOffset();
    let curr = weekend;

    let weekends = [];
    while(weekends.length < 5) {
      weekends.push({
        value: (new Date(curr.getTime() - (offset*60*1000))).toISOString().split('T')[0], 
        label: curr.toLocaleDateString("en-US", {day: 'numeric', month: 'short', year: 'numeric'})
      });
      curr.setDate(curr.getDate() - 7);
    }

    this.selectedWeekend = weekends[0];
    this.weekends = weekends;
  }

  selectedWeekend = '';
  setSelectedWeekends = (selected) => {
    this.selectedWeekend = selected;
  };
  weekends = [];
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
          selectedWeekend: this.selectedWeekend,
          setSelectedWeekends: this.setSelectedWeekends,
          weekends: this.weekends,
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