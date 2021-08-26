import React, { useState, useEffect } from "react";
import "./NewChat.css";
import Api from "../../api";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { IconButton, Avatar } from "@material-ui/core";

const NewChat = ({ user, show, setShow, chatlist }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      if (user !== null) {
        let results = await Api.getContactList(user.id);
        setList(results);
      }
    };
    getList();
  }, [user]);

  const handleClose = () => {
    setShow(false);
  };
  const addNewChat = async (user2) => {
    await Api.addNewChat(user, user2);
    handleClose();
  };
  return (
    <div className="newchat" style={{ left: show ? "0" : "-500px" }}>
      <div className="newchat-head">
        <div className="newchat-backbutton" onClick={handleClose}>
          <IconButton>
            <ArrowBackIosIcon style={{ color: "#fff" }} />
          </IconButton>
        </div>
        <div className="newchat-headtitle">New Conversation</div>
      </div>
      <div className="newchat-list">
        {list.map((item, key) => (
          <div
            onClick={() => addNewChat(item)}
            className="newchat-item"
            key={key}
          >
            <Avatar src={item.avatar} className="newchat-itemavatar" />
            <div className="newchat-itemname">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChat;
