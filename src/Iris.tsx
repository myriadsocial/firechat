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

const gun1 = Gun({
    peers : [
        "https://gundb.dev.myriad.systems/gun", 
        "https://gun-relay.bimasoft.web.id:16902/gun"
    ],
    localStorage : false,
});

const gun2 = Gun({
    peers : [
        "https://gundb.dev.myriad.systems/gun", 
        "https://gun-relay.bimasoft.web.id:16902/gun"
    ],
    localStorage : false,
});

export function Iris(props:{[keys:string] : any}) {

    type pairKeyType = {
        pub : string,
        epub : string,
        priv : string,
        epriv : string,
    }

    const [pairKey, setPairKey] = useState("")
    const [partnerKey, setPartnerKey] = useState("")
    const [keterangan, setKeterangan] = useState("")
    const [keterangan2, setKeterangan2] = useState("")
    const [inviteLinkHref, setInviteLinkHref] = useState("")
    const [inviteLinkText, setInviteLinkText] = useState("")
    const [chatMessagesDiv, setChatMessagesDiv] = useState<JSX.Element>(<></>)
    const [textMsg, setTextMsg] = useState("");
    const [partnerKeyStateReadOnly, setPartnerKeyStateReadOnly] = useState(true);
    const [textMsgReadOnlyState, setTextMsgReadOnlyState] = useState(true);
    const [myKey, setMyKey] = useState<pairKeyType>({pub:"",epub:"",priv:"",epriv:""});
    const [ourChannel, setOurChannel] = useState<any>();
    const [theirChannel, setTheirChannel] = useState<any>();

    useEffect(()=>{
        if (partnerKey) {
            var someoneElse = { pub : partnerKey }
            var ourChannel = new iris.Channel({key: myKey, gun: gun1, participants: someoneElse.pub});
            setOurChannel(ourChannel)
    
            iris.Channel.getChannels(gun1, myKey, (channel:any) => {
                channel.getMessages(printMessage);
            });
    
            setTextMsgReadOnlyState(false);
            setPartnerKeyStateReadOnly(true);    
        }        
    },[partnerKey])

    useEffect(()=>{
        (window as any).gun = gun1;
    },[])

    const loginPair = async () =>{
        var myKey = await iris.Key.getDefault();
        setMyKey(myKey);
        setPairKey(myKey.pub);
        iris.Channel.initUser(gun1, myKey); // saves myKey.epub to gun.user().get('epub')

        setPartnerKeyStateReadOnly(false);

    }

    const pairInputClick = async () =>{
        await window.navigator.clipboard.writeText(pairKey);
        setKeterangan("Pairkey di copy ke clipboard");
    }

    const printMessage = (msg:{[x:string] : string}, info:{[x:string] : string}) => {
        console.log(`[${new Date(msg.time).toLocaleString()}] ${info.from.slice(0,8)}: ${msg.text}`)
    }


    const clearPartner = () =>{

    }

    const partnerInputClick = () =>{

    }

    const sendChat = () =>{
        ourChannel.send(textMsg);
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
                            <textarea onClick={pairInputClick}  readOnly={true} value={pairKey} rows={5}
                                className="form-control" name="pairKey" id="pairKey" aria-describedby="pairKey" placeholder="Pairkey"></textarea>
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