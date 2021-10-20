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

    return (
        <>
            { (props.fg.user.alias) ? 
              <div style={{width : "500px", height:"600px",  margin: "auto"}}>
                <ChatMUIKeyPair reOpenChat={reOpenChat} myPubKey={myPubKey} setPartners={setPartners} />
                {
                  partners.map((val,index)=>{
                    return(
                      <div key={`${val}-${Math.random()}`} style={{display : val.show ? "block" : "none"}} >
                        <ChatMUI fg={props.fg} chat={props.chat} partnerKey={val.data} show={true} />
                        <Button onClick={()=>{closeChat(index)}}>Close Chat</Button>
                      </div>
                    )
                  })
                }
              </div>
            : <Login fg={props.fg} setAlias={setAlias} setMyPubKey={setMyPubKey} /> }
        </>
    )
}