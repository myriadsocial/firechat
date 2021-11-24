import Delete from "@mui/icons-material/Delete";
import Undo from "@mui/icons-material/Undo";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import makeStyles from "@mui/styles/makeStyles";
import download from "downloadjs"
import { chatType } from "@yokowasis/firegun/common";
import React from "react";

const useStyles = makeStyles({

    card : {
        padding : "10px",
        maxWidth : "100%",
        width : "300px",
        marginBottom : "20px",
        "&.self" : {
            textAlign : "left",
            backgroundColor : "darkcyan",
            color : `#fff`,
        },
        "&.notself" : {
            textAlign : "right",
            backgroundColor : "whitesmoke",
            marginLeft : "auto",
            color : `dark`,
        }
    },    
});

export default function ChatBubble(
    props: {
        sender : string,
        status : string,        
        self : boolean,
        text : string,
        timestamp : string,
        chatID : string,
        decryptChat? :(chat:chatType) => Promise<string>,    
        deleteChat : (chatID:string, timestamp:string) => void,
        unsentChat : (chatID:string, timestamp:string) => void,
    }
) {
    const classes = useStyles();

    const [decryptedChat, setDecryptedChat] = React.useState<string>("");

    const ParseText = () => {
        if (typeof props.text === "object" || (typeof props.text === "string" && props.text.indexOf(";base64,")>=0)) {
            var data:any;
            try {

                if (typeof props.text === "object") {
                    data = props.text
                } else {
                    data = JSON.parse(props.text)
                }
                return (
                    <div>
                        <Typography sx={{fontFamily : 'Monospace'}} variant="body2">{data.info.name}</Typography>
                        <Typography sx={{fontFamily : 'Monospace'}} variant="body2">{Math.round(data.info.size / 1000000 * 100) / 100} MB</Typography>
                        {
                            (data.info.type === "image/png") ||
                            (data.info.type === "image/jpg") ||
                            (data.info.type === "image/jpeg")
                            ? <div><img style={{maxWidth:"50%"}} src={data.content} /></div> : ""}
                        <Button style={{margin : "10px"}} variant="contained" color="warning" onClick={()=>{download(data.content,data.info.name,data.info.type)}}>Download</Button>
                    </div>                    
                )
            } catch (error) {
                data = props.text;
                return (<Typography variant="body2"><Button variant="contained" color="warning" onClick={()=>{download(props.text)}}>Download</Button></Typography>)
            }            
        } else {
            if ((typeof props.text === "string") && (props.text.search("SEA") === 0)) {
                let chat:chatType = {
                    _self : props.self,
                    alias : props.sender,
                    msg : props.text,
                    timestamp : props.timestamp,
                    id : props.chatID,
                    status : props.status                    
                };
                if (props.decryptChat)
                props.decryptChat(chat)
                .then(s=>{
                    setDecryptedChat(s);
                })
                return (<Typography variant="body2">{decryptedChat}</Typography>)
            } else {
                return (<Typography variant="body2">{props.text}</Typography>)
            }
        }
    }

    const deleteChat = (chatID:string,timestamp:string) => {
        props.deleteChat (chatID, timestamp);
    }

    const unsentChat = (chatID:string,timestamp:string) => {
        props.unsentChat (chatID, timestamp);
    }

    const changeCheckbox = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            e.target.classList.add("bubbleChecked")
        } else {
            e.target.classList.remove("bubbleChecked")
        }
    }

    const Operation = (props:{chatID : string,timestamp:string, self:boolean}) => {
        return (
            <Typography variant="body2">
                <Checkbox onChange={changeCheckbox} className="" inputProps={{ "data-chatid" : props.chatID } as any}  style={{color : "white"}} />
                <IconButton style={{color : "white"}} aria-label="Delete" onClick={()=>{deleteChat(props.chatID,props.timestamp)}}>
                    <Delete />
                </IconButton>
                {props.self ? 
                    <IconButton style={{color : "white"}} aria-label="Unsent" onClick={()=>{unsentChat(props.chatID,props.timestamp)}} >
                        <Undo />
                    </IconButton>
                    : 
                    <></>}                
            </Typography>
        )
    }

    const Sender = () => {
        return (
            <Typography variant="body2">
                {props.sender}
            </Typography>
        )
    }

    return (
        <>
            <Card className={`${classes.card} ${(props.self ? "self" : "notself")}`}>
                <CardContent>
                    <Sender />
                    <ParseText />
                    <Typography component="p" variant="caption">
                        {props.timestamp}
                    </Typography>
                    <Typography component="p" variant="caption">
                        {props.status}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Operation chatID={props.chatID} timestamp={props.timestamp} self={props.self} />
                </CardActions>
            </Card>        
        </>        
    )
}