import { Chat, Firegun } from './firegun/firegun'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Button from '@mui/material/Button'
import { Send } from '@mui/icons-material'


type ChatMUIProps = {
    fg : Firegun,
    chat : Chat
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
                <Grid item height='90%' style={{overflowY : "scroll"}}>
                </Grid>
                <Grid item container height='7%'>
                    <Grid item xs={8}>
                        <TextField
                          fullWidth
                          label="Chat"
                          variant="standard"
                          value={textMsg}
                          onChange={(e)=>{settextMsg(e.target.value)}}                          
                        />
                    </Grid>
                    <Grid item xs={4}>
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