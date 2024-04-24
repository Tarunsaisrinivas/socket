import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CryptoJS from "crypto-js";

const socket = io.connect("http://localhost:1419");

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastSentMessage, setLastSentMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const sendMessage = () => {
    const encryptedMessage = CryptoJS.AES.encrypt(
      message,
      "secret key"
    ).toString();
    console.log("Encrypted Message:", encryptedMessage);
    socket.emit("send_message", { message: encryptedMessage });
    setLastSentMessage(message);
    setMessages(prevMessages => [...prevMessages, { sender: 'self', message: message }]);
    setMessage("");
  };

  useEffect(() => {
    const handleMessage = (data) => {
      const decryptedMessage = CryptoJS.AES.decrypt(
        data.message,
        "secret key"
      ).toString(CryptoJS.enc.Utf8);
      setMessageReceived(decryptedMessage);
      setMessages(prevMessages => [...prevMessages, { sender: 'other', message: decryptedMessage }]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col h-full">
        <div className="flex-grow flex flex-col">
          <div className="overflow-y-auto flex-grow">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'self' ? 'text-right' : 'text-left'}`}>
                <div className={`${msg.sender === 'self' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} p-2 rounded-lg inline-block`}>
                  {msg.sender === 'self' && <h3 className="text-xs mb-1">Sent Message:</h3>}
                  {msg.sender === 'other' && <h3 className="text-xs mb-1">Received Message:</h3>}
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <input
            className="flex-grow border rounded-l-lg p-2"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
