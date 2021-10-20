import { Button } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { Firegun, Chat } from "../firegun/index"
import ChatMUI from "./ChatMUI"
import ChatMUIKeyPair from "./ChatMUIKeyPair"
import Login from "./ChatMUILogin"

export default function ChatMUIContainer(props:{
    fg : Firegun,
    chat : Chat
}) {

    const [partners, setPartners] = useState<{show:boolean, data:string}[]>([])
    const [chatMUIPlaceHolder, setchatMUIPlaceHolder] = useState<any[]>([])
    const [alias, setAlias] = useState("")
    const [myPubKey, setMyPubKey] = useState("")

    useEffect(()=>{
    (window as any).fg = props.fg;
    if (props.fg.user) {
        setAlias(props.fg.user.alias);
        setMyPubKey(`${props.fg.user.pair.pub}&${props.fg.user.pair.epub}`)
    }
    },[])

    const closeChat = (index:number) => {
      let tempArray = [...partners]
      tempArray[index].show = false;
      setPartners(tempArray)
    }

    const reOpenChat = (index:number) => {
      let tempArray = [...partners]
      tempArray[index].show = true;
      setPartners(tempArray)
    }

    const addPartnerChat = (key:string) => {
      setchatMUIPlaceHolder([...chatMUIPlaceHolder, <ChatMUI key={key} fg={props.fg} chat={props.chat} partnerKey={key} show={true} />])
    }

    return (
        <>
            { (props.fg.user.alias) ? 
              <div style={{width : "500px", height:"600px",  margin: "auto"}}>
                <ChatMUIKeyPair addPartnerChat={addPartnerChat} reOpenChat={reOpenChat} myPubKey={myPubKey} setPartners={setPartners} />
                {chatMUIPlaceHolder}                
              </div>
            : <Login fg={props.fg} setAlias={setAlias} setMyPubKey={setMyPubKey} /> }
        </>
    )
}