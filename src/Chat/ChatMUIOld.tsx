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
import AddAdminButton from './AddAdminButton'
import EditGroupChat from './EditGroupChat'
import { RefreshRounded, Search } from '@mui/icons-material'

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
    const [groupOwner, setGroupOwner] = useState("");
    const [groupAlias, setgroupAlias] = useState("");
    const [searchString, setSearchString] = useState("");

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

                setGroupOwner(owner);
                setgroupAlias(alias);

                // Get Chat Members
                props.chat.groupRetrieveChat({ owner : owner, alias: alias}, { date : dateNow.date, month : dateNow.month, year : dateNow.year.toString() },processChat)                
            } else {
                // Chat 1 on 1

                // Listen jika sewaktu - waktu partner melakukan unsent Chat
                props.fg.gun.user().get("chat-with").get(yourPub.current).get(dateNow.year).get(dateNow.month).get(dateNow.date).get("unsendChat").on((chatID)=>{
                    deleteBubleChat(chatID);
                })

                // Listen to chat node. Proses chat yg masuk
                props.chat.retrieve({ pub : yourPub.current, epub : yourEpub.current},  { date : dateNow.date, month: dateNow.month, year : dateNow.year.toString()},processChat);
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
                                    // (props.isGroup) ?
                                    //     <ChatBubble deleteChat={console.log} unsentChat={console.log} chatID={val.id} self={val._self} text={val.msg} timestamp={val.timestamp} />
                                    // :
                                    //     <ChatBubble deleteChat={deleteChat} unsentChat={unsentChat} chatID={val.id} self={val._self} text={val.msg} timestamp={val.timestamp} />
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

    const processChat = async (s:{[x:string] : any}, alwaysSelf? : boolean) => {
        setChatsMessages(chatsMessages=>{
            let chatsTemp = chatsMessages.filter(function( obj ) {
                return obj.timestamp !== 'sending...';
            });
            // chatsTemp.push({_self : (typeof alwaysSelf !== "undefined" ? alwaysSelf : s._self), msg : s.msg, timestamp: s.timestamp, id : s.id});
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

    const sendChat = async () => {

        setTextMsg("");
        console.log ("Sending Chat...")

        processChat({_self : true, msg: textMsg, timestamp : "sending..."})

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
                        <TextField onChange={(e)=>{ setSearchString(e.target.value) }} label="Search" size="small" variant="standard" sx={{paddingBottom : "10px"}} /> <IconButton color="primary" onClick={()=>{ props.chat.searchChat(searchString,yourPub.current,yourEpub.current,(s)=>{console.log(s)}) }}><Search /> </IconButton>
                    </Grid>
                    <Grid item xs>
                        <Typography pt={1}>
                            {props.isGroup ? props.groupName : props.alias}
                        </Typography>
                    </Grid>
                    <Grid item>
                        {
                            // Harusnya di sini isGroup dan isAdmin
                            props.isGroup ?
                            <>
                                <EditGroupChat groupowner={groupOwner} groupname={groupAlias} chat={props.chat} fg={props.fg} common={common} />
                                <AddAdminButton groupowner={groupOwner} fg={props.fg} chat={props.chat} groupName={groupAlias} />
                                <InviteButton groupowner={groupOwner} fg={props.fg} chat={props.chat} groupName={groupAlias} />                                
                            </>                            
                            :
                            <></>
                        }                        
                        <IconButton color="primary" onClick={()=>{ props.fg.clearData() }}><RefreshRounded /></IconButton>
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
