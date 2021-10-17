import './App.css';
import { Chat } from './Chat';
import { Iris } from './Iris';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Switch>
          <Route path="/chat/:inviteLink">
            <Chat />
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/iris">
            <Iris />
          </Route>
          <Route path="/">
            <p>Index Page :</p>
            <p><Link to="/chat">Chat</Link></p>
            <p><Link to="/iris">Iris</Link></p>
          </Route>
        </Switch>
    </BrowserRouter>
  );
}
