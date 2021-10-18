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
import { useEffect, useState } from 'react';

const fg = new Firegun([
  "https://gundb.dev.myriad.systems/gun", 
  "https://gun-relay.bimasoft.web.id:16902/gun"
])

const chat = new ChatFG(fg)

if (localStorage.getItem('myPairKey')) {
  fg.loginPair(JSON.parse(localStorage.getItem('myPairKey') || "{}"))
  .then((a)=>{
    console.log(a);
  })
}

export default function App() {

  const [partners, setpartners] = useState<string[]>([])
  const [text, settext] = useState("")

  const addArray = () => {
    setpartners(arr=>{
      return [...arr, text]
    })
  }

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
              Partner Key <input type="text" value={text} onChange={(e)=>{settext(e.target.value)}} /> <button onClick={addArray}>Init Chat !</button>
              <br/><br/>
              {
                partners.map((val,index)=>{
                  return(
                    <ChatMUI key={val} fg={fg} chat={chat} partnerKey={val} />
                  )                  
                })
              }
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
