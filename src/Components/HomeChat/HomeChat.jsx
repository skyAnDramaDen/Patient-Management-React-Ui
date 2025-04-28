import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";

import { AuthContext } from "../../Authcontext";
import PageHeader from "../PageHeader/PageHeader";

import $ from "jquery";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeChat = () => {
    const { user, socket } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState({});
    const [recipient, setRecipient] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const isReception = true;
    const server_url = process.env.REACT_APP_API_URL;
    // const [role, setRole] = useState("");

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
    }, []);

    const sendMessage = async () => {
        if (message.trim() && recipient) {
          const senderName = isReception ? "Reception" : user.username;
          socket.emit("privateMessage", {
            recipient,
            message,
            sender: senderName
          });

          try {
            $.ajax({
              url: `${server_url}/messages/create-send`,
              method: "POST",
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                senderId: user.id,
                receiverId: recipient,
                content: message,
              }),
              success: function (response) {
                setMessages([...messages, { sender: user.username, message }]);
                setMessage("");
              },
              error: function (error) {
                toast.error("Failed to save message.");
              },
            });
          } catch (error) {
            toast.error("Failed to save message");
          }
        }
    };

    return (
        <div className="doctor-chat-container">
          <PageHeader title="Chat" backPath="/"/>
    
          <div className="chat-layout">
            <div className="online-users-section">
              <h3 className="section-title">Online Users</h3>
              <ul className="online-users-list">
                {onlineUsers.map((u) => (
                  <li key={u.userId} className="user-item">
                    <button className={`user-button ${recipient === u.userId ? "active" : ""}`}
                      onClick={() => setRecipient(u.userId)}
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

export default HomeChat;