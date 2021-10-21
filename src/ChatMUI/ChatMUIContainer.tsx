import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import { useEffect, useRef, useState } from "react"
import { Firegun, Chat } from "@yokowasis/firegun"
import ChatMUI from "./ChatMUI"
import ChatMUIKeyPair from "./ChatMUIKeyPair"
import Login from "./ChatMUILogin"
import Friends from "./ChatMUIFriends"
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({

  chatmui : {
    display : "none",
    "&.show" : {
      display : "block"
    }
  },    
});

export default function ChatMUIContainer(props:{
    fg : Firegun,
    chat : Chat
}) {

    const [partners, setPartners] = useState<{show:boolean, data:string}[]>([])
    const [chatMUIPlaceHolder, setchatMUIPlaceHolder] = useState<JSX.Element[]>([])
    const [alias, setAlias] = useState("")
    const [newPartnerKeyPair, setNewPartnerKeyPair] = useState("")
    const [myPubKey, setMyPubKey] = useState("")
    const classes = useStyles();

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
        elem.classList.add('show');
      }
    }

    const addPartnerChat = (key:string) => {
      setchatMUIPlaceHolder([...chatMUIPlaceHolder, 
        <div className={`${classes.chatmui} chatmui show`} id={`chatmui-${key}`} key={key}>
          <ChatMUI height="500px" fg={props.fg} chat={props.chat} partnerKey={key} show={true} />
        </div>
      ])
    }

    return (
        <>
            { (props.fg.user.alias) ? 
              <Container>
                <Grid container spacing={2} textAlign="center">
                  <Grid xs={12} sm={4} item container direction="column">
                    <Grid item>
                      <ChatMUIKeyPair 
                        addPartnerChat={addPartnerChat} 
                        reOpenChat={reOpenChat} 
                        myPubKey={myPubKey} 
                        setPartners={setPartners} 
                        newPartnerKeyPair={newPartnerKeyPair}
                        setNewPartnerKeyPair={setNewPartnerKeyPair}
                      /></Grid>
                    <Grid item>
                      <Friends
                        setNewPartnerKeyPair={setNewPartnerKeyPair}
                      />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={8} item>
                    {chatMUIPlaceHolder}
                  </Grid>
                </Grid>                
                
              </Container>
            : <Login fg={props.fg} setAlias={setAlias} setMyPubKey={setMyPubKey} /> }
        </>
    )
}