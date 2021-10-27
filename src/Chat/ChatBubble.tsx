import { Delete, Undo } from "@mui/icons-material";
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import makeStyles from "@mui/styles/makeStyles";
import download from "downloadjs"

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
        self : boolean,
        text : string,
        timestamp : string,
        chatID : string,
        deleteChat : (chatID:string, timestamp:string) => void,
        unsentChat : (chatID:string, timestamp:string) => void,
    }
) {
    const classes = useStyles();

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
            return (<Typography variant="body2">{props.text}</Typography>)
        }
    }

    const deleteChat = (chatID:string,timestamp:string) => {
        props.deleteChat (chatID, timestamp);
    }

    const unsentChat = (chatID:string,timestamp:string) => {
        props.unsentChat (chatID, timestamp);
    }

    const Operation = (props:{chatID : string,timestamp:string, self:boolean}) => {
        return (
            <Typography variant="body2">
                <Button onClick={()=>{deleteChat(props.chatID,props.timestamp)}} variant="text" size="small" color="warning" startIcon={<Delete />}>Delete</Button>
                {props.self ? <Button onClick={()=>{unsentChat(props.chatID,props.timestamp)}} variant="text" size="small" color="warning" startIcon={<Undo />}>Unsent</Button> : <></>}                
            </Typography>
        )
    }

    return (
        <>
            <Paper className={`${classes.card} ${(props.self ? "self" : "notself")}`} elevation={4}>                
                <ParseText />
                <Typography variant="caption">
                    {props.timestamp}
                </Typography>
                <Operation chatID={props.chatID} timestamp={props.timestamp} self={props.self} />
            </Paper>
        </>        
    )
}