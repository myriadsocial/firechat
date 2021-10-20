import { Button, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
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
    }
) {

    const [text,setText] = useState("");

    const ParseText = () => {
        if (props.text.indexOf(";base64,")>=0) {
            return (<Typography variant="body2"><Button variant="contained" color="warning" onClick={()=>{download(props.text)}}>Download</Button></Typography>)
        } else {
            return (<Typography variant="body2">{props.text}</Typography>)
        }
    }

    const classes = useStyles();
    return (
        <>
            <Paper className={`${classes.card} ${(props.self ? "self" : "notself")}`} elevation={4}>                
                <ParseText />
                <Typography variant="caption">
                    {props.timestamp}
                </Typography>
            </Paper>
        </>        
    )
}