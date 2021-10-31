import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react"
import { Firegun, Chat, common } from "../firegun"
import ChatMUI from "./ChatMUI"
import ChatMUIKeyPair from "./ChatMUIKeyPair"
import Login from "./ChatMUILogin"
import Friends from "./ChatMUIFriends"
import makeStyles from "@mui/styles/makeStyles";
import GroupChat from './GroupChat';

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
    chat : Chat,
    common? : typeof common,
    newChat? : string
}) {

    const partners = useState<{show:boolean, data:string}[]>([])
    const setPartners = partners[1];
    const [chatMUIPlaceHolder, setchatMUIPlaceHolder] = useState<JSX.Element[]>([])
    const [alias, setAlias] = useState("")
    const [newPartnerKeyPair, setNewPartnerKeyPair] = useState("")
    const [myPubKey, setMyPubKey] = useState("")
    const [friends, setFriends] = useState<
      {
        [key : string] : {
          alias : string,
          lastMsg : string,
          keypair : string    
        }
      }
    >({})
    const [myGroups, setMyGroups] = useState<
      {
        [key : string] : {
          owner : string,
          alias : string,
          lastMsg : string,
          keypair : string,
        }
      }
    >({})
    const classes = useStyles();

    const getFriends = async () => {
      let friends
      try {
        friends = await props.fg.userGet("chat-with");        
      } catch (error) {
        friends = {}        
      }
      let dataFriends:{[key:string] : {
        keypair : string,
        alias : string,
        lastMsg : string,
      }} = {};
      if (typeof friends === "object")
      for (const pubkey in friends) {
        if (pubkey != "_")
        if (Object.prototype.hasOwnProperty.call(friends, pubkey)) {
          let data;
          try {
            data = await props.fg.Get(`~${pubkey}`);            
          } catch (error) {
            data = {};
          }
          if (typeof data === "object")
          if (data.pub && typeof data.pub === "string")            
          dataFriends[data.pub.slice(0,8)] = {
            keypair : `${data.pub}&${data.epub}`,
            alias : (data.alias) ? data.alias.toString() : "",
            lastMsg : localStorage.getItem(`fg.lastMsg.${data.pub.slice(0,8)}`) || "",
          };
        }
      }
      setFriends(dataFriends);
    }

    const getMyGroups = async () => {
      let groups
      try {
        groups = await props.fg.userGet("chat-group-with");
      } catch (error) {
        groups = {}        
      }
      if (typeof groups === "object")

      var groupsName:typeof myGroups;
      groupsName = {};
      if (typeof groups === "object")
      for (const groupName in groups) {
        if (groupName != "_" && groupName != "#")
        if (Object.prototype.hasOwnProperty.call(groups, groupName)) {
          const groupPath = groupName.split("&");
          const group = {
            owner : groupPath[0],
            alias : groupPath[1],
            lastMsg : "",
            keypair : `group&${groupName}`,
          }
          groupsName[groupName] = group
        }
      }
      setMyGroups(groupsName);
    }

    useEffect(()=>{
      (window as any).fg = props.fg;

      if (props.fg.user) {
          // AutoLogin
          setAlias(props.fg.user.alias);
          setMyPubKey(`${props.fg.user.pair.pub}&${props.fg.user.pair.epub}`)          
          getFriends();
          getMyGroups();
          // getOtherGroups();
      }

      if (props.newChat) {
        setNewPartnerKeyPair(props.newChat);
      }      
    },[])

    const reOpenChat = (key:string) => {
      let elem = document.getElementById(`chatmui-${key}`);
      if ( elem !== null) {
        elem.classList.add('show');
      }
    }

    const updateLastMsg = (key:string,lastMsg:string) => {
        let arr = { ...friends }
        if (arr && arr[key]) {
          arr[key].lastMsg = lastMsg;
          setFriends(arr);  
        } else {
          // Belum terdaftar sebagai friends di sidebar, add dulu
          getFriends();
        }
    }

    const addPartnerChat = (key:string, alias:string) => {
      setchatMUIPlaceHolder([...chatMUIPlaceHolder, 
        <div className={`${classes.chatmui} chatmui show`} id={`chatmui-${key}`} key={key}>
          <ChatMUI updateLastMsg={updateLastMsg} alias={alias} height="500px" fg={props.fg} chat={props.chat} partnerKey={key} show={true} isGroup={key.indexOf("group") === 0} />
        </div>
      ])
    }

    const newGroup = (name:string,desc:string,image:string) => {
      console.log ("NEW GROUP", name, desc, image);
      props.chat.groupNew(name,desc,image);
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
                        alias={alias}
                      /></Grid>
                    <Grid item>
                      {props.common ? <GroupChat newGroup={newGroup} common={props.common}/> : <></>}
                    </Grid>
                    <Grid item>
                      <Friends
                        setNewPartnerKeyPair={setNewPartnerKeyPair}
                        friends={friends}
                      />
                      <Friends
                        setNewPartnerKeyPair={setNewPartnerKeyPair}
                        friends={myGroups}
                      />
                      {/* <MyGroups
                        setNewPartnerKeyPair={setNewPartnerKeyPair}
                        friends={myGroups}
                      />
                      <OtherGroups
                        setNewPartnerKeyPair={setNewPartnerKeyPair}
                        friends={otherGroups}
                      /> */}
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