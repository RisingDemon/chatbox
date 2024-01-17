import { Component } from "react";
import "./Groups.css";
import { db } from "./Config";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";


export default class Groups extends Component {
  state = {
    userName: "",
    bgColor: "",
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
    for(const key in groupArr){
        userGroups.push(key);
    }
    console.log("groupArr: ", groupArr[userName]);
    this.setState({ userGroups: userGroups });
  };
    grpClick=(index)=>{
        console.log("index: ",index);
        // change background color of group card
        // fetch button element with index
        // change background color of button
        // clear background color of other buttons
        let btns=document.getElementsByClassName("grpBtn");
        for(let i=0;i<btns.length;i++){
            btns[i].style.backgroundColor="white";
        }
        document.getElementsByClassName("grpBtn")[index].style.backgroundColor="red";
        // this.setState({bgColor: "red"});

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
                <button style={{backgroundColor: this.state.bgColor}} key={index} onClick={()=>this.grpClick(index)} className="grpBtn">
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
