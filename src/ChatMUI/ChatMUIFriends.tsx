import { Typography } from "@mui/material";
import Friend from "./Friend";

export default function ChatMUIFriends (
    props : {
        setNewPartnerKeyPair : React.Dispatch<React.SetStateAction<string>>
    }
    ) {
    return (
        <>
            <div>
                <Friend setNewPartnerKeyPair={props.setNewPartnerKeyPair} alias="User 1" lastMsg="Hi" keypair={`wUjCcIakgOtaTlCmLikmFS4euogE2q5K43c0TTmRu9U.nay4HCYwZzKBC4DZY_begN0h-15I_cBJtwt8X6ZLCFQ&W8Xg2SvP0WxAHNNoWsWZEdZsQPShgtHcxGVuRKUlClc.3_Rx1JMnGF3rf7MUoXg4MyR__45tYxGqD7v1RfyhzMs`} />
                <Friend setNewPartnerKeyPair={props.setNewPartnerKeyPair} alias="User 2" lastMsg="Apa Kabar ?" keypair="123" />
                <Friend setNewPartnerKeyPair={props.setNewPartnerKeyPair} alias="User 3" lastMsg="Cool" keypair="123" />
            </div>            
        </>
    )
}