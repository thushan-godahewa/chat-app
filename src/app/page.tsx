"use client";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("user_joined", (message) => {
      setMessages((prevMessages) => [...prevMessages, { sender: "System", message }]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  const handleJoinRoom = () => {
    if (userName && room) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  };

  function handleSendMessage(message: string): void {
    const data = {
      room,
      message,
      sender: userName,
    };
    setMessages((prevMessages) => [...prevMessages, { sender: userName, message }]);
    socket.emit("message", data);
  }
  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold">Join a Room</h1>
          <input
            type="text"
            placeholder="Enter your name"
            className="mb-4 p-2 border border-gray-300 rounded"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID"
            className="mb-4 p-2 border border-gray-300 rounded"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room: {room}</h1>
          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
            {messages.map((msg, index) => (
              <ChatMessage key={index} sender={msg.sender} message={msg.message} isOwnMessage={msg.sender === userName} />
            ))}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
