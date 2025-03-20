import React, { useEffect, useState, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MicIcon from "@mui/icons-material/Mic";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";
import Lottie from "react-lottie";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import typingAnimation from "./typinganimation.json";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const MessageChat = ({ selectedPerson }) => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [messageStatus, setMessageStatus] = useState({});

  const socket = useRef(null);
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  const fetchData = async () => {
    if (!user?.idd || !selectedPerson?.uid) return;

    const generatedRoomId = [user.idd, selectedPerson.uid].sort().join("_");
    setRoom(generatedRoomId);

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
      // scrollToBottom();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // This will trigger whenever messages change

  useEffect(() => {
    const connectSocket = () => {
      socket.current = io(`${window._env_.REACT_APP_BASE_URL_CHAT}`, {
        path: "/chat-socket",
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 3000,
      });

      socket.current.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to Socket.io server");

        if (selectedPerson) {
          const generatedRoomId = [user.idd, selectedPerson.uid]
            .sort()
            .join("_");
          setRoom(generatedRoomId);

          socket.current.emit("joinRoom", {
            room: generatedRoomId,
            name: user.username,
            id: user.idd,
          });

          if (pendingMessages.length > 0) {
            pendingMessages.forEach((msg) => {
              socket.current.emit("chatMessage", msg);
              setMessageStatus((prev) => ({
                ...prev,
                [msg.timestamp]: "sent",
              }));
            });
            setPendingMessages([]);
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

        // Set message as delivered
        setMessageStatus((prev) => ({
          ...prev,
          [newMessage.timestamp]: "delivered",
        }));

        // Play notification sound
        // const audio = new Audio("/message-tone.mp3");
        // audio.play();
      });

      socket.current.on("messageRead", (msgTimestamp) => {
        setMessageStatus((prev) => ({
          ...prev,
          [msgTimestamp]: "read",
        }));
      });

      socket.current.on("userTyping", (username) => {
        if (username === selectedPerson.name) {
          setIsTyping(true);

          // Clear typing indicator after 3 seconds
          setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      });

      socket.current.on("onlineUsers", (users) => {
        setOnlineUsers(users);

        // Check if selected person is online
        const isSelectedPersonOnline = users.some(
          (u) => u.id === selectedPerson?.uid
        );
        if (!isSelectedPersonOnline && selectedPerson) {
          // Get last seen time
          socket.current.emit("getLastSeen", selectedPerson.uid);
        }
      });

      socket.current.on("lastSeen", (data) => {
        if (data.userId === selectedPerson?.uid) {
          setLastSeen(data.timestamp);
        }
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
      const timestamp = new Date().toISOString();
      const msgObject = {
        room,
        name: user.username,
        message,
        timestamp,
      };

      // Add to messages immediately for UI responsiveness
      setMessages((prev) => [
        ...prev,
        {
          sender: user.username,
          content: message,
          timestamp,
        },
      ]);

      if (isConnected) {
        socket.current.emit("chatMessage", msgObject);
        setMessageStatus((prev) => ({
          ...prev,
          [timestamp]: "sent",
        }));
      } else {
        console.warn("Socket is disconnected. Storing message locally.");
        setPendingMessages((prev) => [...prev, msgObject]);
        setMessageStatus((prev) => ({
          ...prev,
          [timestamp]: "pending",
        }));
      }

      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    } else {
      // Emit typing event
      if (socket.current && isConnected) {
        socket.current.emit("typing", {
          room,
          name: user.username,
        });
      }

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    textareaRef.current.focus();
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log("File selected:", file);

      // Example: You would upload the file to your server
      // and then send a message with the file URL
      const reader = new FileReader();
      reader.onload = (event) => {
        // For demo purposes, we'll just add a message saying a file was shared
        setMessage(`I shared a file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 border rounded-3xl flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="px-5 py-1 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <div className="relative">
            <Avatar size={64} icon={<UserOutlined />} />

            {onlineUsers.some((u) => u.id === selectedPerson?.uid) && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="ml-3 flex flex-col">
            <h3 className="font-semibold text-gray-800">
              {selectedPerson?.name}
            </h3>
            <span className="text-xs text-gray-500">
              {onlineUsers.some((u) => u.id === selectedPerson?.uid)
                ? "Online"
                : lastSeen
                ? `Last seen ${new Date(lastSeen).toLocaleString()}`
                : "Offline"}
            </span>
          </div>
        </div>

        {!isConnected && (
          <div className="flex items-center text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
            <ErrorIcon fontSize="small" className="mr-1" />
            Reconnecting...
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-5 py-4 space-y-4"   >
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                {date}
              </span>
            </div>

            {dateMessages.map((msg, index) => {
              const isMine = msg.sender !== selectedPerson?.name;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    isMine ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-[70%] break-words rounded-2xl px-4 py-3 shadow-sm
    ${
      isMine
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none w-fit ml-auto"
        : "bg-white text-gray-800 rounded-bl-none w-fit mr-auto"
    }`}
                  >
                    <div className="whitespace-pre-wrap break-words overflow-hidden text-sm md:text-base">
                      {msg.content}
                    </div>

                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span
                        className={`text-xs ${
                          isMine ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </span>

                      {isMine && (
                        <span>
                          {messageStatus[msg.timestamp] === "read" && (
                            <CheckCircleIcon
                              style={{ fontSize: 14, color: "#4ade80" }}
                            />
                          )}
                          {messageStatus[msg.timestamp] === "delivered" && (
                            <CheckCircleIcon
                              style={{ fontSize: 14, color: "#93c5fd" }}
                            />
                          )}
                          {messageStatus[msg.timestamp] === "sent" && (
                            <CheckCircleIcon
                              style={{ fontSize: 14, color: "#e5e7eb" }}
                            />
                          )}
                          {messageStatus[msg.timestamp] === "pending" && (
                            <ErrorIcon
                              style={{ fontSize: 14, color: "#fca5a5" }}
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center ml-4 mb-2">
            <div className="bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700">
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: typingAnimation,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
                height={30}
                width={60}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 py-1 bg-white border-t relative">
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 right-4 z-10"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end bg-gray-100 rounded-2xl px-4 py-2">
          <button
            className="text-gray-500 hover:text-blue-500 transition-colors p-2"
            onClick={handleFileUpload}
          >
            <AttachFileIcon />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelected}
          />

          <textarea
            ref={textareaRef}
            className="flex-grow bg-transparent border-none outline-none resize-none px-3 py-2 max-h-32"
            placeholder="Type a message..."
            rows={1}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
          />

          <button
            className="text-gray-500 hover:text-blue-500 transition-colors p-2"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <EmojiEmotionsIcon />
          </button>

          {message.trim() ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="ml-2 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              onClick={handleSendMessage}
            >
              <SendIcon />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`ml-2 p-3 rounded-full transition-colors ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={handleVoiceRecording}
            >
              <MicIcon />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageChat;
