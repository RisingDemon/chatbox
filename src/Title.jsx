import { Component } from "react";
import "./Title.css";
import { auth, provider } from "./Config";
import { signInWithPopup } from "firebase/auth";
import logo from "./chatBoxLogo.png";
import googleLogo from "./devicon_google.png";

import { db } from "./Config";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";

export default class Title extends Component {
  state = {
    userName: "",
  };

  sendDataToApp = (userName) => {
    this.props.takeData(userName);
  };
  handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result.user);
        let userName = result.user.displayName;
        console.log(userName);
        this.setState({ userName: userName });
        // check if user exists in participants collection
        const groupRef = doc(db, "participants", "JNmnZqJPp0p3UR6W3ZuY");
        const docSnap = await getDoc(groupRef);
        // if user does not exist, add user to participants collection
        // if user exists, do nothing
        let groupArr = docSnap.data();
        let flag = false;
        console.log("groupArr: ", groupArr);
        for (const key in groupArr) {
          console.log("groupArr[]: ", groupArr[key]);
          if (key === userName) {
            console.log("user exists");
            flag = true;
          }
        }
        if (flag === false) {
          console.log("user does not exist");
          let payload = {
            [userName]: ["demo"],
          };
          await setDoc(
            doc(db, "participants", "JNmnZqJPp0p3UR6W3ZuY"),
            payload,
            { merge: true }
          );

        }
        this.sendDataToApp(userName);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  render() {
    return (
      <div className="titleBackground">
        <div className="logoNname">
          <img className="chatboxLogo" src={logo} alt="logo" />
          <h2 className="chatBox">ChatBox</h2>
        </div>
        <div id="login">
          <button className="signInBtn" onClick={this.handleSignIn}>
            <img
              style={{
                width: 19,
                height: 19,
                flexShrink: 0,
                marginTop: 0,
              }}
              src={googleLogo}
              alt=""
            />
            <h5 className="signInText">Sign in with Google</h5>
          </button>
        </div>
      </div>
    );
  }
}
