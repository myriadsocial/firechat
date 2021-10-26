import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useEffect, useRef} from "react"

export default function ChatMUIKeyPair (props:{
    reOpenChat : (key:string) => void,
    addPartnerChat : (key:string, alias:string) => void,
    myPubKey:string,
    setPartners: React.Dispatch<React.SetStateAction<{show:boolean, data:string}[]>>,
    newPartnerKeyPair : string,
    setNewPartnerKeyPair : React.Dispatch<React.SetStateAction<string>>,
    alias:string
}) {

    const listPartners = useRef<string[]>([])

    const addArray = () => {

        let chatmui = document.getElementsByClassName('chatmui show');
        for (let i = 0; i < chatmui.length; i++) {
            chatmui[i].classList.remove('show');
        }

        let index = listPartners.current.indexOf(props.newPartnerKeyPair);

        let keys = props.newPartnerKeyPair.split("&");
        let alias:string;
        if (keys.length === 3) {
            alias = keys[2];
        } else {
            alias = props.newPartnerKeyPair.slice(0,8);
        }

        if (index>=0) {
            props.reOpenChat(props.newPartnerKeyPair)
        } else {
            props.addPartnerChat(props.newPartnerKeyPair,alias)
            listPartners.current.push(props.newPartnerKeyPair);    
        }
    }

    useEffect(()=>{
        addArray()
    },[props.newPartnerKeyPair])
    
    return (
        <>            
            <Grid mb={3} container direction="column" spacing={2} alignItems="center">                
                <Grid container direction="row" item textAlign="center" justifyContent="center" alignItems="center">
                    <Grid xs="auto" item><Avatar alt={props.alias} src={`https://avatars.dicebear.com/api/human/${props.alias}.svg`} /></Grid>
                    <Grid xs="auto" item container direction="column">
                        <Grid item><Typography>{props.alias}</Typography></Grid>
                        <Grid item><Button onClick={()=>{navigator.clipboard.writeText(props.myPubKey)}} variant="text">Copy</Button></Grid>
                    </Grid>
                </Grid>
                    <TextField id="muiPartnerKeyPair" size="small" variant="outlined" value={props.newPartnerKeyPair} onChange={(e)=>{props.setNewPartnerKeyPair(e.target.value)}} label="Partner Keypair" />
                <Grid />
            </Grid>
        </>
    )
}