import './App.css';
import { Chat } from './Chat';
import { Iris } from './Iris';
import {
  Switch,
  Route,
  Link,
  HashRouter,
} from "react-router-dom";

import { Gun, Firegun, Chat as ChatFG } from '@yokowasis/firegun'
import { useEffect, useState } from 'react';
import ChatMUIContainer from './ChatMUI/ChatMUIContainer';

const peer = [
  "https://gundb.dev.myriad.systems/gun", 
  "https://gun-relay.bimasoft.web.id:16902/gun"
];

const fg = new Firegun(peer,undefined,true)

const chat = new ChatFG(fg)

export default function App() {
  return (
    <HashRouter>
        <Switch>
          <Route path="/chat/:inviteLink">
            <Chat Gun={Gun} gun={fg.gun} inviteLink={undefined}/>
          </Route>
          <Route path="/chat">
            <Chat Gun={Gun} gun={fg.gun} inviteLink={undefined}/>
          </Route>
          <Route path="/chatMUI">
            <ChatMUIContainer fg={fg} chat={chat} />
          </Route>
          <Route path="/iris">
            {/* <Iris Gun={Gun} gun={fg.gun} /> */}
          </Route>
          <Route path="/">
            <p>Index Page :</p>
            <p><Link to="/chat">Chat</Link></p>
            <p><Link to="/chatMUI">Chat Material UI</Link></p>
            {/* <p><Link to="/iris">Iris</Link></p> */}
          </Route>
        </Switch>
    </HashRouter>
  );
}
