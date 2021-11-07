import React from "react";
import NavBar from "../navbar/NavBar";
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css'

// import { Button, Container, Row } from 'react-bootstrap';

// const Profile = () => {
//   return (
//     <div>
//         <NavBar />
//         <div>
//             Profile
//         </div>
//     </div>
//   );
// };

class Profile extends React.Component {

    changed = new Map()

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            phone: "",
            email: "",
            address: "",
            emergencyContact: [
                {
                    fullName: "",
                    phone: ""
                },
                {
                    fullName: "",
                    phone: ""
                }
            ]
        }
        this.changed.set("phone", false);
        this.changed.set("email", false);
        this.changed.set("address", false);
        this.setAuthed = props.setAuthed;
  }

    componentDidMount() {
        axios.get(`http://localhost:9000/user-service/user-profile`, {withCredentials:true})
            .then( response => {
                const data = response.data;
                console.log(data)
                this.setState({
                    username: data.username,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                })
                if (data.contacts) {
                    this.setState({ emergencyContact: data.contacts });
                }
            } )
    }

    handleInputChange = (event) => {
        const name = event.target.name;
        this.changed.set(name, true);
        this.setState({ 
            [name]: event.target.value
        });
    }

    // send http request to backend user service
    updateInfo = () => {

        const updatedInfo = {
        }

        for (let [key, value] of this.changed.entries()) {
            if (value === true) {
                updatedInfo[key] = this.state[key];
            }
        }

        console.log(updatedInfo);
        if (Object.keys(updatedInfo).length === 0) {
            return;
        }

        axios.post(`http://localhost:9000/user-service/update-profile`, updatedInfo, {withCredentials:true})
            .then(
              (resp) => { response => response.json() }
            ).then(
                data => console.log(data)
            )
    }

  render() {
      return (
          <div>
          <NavBar setAuthed={this.setAuthed}/>
          <br />
            <div className="container">
                <div className="row text-center" >
                        <div>
                            <div>
                                <h5>Contact</h5>
                            </div>
                            <div className="input">
                                <input 
                                    type="text" 
                                    name="phone" 
                                    placeholder="phone" 
                                    defaultValue={this.state.phone} 
                                    style={{width: "358px"}}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                            <div className="input">
                                <input 
                                    type="text" 
                                    name="email" 
                                    placeholder="email"
                                    defaultValue={this.state.email} 
                                    style={{width: "358px"}}
                                    onChange={this.handleInputChange}/>
                            </div>
                            <div>
                                <textarea 
                                    rows="3"
                                    style={{width: "358px"}}
                                    name="address" 
                                    placeholder="address"
                                    defaultValue={this.state.address}
                                    onChange={this.handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <h5>Emergency Contact 1</h5>
                                </div>
                                <div className="input">
                                    <input type="text" name="name" value={this.state.emergencyContact[0].fullName} style={{width: "358px"}} disabled={true} />
                                </div>
                                <div className="input">
                                    <input type="text" name="phone" value={this.state.emergencyContact[0].phone} style={{width: "358px"}} disabled={true} />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h5>Emergency Contact 2</h5>
                                </div>
                                <div className="input">
                                    <input type="text" name="name" value={this.state.emergencyContact[1].fullName} style={{width: "358px"}} disabled={true} />
                                </div>
                                <div className="input">
                                    <input type="text" name="phone" value={this.state.emergencyContact[1].phone} style={{width: "358px"}} disabled={true} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={this.updateInfo}>Update</button>
                        </div>
                </div>
            </div>
          </div>
      );
    }
}

export default Profile;