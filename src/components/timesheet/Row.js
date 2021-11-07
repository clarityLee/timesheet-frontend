import React, { useState, useEffect } from "react";
import Select from "react-select";

const Row = (prop) => {
  const day = prop.day;
  const [optionDisabled, setOptionDisabled] = useState(day.optionDisabled);
  const [floatingDisabled, setFloatingDiabled] = useState(day.isWeekend);
  const [vacationDisabled, setVacationDiabled] = useState(day.isWeekend);
  const [startOptionVal, setStartOptionVal] = useState(null);
  const [endOptionVal, setEndOptionVal] = useState(null);
  
  const options = [];
  const labels = [
    '0:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', 
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];
  const notAvailable = {value: 'N/A', label: 'N/A'};
  const [totalHour, setTotalHour] = useState(day.totalHours);

  if (day.isWeekend) {
    options.push(notAvailable);
  } else {
    labels.forEach((time, index) => options.push({value: index, label: time}));
  }
  
  const clickFloating = () => {
    if (day.holiday || day.vacation || day.isWeekend) return;
    day.totalHours = day.floating ? day.endVal - day.startVal : 0;
    day.floating = !day.floating;
    setTotalHour(day.totalHours);
    setOptionDisabled(day.floating);
    setVacationDiabled(day.floating);
    prop.onDayChange(prop.index, day);
  };
  const clickHoliday = () => {};
  const clickVacation = () => {
    if (day.floating || day.holiday || day.isWeekend) return;
    day.totalHours = day.vacation ? day.endVal - day.startVal : 0;
    day.vacation = !day.vacation;
    setTotalHour(day.totalHours);
    setOptionDisabled(day.vacation);
    setFloatingDiabled(day.vacation);
    prop.onDayChange(prop.index, day);
  };
  const handleStartChange = e => {
    day.start = e.label;
    day.startVal = e.value;
    day.startOptionVal = {value: day.startVal, label: day.start};
    day.totalHours = day.endVal - day.startVal;
    setTotalHour(day.totalHours);
    setStartOptionVal(day.startOptionVal);
    prop.onDayChange(prop.index, day);
  };
  const handleEndChange = e => {
    day.end = e.label;
    day.endVal = e.value;
    day.endOptionVal = {value: day.endVal, label: day.end};
    day.totalHours = day.endVal - day.startVal;
    setTotalHour(day.totalHours);
    setEndOptionVal(day.startOptionVal);
    prop.onDayChange(prop.index, day);
  }
  useEffect(() => {
    if (day.resetOptions) {
      day.resetOptions = false;
      setStartOptionVal({value: day.startVal, label: day.start});
      setEndOptionVal({value: day.endVal, label: day.end});
      setTotalHour(day.totalHours);
      setOptionDisabled(day.optionDisabled);
    }
  });

  return (
    <tr>
      <td>{day.weekday}</td>
      <td>{day.date}</td>
      <td>
        {!optionDisabled && !prop.day.isWeekend
          ? <Select 
              options={options} 
              onChange={handleStartChange}
              value={startOptionVal} 
              isDisabled={prop.day.isWeekend}/>
          : <div>N/A</div>
        }
        {/* {optionDisabled || disabled && <div>N/A</div>} */}
      </td>
      <td>
        {!optionDisabled && !prop.day.isWeekend
          ? <Select 
              options={options} 
              onChange={handleEndChange}
              value={endOptionVal}
              isDisabled={prop.day.isWeekend}/>
          : <div>N/A</div>
        }
      </td>
      <td>{totalHour}</td>
      <td><input type="checkbox" 
            checked={day.floating} 
            onChange={clickFloating} 
            disabled={floatingDisabled}/>
      </td>
      <td>
        <input type="checkbox" 
          checked={day.holiday} 
          onChange={clickHoliday} 
          disabled={true}/>
      </td>
      <td>
        <input type="checkbox" 
          checked={day.vacation} 
          onChange={clickVacation} 
          disabled={vacationDisabled}/>
      </td>
    </tr>
  );
}

export default Row;