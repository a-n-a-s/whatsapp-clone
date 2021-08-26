import { useState, useEffect } from "react";
import "./App.css";
import Api from "./api";

import { Avatar, IconButton } from "@material-ui/core";

import ChatIntro from "./Components/ChatIntro/ChatIntro";
import ChatWindow from "./Components/ChatWindow/ChatWindow";
import NewChat from "./Components/NewChat/NewChat";
import Login from "./Components/Login/Login";

import ChatListItem from "./Components/ChatListItem/ChatListItem";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import SearchIcon from "@material-ui/icons/Search";

function App() {
  const [chatList, setChatList] = useState([]);

  const [activeChat, setActiveChat] = useState({});

  const [user, setUser] = useState(null);

  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(()=>{
    if(user !==null){
      let unsub  = Api.onChatList(user.id,setChatList);
      return unsub;
    }
  },[user])


  const handleNewChat = () => {
    setShowNewChat(true);
  };

  const handleLoginData = async (u) => {
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL,
    };
    await Api.addUser(newUser);
    setUser(newUser);
  };

  if (user === null) {
    return <Login onReceive={handleLoginData} />;
  }

  return (
    <div className="app-window">
      <div className="sidebar">
        <NewChat
          user={user}
          show={showNewChat}
          setShow={setShowNewChat}
          chatist={chatList}
        />
        <header>
          <Avatar src={user.avatar} />
          <div className="header-buttons">
            <div className="header-btn">
              <IconButton>
                <DonutLargeIcon style={{ color: "#919191" }} />
              </IconButton>
            </div>
            <div className="header-btn" onClick={handleNewChat}>
              <IconButton>
                <ChatIcon style={{ color: "#919191" }} />
              </IconButton>
            </div>
            <div className="header-btn">
              <IconButton>
                <MoreVertIcon style={{ color: "#919191" }} />
              </IconButton>
            </div>
          </div>
        </header>
        <div className="search">
          <div className="search-input">
            <SearchIcon fontSize="small" style={{ color: "#919191" }} />
            <input type="search" placeholder="Search or start a new chat" />
          </div>
        </div>
        <div className="chatlist">
          {chatList?.map((item, key) => (
            <ChatListItem
              key={key}
              data={item}
              active={activeChat.chatId === chatList[key].chatId}
              onClick={() => setActiveChat(chatList[key])}
            />
          ))}
        </div>
      </div>

      <div className="contentarea">
        {activeChat.chatId !== undefined && <ChatWindow user={user} data={activeChat} />}
        {activeChat.chatId === undefined && <ChatIntro />}
      </div>
    </div>
  );
}
export default App;
