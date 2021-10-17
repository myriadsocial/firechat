import './App.css';
import { Chat } from './Chat';
import { Iris } from './Iris';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

export default function App() {
  return (
    <Router>
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
    </Router>
  );
}
