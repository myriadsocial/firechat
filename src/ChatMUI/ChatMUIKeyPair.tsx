import { AddCircle } from "@mui/icons-material"
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
                <Grid item xs textAlign="center">
                    <Typography>My Pairkey: <Button onClick={()=>{navigator.clipboard.writeText(props.myPubKey)}} variant="text">Copy</Button></Typography>
                </Grid>
                <Grid item>
                    <TextField style={{marginBottom : "10px", marginRight: "10px"}} size="small" variant="outlined" value={text} onChange={(e)=>{setText(e.target.value)}} label="Partner Keypair" />
                    <Button startIcon={<AddCircle />} variant="contained" onClick={addArray}>Chat</Button>
                </Grid>
            </Grid>
        </>
    )
}