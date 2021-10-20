import { Button, Grid, TextareaAutosize, TextField, Typography} from "@mui/material"
import { useRef, useState } from "react"

export default function ChatMUIKeyPair (props:{
    reOpenChat : (key:string) => void,
    addPartnerChat : (key:string) => void,
    myPubKey:string,
    setPartners: React.Dispatch<React.SetStateAction<{show:boolean, data:string}[]>>
}) {

    const [text,setText] = useState("")

    const listPartners = useRef<string[]>([])

    const addArray = () => {

        let index = listPartners.current.indexOf(text);

        if (index>=0) {
            props.reOpenChat(text)
        } else {
            props.addPartnerChat(text)
            listPartners.current.push(text);    
        }
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