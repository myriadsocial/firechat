import './App.css';
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
          <Route path="/chatMUI">
            <ChatMUIContainer fg={fg} chat={chat} />
          </Route>
          <Route path="/">
            <p>Index Page :</p>
            <p><Link to="/chatMUI">Chat Material UI</Link></p>
          </Route>
        </Switch>
    </HashRouter>
  );
}
