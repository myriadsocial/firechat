import Chat from "./Chat/ChatMUIContainer"
import {Firegun, Chat as ChatFG} from "@yokowasis/firegun"
import {useRef} from "react"

const fg = new Firegun();
const chat = new ChatFG(fg)

function App() {

  const a = async () => {
    return ("Hello Smiley 😇")
  }

  console.log (a());

  return (
    <div className="App">
      <Chat fg={fg} chat={chat} />
      <Test />
    </div>
  );
}

function Test() {
  const a = useRef<HTMLInputElement[]>([]);
  const list = [0,1,2,3,4,5]
  const click = () => {
    let i = 3;
    a.current[i].value = Math.random().toString()
  }
  return (
    <>
      {
        list.map((val,index)=>{
          return (
            <input type="text" value={val} key={index} ref={el=>{
              if (el) {
                a.current.push(el);
                return (a.current[a.current.length])
              } else {
                return null
              }
            }} />  
          )
        })
      }
      <button onClick={click}>Click ME !</button>
    </>
  )
}

export default App;
