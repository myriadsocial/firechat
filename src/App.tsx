import Chat from "./Chat/ChatMUIContainer"
import {Firegun, Chat as ChatFG} from "@yokowasis/firegun"

const fg = new Firegun();
const chat = new ChatFG(fg)

function App() {

  return (
    <div className="App">
      <Chat fg={fg} chat={chat} />
    </div>
  );
}

export default App;
