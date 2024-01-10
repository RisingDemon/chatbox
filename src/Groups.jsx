import { Component } from "react";
import "./Groups.css";
import { db } from "./Config";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";

export default class Groups extends Component {
  state = {
    userName: "",
    userGroups: [],
  };

  fetchUserName = () => {
    this.setState({ userName: this.props.dataFromParent });
    console.log("data from app: ", this.props.dataFromParent);
  };
  componentDidMount() {
    this.fetchUserName();
    this.checkGroups(this.props.dataFromParent);
  }

  checkGroups = async (userName) => {
    const groupRef = doc(db, "participants", "JNmnZqJPp0p3UR6W3ZuY");
    const docSnap = await getDoc(groupRef);
    console.log("docSnap: ", docSnap.data());
    let groupArr = docSnap.data();
    console.log("groupArr: ", groupArr);
    let userGroups = groupArr[userName];
    console.log("groupArr: ", groupArr[userName]);
    this.setState({ userGroups: userGroups });
  };
    grpClick=(index)=>{
        console.log("index: ",index);

        this.props.fetchGroupName(this.state.userGroups[index]);
    }

  render() {
    return (
      <div className="leftSide">
        <div className="groupBackground">
          <h3 className="groups">Groups</h3>
        </div>
        <div>
          {this.state.userGroups.map((group, index) => (
            <div key={index}>
              {group ? (
                <button key={index} onClick={()=>this.grpClick(index)} className="grpBtn">
                <div className="groupCard">
                  <p className="groupName">{group}</p>
                </div>
                </button>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
