import { Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Grid from "@mui/material/Grid"

export default function Friend (props:{
    alias : string,
    lastMsg : string,
    keypair : string
    setNewPartnerKeyPair : React.Dispatch<React.SetStateAction<string>>
}) {

    const click = () => {
        let muiNewChat = document.getElementById('muiNewChat');

        props.setNewPartnerKeyPair(props.keypair)
    
        if (muiNewChat) {
            muiNewChat.click();            
        }

    }

    return (
        <>
            <div style={{textAlign : "left"}} onClick={click}>
                <Grid container spacing={1} mb={3}>
                    <Grid item><Avatar alt={props.alias} src={`https://avatars.dicebear.com/api/human/${props.alias}.svg`} /></Grid>
                    <Grid item container direction="column" xs>
                        <Grid><Typography variant="body2">{props.alias}</Typography></Grid>
                        <Grid><Typography variant="caption">{props.lastMsg}</Typography></Grid>
                    </Grid>
                </Grid>
            </div>            
        </>
    )
}