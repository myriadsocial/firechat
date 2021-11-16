import * as React from 'react';
import BasicModal from './BasicModal';
import TextField from '@mui/material/TextField'
import Add from '@mui/icons-material/Add';
import { Chat, Firegun } from '@yokowasis/firegun';
import { IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';

type MyProps = {
    groupowner : string,
    fg : Firegun,
    groupName : string,
    chat : Chat
}

const InviteButton:React.FC<MyProps> = props => {

    const [keyPair, setKeyPair] = React.useState("");
    const [members, setMembers] = React.useState<{alias : string, pub:string}[]>([]);

    // promises.push(this.firegun.userPut(`chat-group/${groupname}/members`,JSON.stringify([{
    const getMembers = async () => {
        var members = await props.chat.groupGetAdmin(props.groupowner, props.groupName)
        setMembers(members);
    }

    const handleOpen = (cb:()=>void) => {
        cb();
        getMembers();
    }

    const handleSave = async () => {

        let keyPairArr = keyPair.split("&");
        let pubkey;
        let alias;
        if (keyPairArr.length) {
            pubkey = keyPairArr[0];
            if (keyPairArr.length>=3) {
                alias = keyPairArr[2];
            } else {
                alias = keyPairArr[0].slice(0,8);
            }
            await props.chat.groupInviteAdmin(props.groupName,pubkey,alias);
            getMembers();
            console.log('Adding', props.groupName, pubkey, alias);
            setKeyPair("");
        } else {
            console.log ("Keypair Empty");
        }
    }

    const kickMember = async (pubkey:string) => {        
        props.chat.groupBanAdmin(props.groupName,pubkey).then(()=>{
            getMembers();
        })
    }

    return (
        <>
            <BasicModal handleOpen={handleOpen}  handleSave={handleSave} title="Invite New User" btnVariant="text" btnText="ADMIN" btnIcon={<Add />} >
                <List>
                    {
                        members.map((member,i) => 
                            <ListItem key={i}>
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary={member.alias} />
                                <IconButton color="error" size="small" onClick={()=>{kickMember(member.pub)}}>
                                    <Close />
                                </IconButton>
                            </ListItem>
                        )
                    }
                </List>
                <TextField onChange={(e)=>{setKeyPair(e.target.value)}} value={keyPair} fullWidth size="small" sx={{marginBottom : "10px"}} label="Key Pair" />
            </BasicModal>
        </>
    );
}

export default InviteButton;