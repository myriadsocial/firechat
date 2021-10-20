import { autocompleteClasses, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({

    card : {
        padding : "10px",
        maxWidth : "100%",
        width : "300px",
        marginBottom : "10px",
        "&.self" : {
            backgroundColor : "darkcyan",
            color : `#fff`,    
        },
        "&.notself" : {
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

    const classes = useStyles();
    return (
        <>
            <Paper className={`${classes.card} ${(props.self ? "self" : "notself")}`} elevation={4}>
                <Typography variant="body2">
                    {props.text}
                </Typography>
                <Typography variant="caption">
                    {props.timestamp}
                </Typography>
            </Paper>
        </>        
    )
}