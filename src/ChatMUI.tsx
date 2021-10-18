import { Chat, Firegun } from './firegun/firegun'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Button from '@mui/material/Button'
import { Send, AttachFile, FiveG } from '@mui/icons-material'
import { Divider } from '@mui/material'


type ChatMUIProps = {
    partnerKey : string,
    fg : Firegun,
    chat : Chat,
}

export function ChatMUI(props:ChatMUIProps) {

    const [textMsg, settextMsg] = useState("");

    return (
        <>
            <Grid
            container
            direction="column"
            height="100%"
            spacing={2}
            >
                <Grid item height='10%' textAlign="center">
                    {props.partnerKey}
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
