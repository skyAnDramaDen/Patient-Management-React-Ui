import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Authcontext";
import PageHeader from "../PageHeader/PageHeader";
import "./DoctorChat.css";

const DoctorChat = () => {
  const { user, socket } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState({});

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("join", { username: user.username, role: user.role, userId: user.id });

    socket.on("receivePrivateMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("users", (users) => {
        const filtered_users = users.filter((u) => {
            return u.userId != user.id;
        });
        
        setOnlineUsers(filtered_users);
    });

    return () => {
      socket.off("receivePrivateMessage");
      socket.off("users");
    };
  }, [socket, user]);

  const sendMessage = () => {
    if (message.trim() && recipient) {
        socket.emit("privateMessage", {
            recipient,
            message,
            sender: user.username
        });

      setMessages([...messages, { sender: user.username, message }]);
      setMessage("");
    }
  };

  return (
    <div className="doctor-chat-container">
      <PageHeader title="Doctor Chat" />

      <div className="chat-layout">
        <div className="online-users-section">
          <h3 className="section-title">Online Users</h3>
          <ul className="online-users-list">
            {onlineUsers.map((u) => (
              <li key={u.userId} className="user-item">
                <button className={`user-button ${recipient === u.userId ? "active" : ""}`}
                  onClick={() => setRecipient(u.userId)}
                  enabled ={u.role}
                >
                  {u.username} ({u.role})
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-section">
          <div className="recipient-info">
            <h4>
              Recipient:{" "}
              {recipient ? onlineUsers.find((u) => u.userId === recipient)?.username : "None selected"}
            </h4>
          </div>

          <div className="message-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === user.username ? "sent" : "received"}`}
              >
                <strong>{msg.sender}: </strong> {msg.message}
              </div>
            ))}
          </div>

          <div className="message-input-section">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
            />
            <button
              onClick={sendMessage}
              disabled={!recipient}
              className="send-button"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorChat;