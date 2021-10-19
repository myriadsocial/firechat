import { Gun, Chat, Firegun } from './firegun/firegun'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import { Send, AttachFile, FiveG } from '@mui/icons-material'
import { Divider } from '@mui/material'


type ChatMUIProps = {
    partnerKey : string,
    fg : Firegun,
    chat : Chat,
}

type chatType = {
    _self : boolean, 
    msg : string, 
    timestamp: string,
}

function dynamicSort(property:string) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a:any,b:any) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export function ChatMUI(props:ChatMUIProps) {

    const [textMsg, setTextMsg] = useState("");
    const [chatsMessages, setChatsMessages] = useState<chatType[]>([]);

    var 
        yourPub : string,
        yourEpub : string,
        yourCert:string;

    useEffect(()=>{
        // INIT FIRST TIME ONLY

        var keys:string[];
        if (props.partnerKey.indexOf("&")>=0) {
            keys = props.partnerKey.split("&")
            props.chat.getCert(keys[0])
            .then(cert=>{
                yourCert = cert?.toString() || "";
                console.log (yourCert);
            })
            yourPub = keys[0];
            yourEpub = keys[1];

            let dateNow = getDate()
            props.fg.gun.user().get("chat-with").get(yourPub).get(dateNow.year).get(dateNow.month).get(dateNow.date).map().once(async (s)=>{
                if (s) {
                    console.log (s);
                    // processChat(s,keys);
                }                        
            })
        } else {
            console.log ("Partner Key Incomplete")
        }
    },[])

    const processChat = async (s:{[x:string] : any},keys:string[]) => {
        if ((s.msg as string).search("SEA") === 0)
        if (s._self) {
            s.msg = await Gun.SEA.decrypt(s.msg, props.fg.user.pair);
        } else {
            s.msg = await Gun.SEA.decrypt(s.msg, await (Gun as any).SEA.secret(keys[1], props.fg.user.pair));
        }

        setChatsMessages(chatsMessages=>{
            let chatsTemp = chatsMessages;
            chatsTemp = chatsTemp.filter(function( obj ) {
                console.log (obj);
                return obj.timestamp !== 'sending...';
            });
            chatsTemp.push({_self : s._self, msg : s.msg, timestamp: s.timestamp});
            chatsTemp.sort(dynamicSort("timestamp"));
            updateChatDiv
            return chatsTemp;
        })
    }

    const getDate = () => {
        let currentdate = new Date(); 
        let year = currentdate.getFullYear();
        let month  = ((currentdate.getMonth()+1) < 10) ? "0" + (currentdate.getMonth()+1) : (currentdate.getMonth()+1);
        let date = (currentdate.getDate() < 10) ? "0" + (currentdate.getDate()) : (currentdate.getDate());
        let hour = (currentdate.getHours() < 10) ? "0" + (currentdate.getHours()) : (currentdate.getHours());
        let minutes = (currentdate.getMinutes() < 10) ? "0" + (currentdate.getMinutes()) : (currentdate.getMinutes());
        let seconds = (currentdate.getSeconds() < 10) ? "0" + (currentdate.getSeconds()) : (currentdate.getSeconds());
        let miliseconds = (currentdate.getMilliseconds() < 10) ? "0" + (currentdate.getMilliseconds()) : (currentdate.getMilliseconds());
        return ( {year : year, month : month, date : date, hour : hour, minutes : minutes, seconds : seconds, miliseconds : miliseconds} )
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
                    {yourCertificate}
                    <Divider />
                </Grid>
                <Grid item height='70%' style={{overflowY : "scroll"}}>
                </Grid>
                <Grid item container height='15%'>
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            label="Chat"
                            variant="standard"
                            value={textMsg}
                            onChange={(e)=>{settextMsg(e.target.value)}}                          
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
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}    
