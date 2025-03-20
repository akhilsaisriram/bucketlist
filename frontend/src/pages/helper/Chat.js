
import React, { useEffect, useState, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";

const Chat = ({ selectedPerson }) => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]); // Store messages when backend is unreachable
  const socket = useRef(null);
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false); // Track socket connection state

  const fetchData = async () => {
    if (!user?.idd || !selectedPerson?.uid) return;

    const generatedRoomId = [user.idd, selectedPerson.uid].sort().join("_");

    try {
      const response = await axios.post(
        `${window._env_.REACT_APP_BASE_URL_CHAT}/allmessages`,
        { room: generatedRoomId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const connectSocket = () => {
      socket.current = io(`${window._env_.REACT_APP_BASE_URL_CHAT}`, {
        path: "/chat-socket",
        reconnection: true,
        reconnectionAttempts: 10, // Retry 10 times
        reconnectionDelay: 3000, // Retry every 3 seconds
      });

      socket.current.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to Socket.io server");

        if (selectedPerson) {
          const generatedRoomId = [user.idd, selectedPerson.uid].sort().join("_");
          setRoom(generatedRoomId);

          socket.current.emit("joinRoom", { room: generatedRoomId, name: user.username ,id:user.idd});

          // Send any stored messages after reconnection
          if (pendingMessages.length > 0) {
            pendingMessages.forEach((msg) => socket.current.emit("chatMessage", msg));
            setPendingMessages([]); // Clear queue
          }
        }
      });

      socket.current.on("disconnect", () => {
        setIsConnected(false);
        console.warn("Socket disconnected. Retrying...");

      });

      socket.current.on("connect_error", (error) => {
        setIsConnected(false);

        console.error("Socket connection error:", error);
      });

      socket.current.on("reconnect_attempt", (attempt) => {
        console.log(`Reconnecting... Attempt ${attempt}`);
      });

      socket.current.on("message", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.current.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });
    };

    connectSocket();
    fetchData();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [selectedPerson]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const msgObject = {
        room,
        name: user.username,
        message,
        timestamp: new Date().toISOString(),
      };

      if (isConnected) {
        socket.current.emit("chatMessage", msgObject);
      } else {
        console.warn("Socket is disconnected. Storing message locally.");
        setPendingMessages((prev) => [...prev, msgObject]);
      }

      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-center items-center text-white h-10 bg-slate-500 w-full px-2 border rounded-lg">
        {selectedPerson ? <>{selectedPerson.name}</> : <></>}
      </div>

      <div className="flex flex-col w-full h-full bg-slate-100 mt-3 border rounded-lg p-3">
        <div className="flex-grow overflow-y-auto max-h-[70vh] space-y-2">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`p-2 rounded-lg w-[50%] ${
                msg.sender === selectedPerson.name
                  ? "text-right bg-gradient-to-l from-blue-500 to-blue-100 p-2 rounded-lg w-[50%] ml-auto"
                  : "text-left bg-gradient-to-r from-blue-500 to-blue-100 p-2 rounded-lg w-[50%]"
              }`}
            >
              {msg.content}
              <span style={{ fontSize: "small", display: "block" }}>
                {new Date(msg.timestamp).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </p>
          ))}
        </div>

        <div className="flex items-center bg-slate-500 p-2 rounded-lg">
          <textarea
            className="flex-grow bg-white border rounded-lg p-2 resize-none"
            placeholder="Type a message"
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="ml-2 p-2 rounded-full text-white" onClick={handleSendMessage}>
            <SendIcon />
          </button>
        </div>

        {!isConnected && (
          <div className="text-center text-red-600 font-bold mt-2">
            Server is unreachable. Messages will be sent when reconnected.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
