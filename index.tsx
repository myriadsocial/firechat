import ChatMUIContainer from "./src/Chat/ChatMUIContainer"
import {Firegun, Chat as ChatFG} from "@yokowasis/firegun"

export default function Chat(props:{
    fg : Firegun,
    chat : ChatFG
}) {
    return(
        <>
            <ChatMUIContainer fg={props.fg} chat={props.chat} />
        </>
    )
}