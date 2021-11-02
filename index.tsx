import ChatMUIContainer from "./src/Chat/ChatMUIContainer"
import {Firegun, Chat as ChatFG, common} from '@yokowasis/firegun'

export default function Chat(props:{
    fg : Firegun,
    chat : ChatFG,
    newChat? : string,
    common : typeof common,
}) {
    return(
        <>
            <ChatMUIContainer common={props.common} fg={props.fg} chat={props.chat} newChat={props.newChat} />
        </>
    )
}