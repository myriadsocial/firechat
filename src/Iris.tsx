import { useEffect, useRef, useState } from 'react';
import Gun from 'gun';
import 'gun/sea';
import 'gun/lib/store';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/rindexed';
import { useParams } from 'react-router';
// @ts-ignore
import iris from "iris-lib"

const gun = Gun({
    peers : [
        "https://gundb.dev.myriad.systems/gun", 
        "https://gun-relay.bimasoft.web.id:16902/gun"
    ],
    localStorage : false,
});

function dynamicSort(property:string) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a:any,b:any) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export function Iris(props:{[keys:string] : any}) {

    const [myPairKey, setMyPairKey] = useState({epub : "",pub : "",priv : "",epriv : ""})
    const [yourPairKey, setYourPairKey] = useState({pub : "",epub : ""})
    const [yourCertificate, setYourCertificate] = useState("")
    const [pairKey, setPairKey] = useState("")
    const [partnerKey, setPartnerKey] = useState("")
    const [keterangan, setKeterangan] = useState("")
    const [keterangan2, setKeterangan2] = useState("")
    const [inviteLinkHref, setInviteLinkHref] = useState("")
    const [inviteLinkText, setInviteLinkText] = useState("")
    const [mapArray, setMapArray] = useState<string[]>([]);
    const [chatsMessages, setChatsMessages] = useState<{_self : boolean, msg: string, timestamp : string }[]>([])
    const [chatMessagesDiv, setChatMessagesDiv] = useState<JSX.Element>(<></>)
    const [textMsg, setTextMsg] = useState("");
    const [myChannel, setMyChannel] = useState<any>();
    const [yourChannel, setYourChannel] = useState<any>();
    const [chatTrigger, setChatTrigger] = useState(0);
    const [partnerKeyStateReadOnly, setPartnerKeyStateReadOnly] = useState(true);
    const [textMsgReadOnlyState, setTextMsgReadOnlyState] = useState(true);
    let { inviteLink } = useParams() as {inviteLink : string};

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
    
    useEffect(()=>{
        setChatsMessages([]);
        if (partnerKey !== "") {
            getCertificate(5);
        }        
    },[partnerKey])

    useEffect(()=>{
        // Login Berhasil, Mypairkey berhasil di set
        gun.get(pairKey).get("invitelink").on(val=>{
            setPartnerKey(val);
        })
    },[myPairKey])

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
    },[chatsMessages])

    useEffect(()=>{
        // First Time Only / INIT
        (window as any).gun = gun
        let localKey = localStorage.getItem("myPairKey") || "";
        if (localKey) {
            // RELOG
            iris.Key.getDefault()
            .then((pairKey:{[x:string] : string})=>{
                iris.Channel.initUser(gun, pairKey);    
                let localPairKey:{epub : string,pub : string,priv : string,epriv : string} = JSON.parse(localKey);
                let localPubKey = `${localPairKey.pub}&${localPairKey.epub}`;
                console.log (localPairKey)
                setMyPairKey(localPairKey)
                setPairKey(localPubKey)
                setPartnerKeyStateReadOnly(false);
                setKeterangan("Login Berhasil");
                setInviteLinkText("Invite Link")
                if (inviteLink) {
                    let partnerKey = atob(inviteLink);
                    setPartnerKey(partnerKey);
                    setInviteLinkHref(`./${btoa(localPubKey)}`)
                    gun.get(atob(inviteLink)).get("invitelink").put(localPubKey as any);
                } else {
                    setInviteLinkHref(`./chat/${btoa(localPubKey)}`)
                }                
            })
        }
    },[])

    const logoutPair = async() => {

    }

    const clearPartner = async() => {
        setPartnerKey("");        
        setPartnerKeyStateReadOnly(false);
        gun.get(pairKey).get("invitelink").put("" as any);
    }
    
    const loginPair = async () => {
        let pairKey = await iris.Key.getDefault();
        iris.Channel.initUser(gun, pairKey);

        let localpairkey = {priv : (pairKey?.priv || ""), pub: (pairKey?.pub || ""), epriv : (pairKey?.epriv || ""), epub : (pairKey?.epub || "") };
        let localPubKey = `${pairKey?.pub}&${pairKey?.epub}`;

        setPairKey(localPubKey)
        setMyPairKey(localpairkey);

        // Login Berhasil
        setPartnerKeyStateReadOnly(false);
        setKeterangan("Login Berhasil");

        localStorage.setItem("myPairKey",JSON.stringify(localpairkey))

        setInviteLinkText("Invite Link")
        if (inviteLink) {
            let partnerKey = atob(inviteLink);
            setPartnerKey(partnerKey);
            setInviteLinkHref(`./${btoa(localPubKey)}`)
            gun.get(atob(inviteLink)).get("invitelink").put(localPubKey as any);
        } else {
            setInviteLinkHref(`./chat/${btoa(localPubKey)}`)
        }        
    
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
        myChannel.put('chat', textMsg);
        yourChannel.put('chat', textMsg);
    }

    const chatsRef = useRef({a: chatsMessages[chatsMessages.length-1], b:chatTrigger})

    const sendChat = async() => {
        console.log ("Sending Chat...")
        setChatTrigger(Math.random())
        setChatsMessages(oldArray=>[...oldArray, {_self : true, msg: textMsg, timestamp : "sending..."}])
    }

    const processChat = async (s:{[x:string] : any},keys:string[]) => {
        if ((s.msg as string).search("SEA") === 0)
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
            chatsTemp.push({_self : s._self, msg : s.msg, timestamp: s.timestamp});
            chatsTemp.sort(dynamicSort("timestamp"));
            return chatsTemp;
        });
    }

    const getCertificate = (tries:number) => {
        // Init Pasangan Chat, Ketika Paste di dalam kotak Partner Pairkey
        let keys = partnerKey.split("&");
        setYourPairKey({pub : keys[0], epub:keys[1]})

        let myChannel = new iris.Channel({key: myPairKey, gun: gun, participants: keys[0]});
        setMyChannel(myChannel);

        let yourChannel = new iris.Channel({key: {pub : keys[0], epub:keys[1]}, gun: gun, participants: myPairKey.pub});
        setYourChannel(yourChannel);

        iris.Channel.getChannels(gun, myPairKey, (channel:any) => {
            var pub = channel.getParticipants((s:any)=>{console.log(s)});
            gun.user(pub).get('profile').get('name').on(name => channel.name = name);
            let myChan = myChannel;
            myChan[pub] = channel;
            // setMyChannels(myChan)
            // channel.getMessages(printMessage);
            channel.on('chat', (s:any) => console.log(s));
        });        
        setPartnerKeyStateReadOnly(true);
        setTextMsgReadOnlyState(false);
    }

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
                    <input onClick={loginPair} name="loginBtn" id="loginBtn" className="btn btn-primary mb-3 me-3" type="button" value="Login" />
                    <div className="card mb-4">
                      <img className="card-img-top" src="holder.js/100px180/" alt="" />
                      <div className="card-body">
                        <h4 className="card-title">My PairKey</h4>
                        <div className="card-text">
                            <input onClick={pairInputClick}  type="text" readOnly={true} value={pairKey}
                                className="form-control" name="pairKey" id="pairKey" aria-describedby="pairKey" placeholder="Pairkey" />
                            <small id="pairKey" className="form-text text-muted">Paste into Other Chat pairkey</small>
                            <p><small className="form-text text-success">{keterangan}</small></p>
                            <p><small className="form-text text-success"><a href={inviteLinkHref}>{inviteLinkText}</a></small></p>

                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <img className="card-img-top" src="holder.js/100px180/" alt="" />
                      <div className="card-body">
                        <h4 className="card-title">Partner PairKey</h4>
                        <div className="card-text">
                            <textarea rows={5} onChange={(e)=>{setPartnerKey(e.target.value.trim())}} onClick={partnerInputClick} readOnly={partnerKeyStateReadOnly}
                                className="form-control" name="partnerKey" id="partnerKey" aria-describedby="partnerKey" placeholder="Paste Key Here" value={partnerKey}></textarea>
                            <small id="pairKey" className="form-text text-muted">Get from other partner</small>
                            <p><small className="form-text text-success">{keterangan2}</small></p>
                            <input onClick={clearPartner} name="clearPartnerBtn" id="clearPartnerBtn" className="btn btn-warning mb-3" type="button" value="Clear" />
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </>
    )
}