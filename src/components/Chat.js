import React,{useState} from 'react'
import { useAddress } from '@thirdweb-dev/react/evm'

function Chat({client,messageHistory,conversation}) {
    const address=useAddress()
    const [inputValue,setInputValue]=useState("")

    const handleSend=async()=>{
        if(inputValue){
            await onSendMessage(inputValue)
            setInputValue("")
        }
    }

    const onSendMessage=async(value)=>{
        return conversation.send(value)
    }

    const MessageList=({messages})=>{
        messages=messages.filter(
            (v,i,a)=>a.findIndex((t)=>t.id===v.id)===i,
        )
    

  return (
    <>
    <div>Chat</div>
    <ul>
        {messages.map((message,index)=>(
            <li key={message.id} title='click to log this message'>
                <strong>
                    {message.senderAddress===address?"You":"Bot"}
                </strong>
                <span>{message.content}</span>
                <span>({message.sent.toLocaleTimeString()})</span>
                {/* <span onClick={()=>console.log(message)}>helllo</span> */}
            </li>
        ))}
    </ul>
    </>
  )
}

const handleInputChange=(event)=>{
    if(event.key==='Enter')
    {
        handleSend()
    }
    else{
        setInputValue(event.target.value)
    }
}
return(
<>
<div>
    <div>
        <MessageList messages={messageHistory} />
    </div>
    <div>
        <input type='text' onChange={handleInputChange} value={inputValue} placeholder='type ur message' onKeyPress={handleInputChange} />
        <button onClick={handleSend}>send</button>
    </div>
</div>
</>
    )
}

export default Chat