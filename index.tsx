import ChatMUIContainer from "./src/Chat/ChatMUIContainer"
import {Firegun, Chat as ChatFG} from "@yokowasis/firegun"

export default function Chat(props:{
    fg : Firegun,
    chat : ChatFG,
    newChat? : string,
}) {
    return(
        <>
            <ChatMUIContainer fg={props.fg} chat={props.chat} newChat={props.newChat} />
        </>
    )
}