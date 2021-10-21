import AddCircle from "@mui/icons-material/AddCircle"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useEffect, useRef, useState } from "react"

export default function ChatMUIKeyPair (props:{
    reOpenChat : (key:string) => void,
    addPartnerChat : (key:string) => void,
    myPubKey:string,
    setPartners: React.Dispatch<React.SetStateAction<{show:boolean, data:string}[]>>,
    newPartnerKeyPair : string,
    setNewPartnerKeyPair : React.Dispatch<React.SetStateAction<string>>
}) {

    const listPartners = useRef<string[]>([])

    const addArray = () => {

        let chatmui = document.getElementsByClassName('chatmui show');
        for (let i = 0; i < chatmui.length; i++) {
            chatmui[i].classList.remove('show');
        }

        let index = listPartners.current.indexOf(props.newPartnerKeyPair);

        if (index>=0) {
            props.reOpenChat(props.newPartnerKeyPair)
        } else {
            props.addPartnerChat(props.newPartnerKeyPair)
            listPartners.current.push(props.newPartnerKeyPair);    
        }
    }

    useEffect(()=>{
        addArray()
    },[props.newPartnerKeyPair])
    
    return (
        <>            
            <Grid mb={3} container direction="column" spacing={2} alignItems="center">
                <Grid item xs textAlign="center">
                    <Typography>My Pairkey: <Button onClick={()=>{navigator.clipboard.writeText(props.myPubKey)}} variant="text">Copy</Button></Typography>
                </Grid>
                <Grid item>
                    <TextField id="muiPartnerKeyPair" style={{marginBottom : "10px", marginRight: "10px"}} size="small" variant="outlined" value={props.newPartnerKeyPair} onChange={(e)=>{props.setNewPartnerKeyPair(e.target.value)}} label="Partner Keypair" />
                </Grid>
            </Grid>
        </>
    )
}