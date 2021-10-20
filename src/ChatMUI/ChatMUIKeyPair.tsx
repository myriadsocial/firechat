import { Button, Divider, Grid, Paper, TextareaAutosize, TextField, Typography, CardMedia, useTheme } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useState } from "react"

export default function ChatMUIKeyPair (props:{
    myPubKey:string,
    setPartners: React.Dispatch<React.SetStateAction<string[]>>
}) {

    const theme = useTheme()

    const useStyles = makeStyles({
        selfCard: {
            backgroundColor : `${theme.palette.primary.main} !important`,
            color : `${theme.palette.common.white} !important`,
            padding : "10px",
            maxWidth : "100%",
            width : "300px"
        },
    });
    
    const classes = useStyles();

    const [text,setText] = useState("")
    const [partners, setpartners] = useState<string[]>([])

    const addArray = () => {
        props.setPartners(arr=>{
            return [...arr, text]
          })
      }
    
    return (
        <>
            
            <Grid mb={3}>
                <Paper className={classes.selfCard} elevation={4}>
                    <Typography variant="body2">
                        This is a text
                    </Typography>
                </Paper>
            </Grid>
            <Grid mb={3} container direction="column" spacing={2} alignItems="center">
                <Grid item width="100%" textAlign="center">
                    <Typography>My Pairkey:</Typography>
                    <TextareaAutosize value={props.myPubKey} readOnly={true} style={{ width:"100%" }} />
                </Grid>
                <Grid item>
                    <TextField variant="outlined" value={text} onChange={(e)=>{setText(e.target.value)}} label="Partner Keypair" />
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={addArray}>New Chat</Button>
                </Grid>
            </Grid>
        </>
    )
}