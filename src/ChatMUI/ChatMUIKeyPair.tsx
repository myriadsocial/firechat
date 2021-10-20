import { useState } from "react"

export default function ChatMUIKeyPair (props:{
    myPubKey:string,
    setPartners: React.Dispatch<React.SetStateAction<string[]>>
}) {

    const [text,setText] = useState("")
    const [partners, setpartners] = useState<string[]>([])

    const addArray = () => {
        props.setPartners(arr=>{
            return [...arr, text]
          })
      }
    
    return (
        <>
            <textarea value={props.myPubKey} readOnly={true} />
            <br/><br/>
            Partner Key <input type="text" value={text} onChange={(e)=>{setText(e.target.value)}} /> <button onClick={addArray}>Init Chat !</button>
            <br/><br/>
        </>
    )
}