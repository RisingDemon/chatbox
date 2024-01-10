import { Component } from "react";
import "./Messages.css";
import { firestore } from "./Config";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "./Config";

import React, { useContext } from "react";
import { NameContext } from "./App";

export default class Messages extends Component {
  state = {
    messages: [],
    text: "",
    userName: "",
    group: "",
  };
  handleChange = (event) => {
    this.setState({ text: event.target.value });
    this.setState({ userName: this.props.dataFromParent });
  };
  submitMessage = async () => {
    const messageRef = collection(db, "chats", this.state.group, "messages");
    let timestamp2 = new Date().toLocaleString();
    timestamp2 = timestamp2.replace(/\//g, "-");

    console.log("data from app: ", this.props.dataFromParent);

    const payload = {
      userId: this.state.userName,
      content: this.state.text,
      timestamp: timestamp2,
    };
    // clear the contents from class named inputBar
    document.getElementsByClassName("inputBar")[0].value = "";
    this.setState({ text: "" });
    const newDocRef =await addDoc(messageRef, payload);
    console.log("New Document Reference: ", newDocRef);
  };
  groupClicked = () => {
    console.log("group clicked");
    // this.setState({ group: this.props.grpName });
    // let grpName = this.props.grpName;
    // console.log("grpName: ", grpName);
    let grpName = this.props.grpName;
    console.log("grpName: ", grpName);
    if (this.props.grpName !== "") {
      const unsub = onSnapshot(
        collection(db, "chats", grpName, "messages"),
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

            this.state.messages.sort((a, b) => {
              let dateA = new Date(a.timestamp);
              let dateB = new Date(b.timestamp);
              return dateA - dateB;
            });
            this.setState({ messages: this.state.messages });
          });
        }
      );
    }
  };
  componentDidUpdate(prevProps) {
    if (this.props.grpName !== prevProps.grpName) {
      console.log("group name changed");
      this.setState({ group: this.props.grpName });
      this.state.messages = [];
      this.groupClicked();
    }
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
