import Friend from "./Friend";

export default function ChatMUIFriends (
    props : {
        setNewPartnerKeyPair : React.Dispatch<React.SetStateAction<string>>
        friends : 
        {
            [key : string] : {
                alias : string,
                lastMsg : string,
                keypair : string    
            }
        }
    }
    ) {
    return (
        <>
            {Object.entries(props.friends).map(([index,val])=>
                <Friend key={index} setNewPartnerKeyPair={props.setNewPartnerKeyPair} alias={val.alias} lastMsg={val.lastMsg} keypair={`${val.keypair}&${val.alias}`} />
            )}
        </>
    )
}