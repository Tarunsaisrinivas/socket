import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket  = io.connect("https://socket-hxth.onrender.com");


const App = () => {
  const [message,setMessage] = useState("");
  const [messageRecieved,setMessageRecieved] = useState("");
  const sendMessage = () =>{
    socket.emit("send_message",{message });    
  }

useEffect(()=>{
  socket.on("receive_message",(data)=>{
    setMessageRecieved(data.message)
  })
},[socket])


  return (
    <div className='App'>
      <input placeholder='Message' onChange={(e)=>{setMessage(e.target.value)}} />
      <button onClick={sendMessage}>Send Message</button>
      <p>Message :</p>
      {messageRecieved}
    </div>
  )
}

export default App