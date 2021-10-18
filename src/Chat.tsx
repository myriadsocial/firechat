import { useEffect, useRef, useState } from 'react';
import Gun from 'gun';
import 'gun/sea';
import 'gun/lib/store';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/rindexed';
import { useParams } from 'react-router';

const gun = Gun({
    peers : [
        "https://gundb.dev.myriad.systems/gun", 
        "https://gun-relay.bimasoft.web.id:16902/gun"
    ],
    localStorage : false,
});

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

import { Component } from "react"

type ChatProps = {

}
type ChatState = {
    myPairKey : {epub : string,pub : string,priv : string,epriv : string},
    yourPairKey : {pub : string,epub : string},
    yourCertificate : string,
    pairKey : string,
    partnerKey : string,
    keterangan : string,
    keterangan2 : string,
    inviteLinkHref : string,
    inviteLinkText : string,
    mapArray : string[],
    chatsMessages : {_self : boolean, msg: string, timestamp : string }[],
    chatMessagesDiv : JSX.Element,
    textMsg : string,
    chatTrigger : number,
    partnerKeyStateReadOnly : boolean,
    textMsgReadOnlyState : boolean,
    inviteLink : string,
}
export class Chat extends Component<ChatProps,ChatState> {
    constructor (props:ChatProps) {
        super (props);
        let { inviteLink } = useParams() as {inviteLink : string};
        this.state = {
            myPairKey : {epub : "",pub : "",priv : "",epriv : ""},
            yourPairKey : {pub : "",epub : ""},
            yourCertificate : "",
            pairKey : "",
            partnerKey : "",
            keterangan : "",
            keterangan2 : "",
            inviteLinkHref : "",
            inviteLinkText : "",
            mapArray : [],
            chatsMessages : [],
            chatMessagesDiv : <></>,
            textMsg : "",
            chatTrigger : 0,
            partnerKeyStateReadOnly : true,
            textMsgReadOnlyState : true,
            inviteLink : inviteLink,        
        }

        this.loginPair = this.loginPair.bind(this);
        this.pairInputClick = this.pairInputClick.bind(this);
        this.sendChat = this.sendChat.bind(this);
        this.clearPartner = this.clearPartner.bind(this);
        this.partnerInputClick = this.partnerInputClick.bind(this);
        this.getCertificate = this.getCertificate.bind(this);
        this.processChat = this.processChat.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount() {
        // First Time Only / INIT
        // (window as any).gun = gun
        let localKey = localStorage.getItem("myPairKey");
        if (localKey) {
            // RELOG
            let localPairKey:{epub : string,pub : string,priv : string,epriv : string} = JSON.parse(localKey);
            let localPubKey = `${localPairKey.pub}&${localPairKey.epub}`;
            gun.user().auth(localPairKey as CryptoKeyPair);
            console.log (localPairKey)
            this.setState({
                myPairKey : localPairKey,
                pairKey : localPubKey,
                partnerKeyStateReadOnly : false,
                keterangan : "Login Berhasil",
                inviteLinkText : "Invite Link"
            })
            if (this.state.inviteLink) {
                let partnerKey = Buffer.from(this.state.inviteLink,'base64').toString("ascii");
                this.setState({
                    partnerKey : partnerKey,
                    inviteLinkHref : `./${Buffer.from(localPubKey,'ascii').toString("base64")}`
                })
                gun.get(partnerKey).get("invitelink").put(localPubKey as any);
            } else {
                this.setState({
                    inviteLinkHref : `./chat/${Buffer.from(localPubKey,'ascii').toString("base64")}`
                })
            }
        }
    }

    async send (callback:()=>void) {
        let msgToHim, msgToMe;
        if (this.state.yourPairKey.epub) {
            msgToHim = await Gun.SEA.encrypt(this.state.textMsg,await (Gun as any).SEA.secret(this.state.yourPairKey.epub, this.state.myPairKey));
            msgToMe = await Gun.SEA.encrypt(this.state.textMsg,this.state.myPairKey);
        } else {
            msgToHim = this.state.textMsg
        }
        let cert = this.state.yourCertificate;
        console.log (cert);

        let dateNow = getDate()
        let datetime = `${dateNow.year}/${dateNow.month}/${dateNow.date}T${dateNow.hour}:${dateNow.minutes}:${dateNow.seconds}.${dateNow.miliseconds}`;

        console.log ("Send to Him ...")
        console.log (`gun.get("~${this.state.yourPairKey.pub}").get("chat-with").get("${this.state.myPairKey.pub}").get("${dateNow.year}").get("${dateNow.month}").get("${dateNow.date}")`);
        gun.get(`~${this.state.yourPairKey.pub}`).get("chat-with").get(this.state.myPairKey.pub).get(dateNow.year).get(dateNow.month).get(dateNow.date).set({
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
        gun.user().get("chat-with").get(this.state.yourPairKey.pub).get(dateNow.year).get(dateNow.month).get(dateNow.date).set({
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


    async loginPair() {
        let pairKey = await Gun.SEA.pair()
        let localpairkey = {priv : (pairKey?.priv || ""), pub: (pairKey?.pub || ""), epriv : (pairKey?.epriv || ""), epub : (pairKey?.epub || "") };
        let localPubKey = `${pairKey?.pub}&${pairKey?.epub}`;

        // Generate Certificate
        let cert = await (Gun as any).SEA.certify("*", [{ "*" : "chat-with","+" : "*"}], pairKey);
        gun.user().auth(pairKey as any,()=>{
            gun.user().get("chat-cert").put(cert,(s=>{
                if (s.err) {
                    console.log ("Error Creating Certificate")
                } else {

                    console.log ("Success Creating Certificate")

                    // Login Berhasil
                    this.setState({
                        pairKey : localPubKey,
                        myPairKey : localpairkey,
                        partnerKeyStateReadOnly : false,
                        keterangan : "Login Berhasil",
                        inviteLinkText : "Invite Link"
                    })
            
                    localStorage.setItem("myPairKey",JSON.stringify(localpairkey))

                    if (this.state.inviteLink) {
                        let partnerKey = Buffer.from(this.state.inviteLink,'base64').toString('ascii');
                        this.setState({
                            partnerKey : partnerKey,
                            inviteLinkHref : `./${Buffer.from(localPubKey,'ascii').toString('base64')}`,
                        })
                        gun.get(partnerKey).get("invitelink").put(localPubKey as any);
                    } else {
                        this.setState({
                            inviteLinkHref : `./chat/${Buffer.from(localPubKey,'ascii').toString('base64')}`,
                        })
                    }
                }
            }));
        })
    }

    pairInputClick() {

    }

    sendChat() {
        console.log ("Sending Chat...")

        let newArray = this.state.chatsMessages;
        newArray.push({_self : true, msg: this.state.textMsg, timestamp : "sending..."})

        this.setState({
            chatTrigger : Math.random(),
            chatsMessages : newArray,
        })
        
    }

    clearPartner() {
        this.setState({
            partnerKey : "",
            partnerKeyStateReadOnly : false,
        })
        gun.get(this.state.pairKey).get("invitelink").put("" as any);
    }

    partnerInputClick() {

    }

    async processChat (s:{[x:string] : any},keys:string[]) {
        if ((s.msg as string).search("SEA") === 0)
        if (s._self) {
            s.msg = await Gun.SEA.decrypt(s.msg, this.state.myPairKey);
        } else {
            s.msg = await Gun.SEA.decrypt(s.msg, await (Gun as any).SEA.secret(keys[1], this.state.myPairKey));
        }

        let chatsTemp = this.state.chatsMessages;
        chatsTemp = chatsTemp.filter(function( obj ) {
            console.log (obj);
            return obj.timestamp !== 'sending...';
        });
        chatsTemp.push({_self : s._self, msg : s.msg, timestamp: s.timestamp});
        chatsTemp.sort(dynamicSort("timestamp"));
        this.setState({
            chatsMessages : chatsTemp
        })
    }
    

    getCertificate (tries:number) {
        // Init Pasangan Chat, Ketika Paste di dalam kotak Partner Pairkey
        let keys = this.state.partnerKey.split("&");
        this.setState({
            yourPairKey : {pub : keys[0], epub:keys[1]}
        })

        console.log ("Getting Certificate...")
        gun.get(`~${keys[0]}`).get("chat-cert").once(s=>{
            if (s) {
                // Success Init
                console.log ("Getting Certificate... Success");
                console.log (s);
                this.setState({
                    yourCertificate : s.toString(),
                    partnerKeyStateReadOnly : true,
                    textMsgReadOnlyState : false,

                })

                let dateNow = getDate()
                console.log (`ON !!! gun.user().get("chat-with").get(${keys[0]}).get(${dateNow.year}).get(${dateNow.month}).get(${dateNow.date})`);
                if (!this.state.mapArray.includes(keys[0])) {
                    // NEW Chat New Map
                    let newArray = this.state.mapArray;
                    newArray.push(keys[0]);
                    this.setState({
                        mapArray : newArray
                    })
                    gun.user().get("chat-with").get(keys[0]).get(dateNow.year).get(dateNow.month).get(dateNow.date).map().once(async (s)=>{
                        if (s) {
                            this.processChat(s,keys);
                        }                        
                    })                    
                } else {
                    // Resume Chat Don't need Map
                    gun.user().get("chat-with").get(keys[0]).get(dateNow.year).get(dateNow.month).get(dateNow.date).once().map().once(async (s)=>{
                        if (s) {
                            this.processChat(s,keys);
                        }
                    })
                }
            } else {
                if (tries>=0) {
                    console.log (`Getting Certificate... Failed... Retry (${tries})`);
                    this.getCertificate(tries-1);    
                } else {
                    console.log (`Getting Certificate... Failed ! `);
                }
            }
        })
    }    

    render() {
        return (
        <>
            <div className="row mt-3">
                <div className="col ps-5">
                    <div className="card text-start mb-3">
                      <img className="card-img-top" src="holder.js/100px180/" alt="" />
                      <div className="card-body">
                        <h4 className="card-title" id="chatAreaTitle">Chat Area</h4>
                        <div className="card-text" id="chatBox" style={{ maxHeight : "600px", overflow : "scroll"}}>
                            {this.state.chatMessagesDiv}
                        </div>
                      </div>
                    </div>
                    <input value={this.state.textMsg} readOnly={this.state.textMsgReadOnlyState} onChange={(e)=>{this.setState({textMsg : e.target.value})}} className="form-control" onKeyPress={(e)=>{if (e.code === "Enter") {this.sendChat()}}} />
                </div>
                <div className="col text-start pe-5">
                    <input onClick={this.loginPair} name="loginBtn" id="loginBtn" className="btn btn-primary mb-3 me-3" type="button" value="Login" />
                    <div className="card mb-4">
                      <img className="card-img-top" src="holder.js/100px180/" alt="" />
                      <div className="card-body">
                        <h4 className="card-title">My PairKey</h4>
                        <div className="card-text">
                            <input onClick={this.pairInputClick}  type="text" readOnly={true} value={this.state.pairKey}
                                className="form-control" name="pairKey" id="pairKey" aria-describedby="pairKey" placeholder="Pairkey" />
                            <small id="pairKey" className="form-text text-muted">Paste into Other Chat pairkey</small>
                            <p><small className="form-text text-success">{this.state.keterangan}</small></p>
                            <p><small className="form-text text-success"><a href={this.state.inviteLinkHref}>{this.state.inviteLinkText}</a></small></p>

                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <img className="card-img-top" src="holder.js/100px180/" alt="" />
                      <div className="card-body">
                        <h4 className="card-title">Partner PairKey</h4>
                        <div className="card-text">
                            <textarea rows={5} onChange={(e)=>{this.setState({partnerKey : e.target.value.trim()},()=>{
                                this.setState({
                                    chatsMessages : [],
                                })
                                if (this.state.partnerKey !== "") {
                                    this.getCertificate(5);
                                }
                            })}} onClick={this.partnerInputClick} readOnly={this.state.partnerKeyStateReadOnly}
                                className="form-control" name="partnerKey" id="partnerKey" aria-describedby="partnerKey" placeholder="Paste Key Here" value={this.state.partnerKey}></textarea>
                            <small id="pairKey" className="form-text text-muted">Get from other partner</small>
                            <p><small className="form-text text-success">{this.state.keterangan2}</small></p>
                            <input onClick={this.clearPartner} name="clearPartnerBtn" id="clearPartnerBtn" className="btn btn-warning mb-3" type="button" value="Clear" />
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </>
        )
    }
}

export function Chati(props:{[keys:string] : any}) {


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
                            <div className="card-text mb-0">
                                <p className="m-0">{val.msg}</p>
                                {/* <p className="m-0" style={{fontSize : "10px"}}><a href='#unsend'>Unsend</a> <a href='#delete'>Delete</a></p> */}
                            </div>
                            <p className="card-text fs" style={{fontSize : "10px"}}>{val.timestamp}</p>
                            </div>
                        </div>
                    )
                }
            </>
        )        
    },[chatsMessages])

    const logoutPair = async() => {

    }

    const clearPartner = async() => {
    }
        
    const pairInputClick = async () => {
        await window.navigator.clipboard.writeText(pairKey);
        setKeterangan("Pairkey di copy ke clipboard");
    }
    
    const partnerInputClick = async () => {
    }

    const chatsRef = useRef({a: chatsMessages[chatsMessages.length-1], b:chatTrigger})

}