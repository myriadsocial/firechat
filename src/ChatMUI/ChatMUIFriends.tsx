import Friend from "./Friend";

export default function ChatMUIFriends (
    props : {
        setNewPartnerKeyPair : React.Dispatch<React.SetStateAction<string>>
        friends : {
            alias : string,
            lastMsg : string,
            keypair : string
        }[]
    }
    ) {
    return (
        <>
            {props.friends.map((val,index)=>
            <Friend key={index} setNewPartnerKeyPair={props.setNewPartnerKeyPair} alias={val.alias} lastMsg={val.lastMsg} keypair={`${val.keypair}&${val.alias}`} />
            )}
        </>
    )
}