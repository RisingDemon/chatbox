import { Component } from "react";
import "./Messages.css";
import { firestore } from "./Config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
  listCollections,
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "./Config";

import React, { useContext } from "react";
import { NameContext } from "./App";

import OpenAI from "openai";
// import * as dotenv from "dotenv";
// dotenv.config();

const openai = new OpenAI({
  //   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

export default class Messages extends Component {
  state = {
    messages: [],
    text: "",
    userName: "",
    group: "",
    arg0: "chats",
    arg1: "",
    arg2: "messages",
    flagForLater: false,
    chatgpt: "",
  };
  handleChange = (event) => {
    this.setState({ text: event.target.value });
    // this.setState({ userName: this.props.dataFromParent });
  };
  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      // if the message has /chatgpt in the beginning, then send it to chatgpt
      if (this.state.text.startsWith("/chatgpt")) {
        console.log("message starts with /chatgpt");
        // send the message to chatgpt
        // fetch the message from inputBar
        let message = this.state.text;
        console.log("message: ", message);
        // remove /chatgpt from the message
        message = message.replace("/chatgpt", "");
        console.log("message: ", message);
        this.callChatgpt(message);
      }
      this.submitMessage();
    }
  };

  callChatgpt = async (sendMessage) => {
    console.log("message: ", sendMessage);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: sendMessage }],
      temperature: 1,
      max_tokens: 64,
      n: 1,
      top_p: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    });
    console.log(response.choices[0].message.content);
    let chatgptResponse = response.choices[0].message.content;
    this.setState({ chatgpt: response.choices[0].message.content });
    this.submitMessage(chatgptResponse);
  };
  submitMessage = async (chatgptResponse) => {
    const messageRef = collection(
      db,
      this.state.arg0,
      this.state.arg1,
      this.state.arg2
    );
    // let timestamp2 = new Date().toLocaleString();
    // timestamp in united kingdom format
    let timestamp2 = new Date().toLocaleString("en-GB");
    timestamp2 = timestamp2.replace(/\//g, "-");

    console.log("data from app: ", this.props.dataFromParent);

    let payload;
    if (chatgptResponse) {
      payload = {
        userId: "chatgpt",
        content: chatgptResponse,
        timestamp: timestamp2,
      };
    }
    // if (this.state.chatgpt !== "") {
    //   this.setState({ chatgpt: "" });
    //    payload = {
    //     userId: "chatgpt",
    //     content: this.state.chatgpt,
    //     timestamp: timestamp2,
    //   };
    // }
    else {
      payload = {
        userId: this.state.userName,
        content: this.state.text,
        timestamp: timestamp2,
      };
    }
    // clear the contents from class named inputBar
    document.getElementsByClassName("inputBar")[0].value = "";
    this.setState({ text: "" });
    const newDocRef = await addDoc(messageRef, payload);
    console.log("New Document Reference: ", newDocRef);
  };
  groupClicked = async () => {
    console.log("group clicked");
    console.log("userName: ", this.state.userName);
    let grpName = this.props.grpName;
    this.setState({ group: grpName });
    this.setState({ arg1: grpName });
    console.log("grpName: ", grpName);

    const groupRef = doc(db, "participants", "JNmnZqJPp0p3UR6W3ZuY");
    const docSnap = await getDoc(groupRef);
    console.log("docSnap: ", docSnap.data());
    let groupArr = docSnap.data();
    console.log("groupArr: ", groupArr);
    let allParticipents = [];
    for (const key in groupArr) {
      allParticipents.push(key);
    }
    console.log("allParticipatents: ", allParticipents);
    // check if grpName is present in allParticipents
    let flag2 = false;
    for (let i of allParticipents) {
      if (i === grpName) {
        console.log("grpName: ", grpName);
        console.log("i: ", i);
        flag2 = true;
        console.log("group exists in participants collection", i, grpName);
        break;
      } else {
        flag2 = false;
      }
    }
    if (flag2 === true) {
      this.setState({ arg0: "dm" });
      this.setState({ arg2: this.state.userName });
      console.log("group exists in participants collection");

      const querySnapshot = await getDocs(collection(db, "dm"));
      console.log("querySnapshot: ", querySnapshot);
      let namesArr = [];
      querySnapshot.forEach((doc) => {
        namesArr.push(doc.id);
      });
      let flag = false;
      console.log("namesArr: ", namesArr);
      // iterate over namesArr and check if grpName is present
      for (let i of namesArr) {
        if (i === grpName) {
          namesArr = [];
          console.log("group exists");
          this.setState({ arg2: this.state.userName });
          this.setState({ arg1: grpName });
          // const groupRef = collection(db, "dm", grpName, this.state.userName);
          // const payload = {
          //   [grpName]: ["demo"],
          // };
          // const newDocRef = await addDoc(groupRef, payload);
          flag = true;
        }
      }
      if (flag === false) {
        console.log("group does not exist");
        for (let i of namesArr) {
          console.log(this.state.userName);
          if (i === this.state.userName) {
            this.setState({ arg1: this.state.userName });
            this.setState({ arg2: grpName });
            console.log("user exists");
            flag = true;
          }
        }
        if (flag === false) {
          let data = {};
          await setDoc(doc(db, "dm", grpName), data);
          // create a collection with user name
          console.log("group created");
          this.setState({ arg1: grpName });
          this.setState({ arg2: this.state.userName });
        }

        //   add group to chats collection
      }
    } else {
      this.setState({ arg0: "chats" });
      this.setState({ arg2: "messages" });
    }

    if (this.props.grpName !== "") {
      console.log(this.state.arg0, this.state.arg1, this.state.arg2);
      const unsub = onSnapshot(
        collection(db, this.state.arg0, this.state.arg1, this.state.arg2),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              console.log("New city: ", change.doc.data());
              let simplifiedMessage = {
                user: change.doc.data().userId,
                text: change.doc.data().content,
                timestamp: change.doc.data().timestamp,
              };
              console.log("Simplified Message: ", simplifiedMessage);
              this.state.messages.push(simplifiedMessage);
              console.log("Messages Array: ", this.state.messages);
            }
            if (change.type === "modified") {
              console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
              console.log("Removed city: ", change.doc.data());
              this.state.messages.forEach((message, index) => {
                if (
                  message.timestamp === change.doc.data().timestamp &&
                  message.text === change.doc.data().content &&
                  message.user === change.doc.data().userId
                ) {
                  this.state.messages.splice(index, 1);
                }
              });
            }
            //  sort the messages by timestamp considering hours, minutes, seconds

            // this.state.messages.sort((a, b) => {
            //   let dateA = new Date(a.timestamp);
            //   let dateB = new Date(b.timestamp);
            //   return dateA - dateB;
            // });
            // this.setState({ messages: this.state.messages });
            const compareByTimestamp = (a, b) => {
              const [dateA, timeA] = a.timestamp.split(", ");
              const [dateB, timeB] = b.timestamp.split(", ");
              const dateComparison = dateA.localeCompare(dateB);
              if (dateComparison !== 0) {
                return dateComparison;
              }
              const timeComparison = timeA.localeCompare(timeB);
              return timeComparison;
            };
            this.state.messages.sort(compareByTimestamp);
            this.setState({ messages: this.state.messages });
            console.log("Messages Array: ", this.state.messages);
          });
        }
      );
    }
  };

  checkChatgptMessages = () => {
    console.log("checkChatgptMessages");
    let allDivs = document.getElementsByClassName("messageCard");
    for (let i = 0; i < allDivs.length; i++) {
      if (allDivs[i].children[0].innerHTML === "chatgpt") {
        allDivs[i].parentNode.style.textAlign = "right";
        allDivs[i].style.display = "inline-block";
      }
    }
  };
  checkSelfMessages = () => {
    console.log("checkSelfMessages");
    let allDivs = document.getElementsByClassName("messageCard");
    for (let i = 0; i < allDivs.length; i++) {
      if (allDivs[i].children[0].innerHTML === this.state.userName) {
        allDivs[i].style.backgroundColor = "lightblue";
      }
    }
  };

  componentDidMount() {
    this.setState({ userName: this.props.dataFromParent });
    console.log("data from app: ", this.props.dataFromParent);
    console.log("userName: ", this.state.userName);
  }
  componentDidUpdate(prevProps) {
    if (this.props.grpName !== prevProps.grpName) {
      console.log("group name changed");
      this.setState({ group: this.props.grpName });
      this.state.messages = [];
      this.groupClicked();
    }
    this.checkChatgptMessages();
    this.checkSelfMessages();
  }

  render() {
    return (
      <div className="rightSide">
        <div className="messageBackground">
          <h3 className="messages">Messages</h3>
        </div>
        {this.state.group ? (
          <div className="rightInside">
            <div>
              {this.state.messages.map((message, index) => (
                <div key={index}>
                  {message ? (
                    <div className="messageCard">
                      <p className="userName">{message.user}</p>
                      <p className="userText">{message.text}</p>
                      <p className="userTimestamp">{message.timestamp}</p>
                    </div>
                  ) : (
                    <p className="messageCard">No messages</p>
                  )}
                </div>
              ))}
            </div>
            <div className="comb">
              {/* send message */}
              <input
                className="inputBar"
                type="text"
                placeholder="Type your message here"
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
              />
              <button onClick={this.submitMessage} className="iconBtn">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>The messages will be here</p>
          </div>
        )}
      </div>
    );
  }
}
