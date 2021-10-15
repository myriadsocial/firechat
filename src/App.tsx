import './App.css';
import { Chat } from './Chat';
import { Iris } from './Iris';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default function App() {
  return (
    <Router>
        <Switch>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/iris">
            {/* <Iris /> */}
          </Route>
          <Route path="/">
            Index Page
          </Route>
        </Switch>
    </Router>
  );
}
