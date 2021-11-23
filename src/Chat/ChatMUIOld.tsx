import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Send from '@mui/icons-material/Send'
import AttachFile from '@mui/icons-material/AttachFile'
import Close from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Firegun, Chat, common } from "@yokowasis/firegun"
import { chatType } from "@yokowasis/firegun/common"
import ChatBubble from "./ChatBubble"
import Delete from '@mui/icons-material/Delete'
import InviteButton from './InviteButton'
import AddAdminButton from './AddAdminButton'
import EditGroupChat from './EditGroupChat'
import { RefreshRounded, Search } from '@mui/icons-material'

type ChatMUIProps = {
    partnerKey : string,
    height : string,
    fg : Firegun,
    chat : Chat,
    show : boolean,
    alias : string,
    isGroup? : boolean,
    groupName? : string,
    updateLastMsg : (key:string,lastMsg:string) => void,
}

export default function ChatMUI(props:ChatMUIProps) {

    const [textMsg, setTextMsg] = useState("");
    const [chatsMessages, setChatsMessages] = useState<chatType[]>([]);
    const [chatsMessagesDiv, setChatsMessagesDiv] = useState<JSX.Element>(<></>);
    const [groupOwner, setGroupOwner] = useState("");
    const [groupAlias, setgroupAlias] = useState("");
    const [searchString, setSearchString] = useState("");

    const yourPub = useRef("");
    const yourEpub = useRef("");
    const yourCert = useRef("");
    const chatBubbleRef = useRef<{[x:string] : HTMLDivElement | null}>({})








}    
