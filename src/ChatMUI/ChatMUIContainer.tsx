import { Button, Container, Grid } from "@mui/material"
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
    const [chatMUIPlaceHolder, setchatMUIPlaceHolder] = useState<JSX.Element[]>([])
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

    const reOpenChat = (key:string) => {
      let elem = document.getElementById(`chatmui-${key}`);
      if ( elem !== null) {
        elem.style.display = 'block'
      }
    }

    const addPartnerChat = (key:string) => {
      setchatMUIPlaceHolder([...chatMUIPlaceHolder, 
        <div className="chatmui" id={`chatmui-${key}`} key={key}>
          <ChatMUI height="100vh" fg={props.fg} chat={props.chat} partnerKey={key} show={true} />
        </div>
      ])
    }

    return (
        <>
            { (props.fg.user.alias) ? 
              <Container>
                <Grid container spacing={2}>
                  <Grid xs={2} sm={4} item>
                    <ChatMUIKeyPair addPartnerChat={addPartnerChat} reOpenChat={reOpenChat} myPubKey={myPubKey} setPartners={setPartners} />
                  </Grid>
                  <Grid xs={10} sm={8} item>
                    {chatMUIPlaceHolder}
                  </Grid>
                </Grid>                
                
              </Container>
            : <Login fg={props.fg} setAlias={setAlias} setMyPubKey={setMyPubKey} /> }
        </>
    )
}