import { Button, Divider, Grid, TextareaAutosize, TextField, Typography } from "@mui/material"
import { useState } from "react"

export default function ChatMUIKeyPair (props:{
    myPubKey:string,
    setPartners: React.Dispatch<React.SetStateAction<string[]>>
}) {

    const [text,setText] = useState("")
    const [partners, setpartners] = useState<string[]>([])

    const addArray = () => {
        props.setPartners(arr=>{
            return [...arr, text]
          })
      }
    
    return (
        <>
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