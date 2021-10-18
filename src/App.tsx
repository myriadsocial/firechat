import './App.css';
import { Chat } from './Chat';
import { Iris } from './Iris';
import {
  Switch,
  Route,
  Link,
  HashRouter,
} from "react-router-dom";
import { ChatMUI } from './ChatMUI';

import { Firegun, Chat as ChatFG } from './firegun/firegun'

const fg = new Firegun([
  "https://gundb.dev.myriad.systems/gun", 
  "https://gun-relay.bimasoft.web.id:16902/gun"
])

const chat = new ChatFG(fg)

export default function App() {
  return (
    <HashRouter>
        <Switch>
          <Route path="/chat/:inviteLink">
            <Chat />
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/chatMUI">
            <div style={{width : "500px", height:"600px",  margin: "auto"}}>
              <ChatMUI fg={fg} chat={chat} />
            </div>
          </Route>
          <Route path="/iris">
            <Iris />
          </Route>
          <Route path="/">
            <p>Index Page :</p>
            <p><Link to="/chat">Chat</Link></p>
            <p><Link to="/chatMUI">Chat Material UI</Link></p>
            <p><Link to="/iris">Iris</Link></p>
          </Route>
        </Switch>
    </HashRouter>
  );
}
