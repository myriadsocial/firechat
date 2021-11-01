import * as React from 'react';
import BasicModal from './BasicModal';
import TextField from '@mui/material/TextField'
import Add from '@mui/icons-material/Add';
import { Chat } from '@yokowasis/firegun';

type MyProps = {
    groupName : string,
    chat : Chat
}

const AddAdminButton:React.FC<MyProps> = props => {

    const [keyPair, setKeyPair] = React.useState("");

    const handleSave = (cb:()=>void) => {
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
            props.chat.groupInvite(props.groupName,pubkey,alias).then(cb);
            console.log('Adding', props.groupName, pubkey, alias);
            cb();    
        } else {
            console.log ("Keypair Empty");
            cb();
        }
    }

    return (
        <>
            <BasicModal  handleSave={handleSave} title="Add Admin" btnVariant="text" btnText="Admin" btnIcon={<Add />} >
                <TextField onChange={(e)=>{setKeyPair(e.target.value)}} fullWidth size="small" sx={{marginBottom : "10px"}} label="Key Pair" />
            </BasicModal>
        </>
    );
}

export default AddAdminButton;