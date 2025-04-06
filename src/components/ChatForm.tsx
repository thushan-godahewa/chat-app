import React, { FormEvent, useState } from "react";

const ChatForm = ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none"
        placeholder="Type your message..."
      ></input>
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
        Send
      </button>
    </form>
  );
};

export default ChatForm;
