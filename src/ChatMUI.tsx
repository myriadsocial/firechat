import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import { Send, AttachFile} from '@mui/icons-material'
import { Divider } from '@mui/material'
import Gun from 'gun'
import { Firegun, Chat, common } from './firegun/index'
import { chatType } from './firegun/common'



type ChatMUIProps = {
    partnerKey : string,
    fg : Firegun,
    chat : Chat,
}

export function ChatMUI(props:ChatMUIProps) {

    const [textMsg, setTextMsg] = useState("");
    const [chatsMessages, setChatsMessages] = useState<chatType[]>([]);
    const [chatsMessagesDiv, setChatsMessagesDiv] = useState<JSX.Element>(<></>);

    const yourPub = useRef("");
    const yourEpub = useRef("");
    const yourCert = useRef("");

    useEffect(()=>{
        // INIT FIRST TIME ONLY

        var keys:string[];
        if (props.partnerKey.indexOf("&")>=0) {
            keys = props.partnerKey.split("&")
            props.chat.getCert(keys[0])
            .then(cert=>{
                yourCert.current = cert?.toString() || "";
            })
            yourPub.current = keys[0];
            yourEpub.current = keys[1];

            let dateNow = common.getDate()
            props.fg.gun.user().get("chat-with").get(yourPub.current).get(dateNow.year).get(dateNow.month).get(dateNow.date).map().once(async (s)=>{
                if (s) {
                    // console.log (s);
                    processChat(s,keys);
                }                        
            })
        } else {
            console.log ("Partner Key Incomplete")
        }
    },[])

    useEffect(()=>{
        // UpdateChatDiv
        setChatsMessagesDiv(
            <>
                {
                    chatsMessages.map((val)=>
                        <div key={`${val.timestamp}-${Math.random()}`} className={`${val.timestamp} card col-md-7 mb-3 ${val._self ? "text-start bg-primary text-white" : "text-end offset-md-5"}`}>
                            <img className="card-img-top" src="holder.js/100px180/" alt="" />
                            <div className="card-body">
                            <div className="card-text mb-0">
                                <p className="m-0">{val.msg}</p>
                                {/* <p className="m-0" style={{fontSize : "10px"}}><a href='#unsend'>Unsend</a> <a href='#delete'>Delete</a></p> */}
                            </div>
                            <p className="card-text fs" style={{fontSize : "10px"}}>{val.timestamp}</p>
                            </div>
                        </div>
                    )
                }
            </>
        )
        // Scroll to end
        var objDiv = document.getElementById(`chatbox-${props.partnerKey.slice(0,8)}`);
        if (objDiv) 
            objDiv.scrollTop = objDiv.scrollHeight;    
    },[chatsMessages])

    const processChat = async (s:{[x:string] : any},keys:string[]) => {
        if (typeof s.msg === "string") {
            if ((s.msg as string).search("SEA") === 0)
            if (s._self) {
                s.msg = await Gun.SEA.decrypt(s.msg, props.fg.user.pair);
            } else {
                s.msg = await Gun.SEA.decrypt(s.msg, await (Gun as any).SEA.secret(keys[1], props.fg.user.pair));
            }    
        }

        setChatsMessages(chatsMessages=>{
            let chatsTemp = chatsMessages;
            chatsTemp = chatsTemp.filter(function( obj ) {
                return obj.timestamp !== 'sending...';
            });
            chatsTemp.push({_self : s._self, msg : s.msg, timestamp: s.timestamp});
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

    const sendChat = () => {
        props.chat.send({pub : yourPub.current, epub: yourEpub.current},textMsg);
    }

    return (
        <>
            <Grid
            container
            direction="column"
            height="100%"
            spacing={2}
            >
                <Grid item height='10%' textAlign="center" fontWeight="bold">
                    {props.partnerKey.slice(0,8)}
                    <Divider />
                </Grid>
                <Grid item height='70%' style={{overflowY : "scroll"}} id={`chatbox-${props.partnerKey.slice(0,8)}`}>
                    {chatsMessagesDiv}
                </Grid>
                <Grid item container height='15%'>
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            label="Chat"
                            variant="standard"
                            value={textMsg}
                            onChange={(e)=>{setTextMsg(e.target.value)}}                          
                        />
                    </Grid>
                    <Grid pt={1.5} item xs={4}>
                        <Button
                            color="primary"
                            variant="text"
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
