import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";

import Api from "../../api";

import { Avatar, IconButton } from "@material-ui/core";
import EmojiPicker from "emoji-picker-react";

import MessageItem from "../MessageItem/MessageItem";
import SearchIcon from "@material-ui/icons/Search";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import CloseIcon from "@material-ui/icons/Close";
import MicIcon from "@material-ui/icons/Mic";

const ChatWindow = ({ user, data }) => {
  const body = useRef();

  let recognition = null;

  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition !== undefined) {
    recognition = new SpeechRecognition();
  }

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  const [list, setList] = useState([]);
const [users,setUsers] = useState([]);
  useEffect(() => {
    setList([]);
    let unsub = Api.onChatContent(data.chatId, setList,setUsers);
    return unsub;
  }, [data.chatId]);

  useEffect(() => {
    if (body.current.scrollHeight > body.current.offsetHeight) {
      body.current.scrollTop =
        body.current.scrollHeight - body.current.offsetHeight;
    }
  }, [list]);

  const handleEmojiClick = (e, emojiObject) => {
    setText(text + emojiObject?.emoji);
  };

  const handleOpenEmoji = () => {
    setEmojiOpen(true);
  };

  const handleCloseEmoji = () => {
    setEmojiOpen(false);
  };
  const handleInputKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSendClick();
    }
  };
  const handleSendClick = () => {
    if (text !== "") {
       Api.sendMessage(data, user.id ,'text',text,users);
      setText('');
      setEmojiOpen(false)
    }
  };

  const handleMicClick = () => {
    if (recognition !== null) {
      recognition.onstart = () => {
        setListening(true);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
      };
      recognition.start();
    }
  };

  return (
    <div className="chatWindow">
      <div className="chatWindow-header">
        <div className="chatWindow-header-info">
          <Avatar className="chatWindow-avatar" src={data.image} />
          <div className="chatWindow-name">
            {data.title}
          </div>
        </div>
        <div className="chatWindow-headerbuttons">
          <div className="chatWindow-btn">
            <IconButton>
              <SearchIcon style={{ color: "#919191" }} />
            </IconButton>
          </div>
          <div className="chatWindow-btn">
            <IconButton>
              <AttachFileIcon style={{ color: "#919191" }} />
            </IconButton>
          </div>
          <div className="chatWindow-btn">
            <IconButton>
              <MoreVertIcon style={{ color: "#919191" }} />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="chatWindow-body" ref={body}>
        {list.map((item, key) => (
          <MessageItem data={item} key={key} user={user} />
        ))}
      </div>
      <div
        className="chatWindow-emoji"
        style={{ height: emojiOpen ? "200px" : "0px" }}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          disableSearchBar
          disableSkinTonePicker
        />
      </div>
      <div className="chatWindow-footer">
        <div className="chatWindow-pre">
          <div className="chatWindow-btn" onClick={handleOpenEmoji}>
            <IconButton>
              <InsertEmoticonIcon
                style={{ color: emojiOpen ? "#009688" : "#919191" }}
              />
            </IconButton>
          </div>
          <div
            className="chatWindow-btn"
            onClick={handleCloseEmoji}
            style={{ width: emojiOpen ? "40px" : "0px" }}
          >
            <IconButton>
              <CloseIcon style={{ color: "#919191" }} />
            </IconButton>
          </div>
        </div>
        <div className="chatWindow-input">
          <input
            type="text"
            placeholder="Type a message"
            onChange={(e) => setText(e.target.value)}
            value={text}
            onKeyUp={handleInputKeyUp}
          />
        </div>
        <div className="chatWindow-pos">
          {text === "" && (
            <div className="chatWindow-btn">
              <IconButton>
                <MicIcon
                  style={{ color: listening ? "#126ece" : "#919191" }}
                  onClick={handleMicClick}
                />
              </IconButton>
            </div>
          )}
          {text !== "" && (
            <div className="chatWindow-btn">
              <IconButton>
                <SendIcon
                  style={{ color: "#919191" }}
                  onClick={handleSendClick}
                />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
