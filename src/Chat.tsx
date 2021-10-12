import { useEffect, useRef, useState } from 'react';
import Gun from 'gun';
import 'gun/sea';

const gun = Gun("https://gundb.dev.myriad.systems/gun");

export function Chat(props:{[keys:string] : any}) {

    const [myPairKey, setMyPairKey] = useState({epub : "",pub : "",priv : "",epriv : ""})
    const [yourPairKey, setYourPairKey] = useState({pub : "",epub : ""})
    const [yourCertificate, setYourCertificate] = useState("")
    const [pairKey, setPairKey] = useState("")
    const [partnerKey, setPartnerKey] = useState("")
    const [keterangan, setKeterangan] = useState("")
    const [keterangan2, setKeterangan2] = useState("")
    const [chatsMessages, setChatsMessages] = useState<{_self : boolean, msg: string, timestamp : string }[]>([])
    const [chatMessagesDiv, setChatMessagesDiv] = useState<JSX.Element>(<></>)
    const [textMsg, setTextMsg] = useState("");
    const [chatTrigger, setChatTrigger] = useState(0);
    const [partnerKeyStateReadOnly, setPartnerKeyStateReadOnly] = useState(true);
    const [textMsgReadOnlyState, setTextMsgReadOnlyState] = useState(true);
    
    
    const loginPair = async () => {
        let pairKey = await Gun.SEA.pair()
        setPairKey(`${pairKey?.pub}&${pairKey?.epub}`)
        setMyPairKey({priv : (pairKey?.priv || ""), pub: (pairKey?.pub || ""), epriv : (pairKey?.epriv || ""), epub : (pairKey?.epub || "") })

        // Generate Certificate
        let cert = await (Gun as any).SEA.certify("*", [{ "*" : "chat-with","+" : "*"}], pairKey);
        gun.user().auth(pairKey as any,()=>{
            gun.user().get("chat-cert").put(cert,(s=>{
                if (s.err) {
                    console.log ("Error Creating Certificate")
                } else {
                    console.log ("Success Creating Certificate")

                    // Login Berhasil
                    setPartnerKeyStateReadOnly(false);
                    setKeterangan("Login Berhasil");                    
                }
            }));
        })
        
    }

    const pairInputClick = async () => {
        await window.navigator.clipboard.writeText(pairKey);
        setKeterangan("Pairkey di copy ke clipboard");
    }
    
    const partnerInputClick = async () => {
    }

    const getDate = () => {
        let currentdate = new Date(); 
        let year = currentdate.getFullYear();
        let month  = ((currentdate.getMonth()+1) < 10) ? "0" + (currentdate.getMonth()+1) : (currentdate.getMonth()+1);
        let date = (currentdate.getDate() < 10) ? "0" + (currentdate.getDate()) : (currentdate.getDate());
        let hour = (currentdate.getHours() < 10) ? "0" + (currentdate.getHours()) : (currentdate.getHours());
        let minutes = (currentdate.getMinutes() < 10) ? "0" + (currentdate.getMinutes()) : (currentdate.getMinutes());
        let seconds = (currentdate.getSeconds() < 10) ? "0" + (currentdate.getSeconds()) : (currentdate.getSeconds());
        let miliseconds = (currentdate.getMilliseconds() < 10) ? "0" + (currentdate.getMilliseconds()) : (currentdate.getMilliseconds());
        return ( {year : year, month : month, date : date, hour : hour, minutes : minutes, seconds : seconds, miliseconds : miliseconds} )
    }

    const send = async (callback:()=>void) => {
        let msgToHim, msgToMe;
        if (yourPairKey.epub) {
            msgToHim = await Gun.SEA.encrypt(textMsg,await (Gun as any).SEA.secret(yourPairKey.epub, myPairKey));
            msgToMe = await Gun.SEA.encrypt(textMsg,myPairKey);
        } else {
            msgToHim = textMsg
        }
        let cert = yourCertificate;

        let dateNow = getDate()
        let datetime = `${dateNow.year}/${dateNow.month}/${dateNow.date}T${dateNow.hour}:${dateNow.minutes}:${dateNow.seconds}.${dateNow.miliseconds}`;

        console.log ("Send to Him ...")
        gun.get(`~${yourPairKey.pub}`).get("chat-with").get(myPairKey.pub).get(dateNow.year).get(dateNow.month).get(dateNow.date).set({
            "_self" : false,
            "timestamp" : datetime, 
            "msg" : msgToHim, 
        },(ack=>{
            if (ack.err) {
                console.log ("Send to Him ... Failed")
            } else {
                console.log ("Send to Him ... Success")                
                callback();
            }
        }),{
            opt : {
                cert : cert
            }
        })

        console.log ("Send to Me ...")
        gun.user().get("chat-with").get(yourPairKey.pub).get(dateNow.year).get(dateNow.month).get(dateNow.date).set({
            "_self" : true,
            "timestamp" : datetime, 
            "msg" : msgToMe, 
        },(ack=>{
            if (ack.err) {
                console.log ("Send to Me ... Failed")
            } else {
                console.log ("Send to Me ... Success")
            }
        }))
    }

    const chatsRef = useRef({a: chatsMessages[chatsMessages.length-1], b:chatTrigger})

    useEffect(()=>{
        let lastIndex = chatsMessages.length-1;
        if (
            chatsRef.current.a !== chatsMessages[lastIndex] &&
            chatsRef.current.b !== chatTrigger
        ) {
            chatsRef.current.a = chatsMessages[lastIndex];
            chatsRef.current.b = chatTrigger;
            setTextMsg("");            
            send(()=>{
                console.log ("Sending Chat... Success")                
            })
        }
    })

    const sendChat = async() => {
        console.log ("Sending Chat...")
        setChatTrigger(Math.random())
        setChatsMessages(oldArray=>[...oldArray, {_self : true, msg: textMsg, timestamp : "sending..."}])
    }

    const getCertificate = (tries:number) => {
        // Init Pasangan Chat, Ketika Paste di dalam kotak Partner Pairkey
        let keys = partnerKey.split("&");
        setYourPairKey({pub : keys[0], epub:keys[1]})

        console.log ("Getting Certificate...")
        gun.get(`~${keys[0]}`).get("chat-cert").once(s=>{
            if (s) {
                // Success Init
                console.log ("Getting Certificate... Success");
                console.log (s);
                setYourCertificate(s as any);
                setPartnerKeyStateReadOnly(true);
                setTextMsgReadOnlyState(false);

                let dateNow = getDate()
                console.log (`ON !!! gun.user().get("chat-with").get(${keys[0]}).get(${dateNow.year}).get(${dateNow.month}).get(${dateNow.date})`);
                gun.user().get("chat-with").get(keys[0]).get(dateNow.year).get(dateNow.month).get(dateNow.date).map().once(async (s)=>{
                    if (s) {
                        if (s._self) {
                            s.msg = await Gun.SEA.decrypt(s.msg, myPairKey);
                        } else {
                            s.msg = await Gun.SEA.decrypt(s.msg, await (Gun as any).SEA.secret(keys[1], myPairKey));
                        }
                        setChatsMessages(chatsMessages=>{
                            let chatsTemp = chatsMessages;                    
                            chatsTemp = chatsTemp.filter(function( obj ) {
                                console.log (obj);
                                return obj.timestamp !== 'sending...';
                            });
                            return [...chatsTemp,{_self : s._self, msg : s.msg, timestamp: s.timestamp}]
                        });
                    }                        
                })
            } else {
                if (tries>=0) {
                    console.log (`Getting Certificate... Failed... Retry (${tries})`);
                    getCertificate(tries-1);    
                } else {
                    console.log (`Getting Certificate... Failed ! `);
                }
            }
        })
    }

    useEffect(()=>{
        if (partnerKey !== "") {
            getCertificate(5);
        }
        
    },[partnerKey])

    useEffect(()=>{
        var objDiv = document.getElementById("chatBox");
        if (objDiv) 
            objDiv.scrollTop = objDiv.scrollHeight;
    },[chatMessagesDiv])

    useEffect(()=>{
        setChatMessagesDiv(
            <>
                {
                    chatsMessages.map((val)=>
                        <div key={`${val.timestamp}-${Math.random()}`} className={`${val.timestamp} card col-md-7 mb-3 ${val._self ? "text-start bg-primary text-white" : "text-end offset-md-5"}`}>
                            <img className="card-img-top" src="holder.js/100px180/" alt="" />
                            <div className="card-body">
                            <p className="card-text mb-0">{val.msg}</p>
                            <p className="card-text fs" style={{fontSize : "10px"}}>{val.timestamp}</p>
                            </div>
                        </div>
                    )
                }
            </>
        )        
    },[chatsMessages[chatsMessages.length-1]])

    useEffect(()=>{
        (window as any).gun = gun
    },[])

    return (
        <>
            <div className="row mt-3">
                <div className="col ps-5">
                    <div className="card text-start mb-3">
                      <img className="card-img-top" src="holder.js/100px180/" alt="" />
                      <div className="card-body">
                        <h4 className="card-title" id="chatAreaTitle">Chat Area</h4>
                        <div className="card-text" id="chatBox" style={{ maxHeight : "600px", overflow : "scroll"}}>
                            {chatMessagesDiv}
                        </div>
                      </div>
                    </div>
                    <input value={textMsg} readOnly={textMsgReadOnlyState} onChange={(e)=>{setTextMsg(e.target.value)}} className="form-control" onKeyPress={(e)=>{if (e.code === "Enter") {sendChat()}}} />
                </div>
                <div className="col text-start pe-5">
                    <input onClick={loginPair} name="loginBtn" id="loginBtn" className="btn btn-primary mb-3" type="button" value="Login" />
                    <div className="card mb-4">
                      <img className="card-img-top" src="holder.js/100px180/" alt="" />
                      <div className="card-body">
                        <h4 className="card-title">My PairKey</h4>
                        <div className="card-text">
                            <input onClick={pairInputClick}  type="text" readOnly={true} value={pairKey}
                                className="form-control" name="pairKey" id="pairKey" aria-describedby="pairKey" placeholder="Pairkey" />
                            <small id="pairKey" className="form-text text-muted">Paste into Other Chat pairkey</small>
                            <p><small className="form-text text-success">{keterangan}</small></p>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <img className="card-img-top" src="holder.js/100px180/" alt="" />
                      <div className="card-body">
                        <h4 className="card-title">Partner PairKey</h4>
                        <div className="card-text">
                            <textarea rows={5} onChange={(e)=>{setPartnerKey(e.target.value)}} onClick={partnerInputClick} readOnly={partnerKeyStateReadOnly}
                                className="form-control" name="partnerKey" id="partnerKey" aria-describedby="partnerKey" placeholder="Paste Key Here" value={partnerKey}></textarea>
                            <small id="pairKey" className="form-text text-muted">Get from other partner</small>
                            <p><small className="form-text text-success">{keterangan2}</small></p>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </>
    )
}