
const defaultTimeSheet = {
  'weekEnding': '',
  'billingHours': 45,
  'compensatedHours': 45,
  'submissionStatus': 'Not Started',
  'submissionInfo': '',
  'approvalStatus': 'N/A',
  'comment': '',
  'commentInfo': '',
  'dayDetails': [
    {'start': 'N/A', 'end': 'N/A', 'totalHours': 0, 'floating': false, 'holiday': false, 'vacation': false},
    {'start': '9:00 AM', 'end': '6:00 PM', 'totalHours': 9, 'floating': false, 'holiday': false, 'vacation': false},
    {'start': '9:00 AM', 'end': '6:00 PM', 'totalHours': 9, 'floating': false, 'holiday': false, 'vacation': false},
    {'start': '9:00 AM', 'end': '6:00 PM', 'totalHours': 9, 'floating': false, 'holiday': false, 'vacation': false},
    {'start': '9:00 AM', 'end': '6:00 PM', 'totalHours': 9, 'floating': false, 'holiday': false, 'vacation': false},
    {'start': '9:00 AM', 'end': '6:00 PM', 'totalHours': 9, 'floating': false, 'holiday': false, 'vacation': false},
    {'start': 'N/A', 'end': 'N/A', 'totalHours': 0, 'floating': false, 'holiday': false, 'vacation': false}
  ]
};

const getDefaultTimesheet = () => {
  return JSON.parse(JSON.stringify(defaultTimeSheet));
}

const setDefaultTimesheet = ts => {
  defaultTimeSheet.billingHours = ts.billingHours;
  defaultTimeSheet.compensatedHours = ts.compensatedHours;
  defaultTimeSheet.dayDetails = JSON.parse(JSON.stringify((ts.dayDetails)))
}

export { getDefaultTimesheet, setDefaultTimesheet };