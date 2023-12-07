import { ConnectWallet,useAddress,useSigner } from "@thirdweb-dev/react";
import { Client } from "@xmtp/xmtp-js";

import React,{useState,useEffect,useRef} from "react";
import Chat from './Chat'

// const PEER_ADDRESS="0x937C0d4a6294cdfa575de17382c7076b579DC176"
// const PEER_ADDRESS="0x5E84A2288188B48c34840Ab83C5B227C7a87e96F"
const PEER_ADDRESS="0xb47409D9897915F38c6953110a4a23B120c15128"
// const ethereumAddressValidator=(value)=> /^0x[0-9a-fA-F]{40}$/.test(value)
    // const PEER_ADDRESS=Wallet.createRandom()

export default function Home(){

    const [messages,setMessages]=useState(null)
    const convRef=useRef(null)
    const clientRef=useRef(null)
    const address=useAddress()
    const signer=useSigner()
    const isConnected=!!signer
    const [isOnNetwork,setIsOnNetwork]=useState(false)

    const initXmtp=async function(){
        const xmtp=await Client.create(signer,{env:"production"})
        newConversation(xmtp,PEER_ADDRESS)
        setIsOnNetwork(!!xmtp.address)
        clientRef.current=xmtp
    }

    const newConversation=async function(xmtp_client,addressTo){
        // await xmtp_client.conversation.newConversation("0x1234567890123456789012345678901234567890")

        if(await xmtp_client?.canMessage(addressTo)){
            const conversation=await xmtp_client.conversations.newConversation(
                addressTo
            )
            convRef.current=conversation

            const messages=await conversation.messages()
            setMessages(messages)
        }
        else{
            console.log("cant message because is not on the network");
        }
    }

    useEffect(()=>{
        if(isOnNetwork && convRef.current){
            const streamMessages=async()=>{
                const newStream=await convRef.current.streamMessages()
                for await (const msg of newStream){
                    const exists=messages.find((m)=>m.id===msg.id)
                    if(!exists){
                        setMessages((prevMessages)=>{
                            const msgnew=[...prevMessages,msg]
                            return msgnew
                        })
                    }
                }
            }
            streamMessages()
        }
    },[messages,isOnNetwork])

    useEffect(()=>{
        console.log("signer",signer);
        console.log("address",address);
    },[signer,address])

    return(
        <div>
            {!isConnected &&(
                <div>
                    <ConnectWallet theme='dark' />
                    </div>
            )}

{isConnected && !isOnNetwork &&(
                <div>
                    <ConnectWallet theme='light' />
                    <button onClick={initXmtp}>
                        connect to XMTP
                    </button>
                    </div>
            )}

            {isConnected && isOnNetwork && messages &&(
                <Chat client={clientRef.current} conversation={convRef.current} messageHistory={messages} />
            )}
        </div>
    )
}