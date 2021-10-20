import { useEffect, useState } from "react"
import { Firegun, Chat } from "../firegun/index"
import ChatMUI from "./ChatMUI"
import ChatMUIKeyPair from "./ChatMUIKeyPair"
import Login from "./ChatMUILogin"

export default function ChatMUIContainer(props:{
    fg : Firegun,
    chat : Chat
}) {

    const [partners, setPartners] = useState<string[]>([])
    const [alias, setAlias] = useState("")
    const [myPubKey, setMyPubKey] = useState("")

    useEffect(()=>{
    (window as any).fg = props.fg;
    if (props.fg.user) {
        setAlias(props.fg.user.alias);
        setMyPubKey(`${props.fg.user.pair.pub}&${props.fg.user.pair.epub}`)
    }    
    },[])

    return (
        <>
            { (props.fg.user.alias) ? 
              <div style={{width : "500px", height:"600px",  margin: "auto"}}>
                <ChatMUIKeyPair myPubKey={myPubKey} setPartners={setPartners} />
                {
                  partners.map((val,index)=>{
                    return(
                      <ChatMUI key={val} fg={props.fg} chat={props.chat} partnerKey={val} />
                    )                  
                  })
                }
              </div>
            : <Login fg={props.fg} setAlias={setAlias} setMyPubKey={setMyPubKey} /> }
        </>
    )
}