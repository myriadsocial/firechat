import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Send from '@mui/icons-material/Send'
import AttachFile from '@mui/icons-material/AttachFile'
import Close from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Firegun, Chat, common } from "@yokowasis/firegun"
import { chatType } from "@yokowasis/firegun/common"
import ChatBubble from "./ChatBubble"
import Delete from '@mui/icons-material/Delete'
import InviteButton from './InviteButton'

type ChatMUIProps = {
    partnerKey : string,
    height : string,
    fg : Firegun,
    chat : Chat,
    show : boolean,
    alias : string,
    isGroup? : boolean,
    groupName? : string,
    updateLastMsg : (key:string,lastMsg:string) => void,
}

export default function ChatMUI(props:ChatMUIProps) {

    const [textMsg, setTextMsg] = useState("");
    const [chatsMessages, setChatsMessages] = useState<chatType[]>([]);
    const [chatsMessagesDiv, setChatsMessagesDiv] = useState<JSX.Element>(<></>);

    const yourPub = useRef("");
    const yourEpub = useRef("");
    const yourCert = useRef("");
    const chatBubbleRef = useRef<{[x:string] : HTMLDivElement | null}>({})

    useEffect(()=>{
        // INIT FIRST TIME ONLY

        var keys:string[];
        if (props.partnerKey.indexOf("&")>=0) {
            keys = props.partnerKey.split("&");            
            (async ()=>{
                if (!props.isGroup) {
                    let cert = await props.chat.getCert(keys[0]);
                    yourCert.current = (typeof cert === "string") ? cert : "";
                }
            })()
            yourPub.current = keys[0];
            yourEpub.current = keys[1];

            let dateNow = common.getDate()
            if (props.isGroup) {
                console.log ("CHAT GROUP ON !!!");
                let keys = props.partnerKey.split("&")
                let owner = keys[1];
                let alias = keys[2];    

                // Get Chat Members
                // promises.push(this.firegun.userPut(`chat-group/${groupname}/members`,JSON.stringify([{
                
                props.fg.Get(`~${owner}/chat-group/${alias}/members`)
                .then(async (membersJSON) => {
                    if (typeof membersJSON === "string") {
                        let members:{"alias": string, "pub" : string}[];
                        members = JSON.parse(membersJSON);
                        members.forEach(async (member) => {
                            props.fg.gun.get(`~${member.pub}`).get("chat-group-with").get(`${owner}&${alias}`).get(dateNow.year).get(dateNow.month).get(dateNow.date).map().once(async (s)=>{
                                if (s) {
                                    processChat(s,keys,member.pub === props.fg.user.pair.pub);
                                }                        
                            })            
                        })
                    }
                })
            } else {
                // Chat 1 on 1
                props.fg.gun.user().get("chat-with").get(yourPub.current).get(dateNow.year).get(dateNow.month).get(dateNow.date).get("unsendChat").on((chatID)=>{
                    deleteBubleChat(chatID);
                })
                props.fg.gun.user().get("chat-with").get(yourPub.current).get(dateNow.year).get(dateNow.month).get(dateNow.date).map().once(async (s)=>{
                    if (s) {
                        processChat(s,keys);
                    }                        
                })    
            }
        } else {
            console.log ("Partner Key Incomplete")
        }
    },[])

    useEffect(()=>{
        // Scroll to end
        var objDiv = document.getElementById(`chatbox-${props.partnerKey.slice(0,8)}`);
        if (objDiv) 
            objDiv.scrollTop = objDiv.scrollHeight;
    },[chatsMessagesDiv])
    
    useEffect(()=>{
        // UpdateChatDiv
        if (chatsMessages.length) {
            let lastMsg = chatsMessages[chatsMessages.length-1].msg;
            if (typeof lastMsg === "string") {            
                localStorage.setItem(`fg.lastMsg.${props.partnerKey.slice(0,8)}`,`${lastMsg.slice(0,30)}...`);
                props.updateLastMsg(props.partnerKey.slice(0,8),`${lastMsg.slice(0,12)}...`);
            }    
        }
        setChatsMessagesDiv(
            <>
                {
                    chatsMessages.map((val)=>
                            <div key={`${val.timestamp}-${Math.random()}`} ref={(el)=>{chatBubbleRef.current[val.id] = el; return chatBubbleRef.current[val.id]}}>
                                {
                                    (props.isGroup) ?
                                        <ChatBubble deleteChat={console.log} unsentChat={console.log} chatID={val.id} self={val._self} text={val.msg} timestamp={val.timestamp} />
                                    :
                                        <ChatBubble deleteChat={deleteChat} unsentChat={unsentChat} chatID={val.id} self={val._self} text={val.msg} timestamp={val.timestamp} />
                                }                                
                            </div>    
                    )
                }
            </>
        )
    },[chatsMessages])

    const deleteBubleChat = (chatID:string) => {
        const myArray = chatsMessages.filter(function( obj ) {
            return obj.timestamp.replace(/\//g,".") !== chatID;
        });
        setChatsMessages(myArray);
    }

    const deleteMultiBubleChat = (chatIDS:string[]) => {
        const myArray = chatsMessages.filter(function( obj ) {
            return !chatIDS.includes(obj.timestamp.replace(/\//g,"."));
        });
        setChatsMessages(myArray);
    }

    const processChat = async (s:{[x:string] : any},keys:string[], alwaysSelf? : boolean) => {
        if (s.msg) {
            if ((typeof s.msg === "string") && (s.msg.search("SEA") === 0))
            if (s._self) {
                s.msg = await props.fg.Gun.SEA.decrypt(s.msg, props.fg.user.pair);
            } else {
                s.msg = await props.fg.Gun.SEA.decrypt(s.msg, await (props.fg.Gun as any).SEA.secret(keys[1], props.fg.user.pair));
            }
            
            setChatsMessages(chatsMessages=>{
                let chatsTemp = chatsMessages.filter(function( obj ) {
                    return obj.timestamp !== 'sending...';
                });
                chatsTemp.push({_self : (typeof alwaysSelf !== "undefined" ? alwaysSelf : s._self), msg : s.msg, timestamp: s.timestamp, id : s.id});
                chatsTemp.sort(common.dynamicSort("timestamp"));
    
                chatsTemp = chatsTemp.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.timestamp === thing.timestamp
                    ))
                )
            
                // GO To UpdateChatDiv
                return chatsTemp;
            })            
        }
    }

    const sendChat = async () => {

        setTextMsg("");
        console.log ("Sending Chat...")

        processChat({_self : true, msg: textMsg, timestamp : "sending..."},[yourPub.current,yourEpub.current])

        // Check apakah group send
        if (props.isGroup) {
            let keys = props.partnerKey.split("&")
            let owner = keys[1];
            let alias = keys[2];
            await props.chat.groupSend(owner,alias,textMsg);
            console.log ("SendGroup ✔");
        } else {
            await props.chat.send({pub : yourPub.current, epub: yourEpub.current},textMsg,yourCert.current);
        }

        console.log ("Sending Chat... Success")

    }

    const deleteChat = (chatID:string, timestamp:string) => {
        const pubkey = props.partnerKey.split("&")[0]
        const date = timestamp.split("T")[0];
        props.fg.userDel(`chat-with/${pubkey}/${date}/${chatID}`)
        console.log ("DELETE", `chat-with/${pubkey}/${date}/${chatID}`);
        deleteBubleChat(chatID);
    }

    const deleteMultiChat = async (chatsArray : {chatID:string, timestamp:string}[]) => {
        const pubkey = props.partnerKey.split("&")[0]
        let chatIDs:string[] = [];
        for (const val of chatsArray) {
            console.log (val);
            const date = val.timestamp.split("T")[0];
            // Pake await biar tidak terlalu kencang deletenya, biar database tidak corrupt
            await props.fg.userDel(`chat-with/${pubkey}/${date}/${val.chatID}`)
            console.log ("DELETE", `chat-with/${pubkey}/${date}/${val.chatID}`);
            chatIDs.push(val.chatID);            
        }
        console.log(chatIDs);
        deleteMultiBubleChat(chatIDs)
    }

    const unsentChat = (chatID:string, timestamp:string) => {
        const pubkey = props.partnerKey.split("&")
        const date = timestamp.split("T")[0];
        props.chat.unsend({ pub : pubkey[0], epub : pubkey[1]},date,chatID,yourCert.current);
        console.log ("UNSENT", pubkey, date, chatID);
        deleteBubleChat(chatID);
    }

    const attachFile = async () => {
        function getBase64(file:any) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            let fileInfo = {
                name : file.name,
                size : file.size,
                type : file.type,                
            }
            reader.onload = function () {
                let data = {
                    info : fileInfo,
                    content : reader.result,
                }
                setTextMsg(JSON.stringify(data));
            };
            reader.onerror = function (error) {
              console.log('Error: ', error);
            };
         }
         
         let file:any = (document.getElementById(`file-${props.partnerKey.slice(0,8)}`) as any)
         getBase64(file.files[0]);
    }

    const deleteAll = () => {
        let listElements = document.getElementsByClassName("bubbleChecked");
        let chatsArray:{chatID:string, timestamp:string}[] = [];
        for (let i = 0; i < listElements.length; i++) {
            let elem:HTMLElement = (listElements[i] as any);
            let id = elem.dataset.chatid;
            if (id) {
                chatsArray.push({chatID:id, timestamp:id.replace(/\./g,"/")});
            }            
        }
        deleteMultiChat(chatsArray)
    }

    return (
        <>
            <Grid
            container
            direction="column"
            height={props.height}
            spacing={2}
            display={props.show ? "block" : "none"}
            >
                <Grid container item textAlign="center" fontWeight="bold"  justifyContent="space-between">
                    <Grid item style={{marginRight : "auto"}}>
                        {/* Chat Date History */}
                    </Grid>
                    <Grid item xs>
                        <Typography pt={1}>
                            {props.isGroup ? props.groupName : props.alias}
                        </Typography>
                    </Grid>
                    <Grid item>
                        {
                            props.isGroup ?
                            <InviteButton chat={props.chat} groupName={props.groupName || ""} />
                            :
                            <></>
                        }                        
                        <IconButton color="error" onClick={deleteAll}><Delete /></IconButton>
                        <IconButton color="error" onClick={()=>{
                            let elem = document.getElementById(`chatmui-${props.partnerKey}`);
                            if ( elem !== null) {
                                elem.style.display = 'none'
                            }
                        }}><Close /></IconButton>
                    </Grid>
                </Grid>
                <Grid>
                    <Divider />
                </Grid>
                <Grid item height={props.height} style={{overflowY : "scroll"}} id={`chatbox-${props.partnerKey.slice(0,8)}`}>
                    <div style={{padding : "5px 20px"}}>
                    {chatsMessagesDiv}
                    </div>
                </Grid>
                <Grid item container justifyContent="space-between">
                    <Grid item xs>
                        <TextField
                            fullWidth
                            label="Chat"
                            variant="standard"
                            value={textMsg}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ setTextMsg( e.target.value )}}
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>)=>{if (e.code === "Enter") {sendChat()}}}
                        />
                    </Grid>
                    <Grid pt={1.5} item>
                        <input style={{display: "none"}} type="file" id={`file-${props.partnerKey.slice(0,8)}`} onChange={attachFile} />
                        <Button
                            color="primary"
                            variant="text"
                            onClick={()=>{(document.getElementById(`file-${props.partnerKey.slice(0,8)}`) as any).click()}}
                            endIcon={<AttachFile />}
                        ></Button>
                        <Button
                            color="primary"
                            variant="contained"
                            endIcon={<Send />}
                            onClick={sendChat}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}    
