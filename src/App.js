import logo from "./logo.svg";
import { React } from "react";
import "./App.css";
import Title from "./Title";
import Groups from "./Groups";
import Messages from "./Messages";

import { useState } from "react";

function App() {
  // multiple states
  const [messageFromChild, setMessageFromChild] = useState("");
  const [messageFromChild2, setMessageFromChild2] = useState("");
  const getData = (data) => {
    setMessageFromChild(data);
  };
  const clickedgrpName = (data) => {
    setMessageFromChild2(data);
    console.log("clickedgrpName", data);
  };
  return (
    <div className="App">
      <Title takeData={getData} />
      {messageFromChild ? (
        <div>
          <Groups dataFromParent={messageFromChild} fetchGroupName={clickedgrpName}  />
          <Messages dataFromParent={messageFromChild} grpName={messageFromChild2} />
        </div>
      ) : (
        <p>Nothing to show</p>
      )}
    </div>
  );
}

export default App;
