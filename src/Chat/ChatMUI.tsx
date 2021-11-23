import { Chat, common, Firegun } from "@yokowasis/firegun";
import React from "react";

export default function ChatMUI(
    props : {
        partnerKey : string,
        height : string,
        fg : Firegun,
        chat : Chat,
        show : boolean,
        alias : string,
        isGroup? : boolean,
        groupName? : string,
        updateLastMsg : (key:string,lastMsg:string) => void,
    }) 
{

    // React Ref
    const partner = React.useRef({
        cert : "",
        pub : "",
        epub : "",
        groupOwner : "",
        groupAlias : "", 
    })

    // Init First Time
    React.useEffect(()=>{
        (async ()=>{
            if (props.partnerKey.indexOf("&")>=0) {

                let dateNow = common.getDate()
    
                if (props.isGroup) {
                    // Group Chat
                } else {
                    // 1 on 1 Chat
                    let keys:string[];
                    keys = props.partnerKey.split("&");            
                    let cert = await props.chat.getCert(keys[0]);                        
                    partner.current.cert = (typeof cert === "string") ? cert : "";
                    partner.current.pub = keys[0];
                    partner.current.epub = keys[1];
    
                    // Retrieve AvailableChat
    
                    let chats = await props.chat.retrieveMonthly(
                        {pub : partner.current.pub, epub : partner.current.epub},
                        { month : dateNow.month, year : dateNow.year}                        
                    )
                    console.log (chats);

                    

                }
            } else {
                console.log ("Partner Key Incomplete")
            }            
        })()
    },[])

    return (
        <>
            {props.alias}
        </>
    )

}