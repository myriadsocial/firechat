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

import { Gun, Firegun, Chat as ChatFG } from './firegun/index'
import { useEffect, useState } from 'react';
import { Login } from './Login';

const peer = [
  "https://gundb.dev.myriad.systems/gun", 
  "https://gun-relay.bimasoft.web.id:16902/gun"
];

const fg = new Firegun(peer,undefined,true)

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
  const [alias, setAlias] = useState("")
  const [myPubKey, setMyPubKey] = useState("")

  const addArray = () => {
    setpartners(arr=>{
      return [...arr, text]
    })
  }

  useEffect(()=>{
    (window as any).fg = fg;
    if (fg.user) {
      setAlias(fg.user.alias);
      setMyPubKey(`${fg.user.pair.pub}&${fg.user.pair.epub}`)
    }    
  },[])


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
            { (alias) ? 
              <div style={{width : "500px", height:"600px",  margin: "auto"}}>
                <textarea value={myPubKey} readOnly={true} />
                <br/><br/>
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
            : <Login fg={fg} setAlias={setAlias} setMyPubKey={setMyPubKey} /> }
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
