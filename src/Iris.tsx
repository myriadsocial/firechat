import { Component } from "react"
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


interface irisState {
    pairKey : string,
    partnerKey : string,
    keterangan : string,
    keterangan2 : string,
    inviteLinkHref : string,
    inviteLinkText : string,
    chatMessagesDiv : JSX.Element,
    chatsMessages : {_self : boolean, msg: string, timestamp : string }[],
    textMsg : string,
    testText : string,
    partnerKeyStateReadOnly : boolean,
    textMsgReadOnlyState : boolean,
    myKey : {pub:string,epub:string,priv:string,epriv:string},
    ourChannel : any,
}

interface irisProps {

}
export class Iris extends Component<irisProps,irisState> {
    constructor (props:irisProps) {
        super (props);

        this.state = {
            pairKey : "",
            partnerKey : "",
            keterangan : "",
            keterangan2 : "",
            inviteLinkHref : "",
            inviteLinkText : "",
            chatMessagesDiv : <></>,
            chatsMessages : [] as {_self : boolean, msg: string, timestamp : string }[],
            textMsg : "",
            testText : "",
            partnerKeyStateReadOnly : true,
            textMsgReadOnlyState : true,
            myKey : {pub:"",epub:"",priv:"",epriv:""},
            ourChannel : null as any,
        }
        this.sendChat = this.sendChat.bind(this);
        this.loginPair = this.loginPair.bind(this);
        this.test = this.test.bind(this);
        this.pairInputClick = this.pairInputClick.bind(this);
        this.partnerInputClick = this.partnerInputClick.bind(this);
        this.clearPartner = this.clearPartner.bind(this);
        this.partnerKeyChanged = this.partnerKeyChanged.bind(this);
        this.printMessage = this.printMessage.bind(this);
    }

    sendChat() {
        this.state.ourChannel.send(this.state.textMsg);
        this.setState({
            textMsg : ""
        })
    }

    async loginPair() {
        var myKey = await iris.Key.getDefault();
        this.setState({
            myKey : myKey,
            pairKey : myKey.pub,
            partnerKeyStateReadOnly : false,
        })
        iris.Channel.initUser(gun1, myKey); // saves myKey.epub to gun.user().get('epub')
    }

    test() {
        this.setState({
            testText : Math.random().toString(),
            chatsMessages : [{
                _self : true,
                msg : Math.random().toString(),
                timestamp : "...."    
            }]
        })        
    }

    async pairInputClick() {
        await window.navigator.clipboard.writeText(this.state.pairKey);
        this.setState({
            keterangan : "Pairkey di copy ke clipboard"
        })
    }

    updateChatDiv() {
        this.setState({
            chatMessagesDiv : 
                <>
                    {
                        this.state.chatsMessages.map((val)=>
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
        })
    }

    printMessage (msg:{[x:string] : string}, info:{[x:string] : string}) {
        let chatsTemp = this.state.chatsMessages;
        let self = false;
        if (info.from.slice(0,8) === this.state.myKey.pub.slice(0,8)) {
            self = true;
        }
        chatsTemp.push({_self : self, msg : msg.text, timestamp: (new Date(msg.time).toString())});
        chatsTemp.sort(dynamicSort("timestamp"));
        this.setState({
            chatsMessages : chatsTemp
        },this.updateChatDiv)
    }

    partnerInputClick() {

    }

    clearPartner() {

    }

    partnerKeyChanged() {
        var someoneElse = { pub : this.state.partnerKey }
        var ourChannel = new iris.Channel({key: this.state.myKey, gun: gun1, participants: someoneElse.pub});
        this.setState({
            ourChannel : ourChannel,
            textMsgReadOnlyState : false,
            partnerKeyStateReadOnly : true,
        });

        // 1 Channel Saja
        ourChannel.getMessages(this.printMessage)

        // Get Semua Chat dari semua Channel
        // iris.Channel.getChannels(gun1, this.state.myKey, (channel:any) => {
        //     channel.getMessages();
        // });
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
                        <input onClick={this.test} className="btn btn-primary mb-3 me-3" type="button" value="Test" />
                        <div className="card mb-4">
                        <img className="card-img-top" src="holder.js/100px180/" alt="" />
                        <div className="card-body">
                            <h4 className="card-title">My PairKey</h4>
                            <div className="card-text">
                                <textarea onClick={this.pairInputClick}  readOnly={true} value={this.state.pairKey} rows={5}
                                    className="form-control" name="pairKey" id="pairKey" aria-describedby="pairKey" placeholder="Pairkey"></textarea>
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
                                <textarea rows={5} onChange={(e)=>{this.setState({partnerKey : e.target.value.trim()},()=>{this.partnerKeyChanged()})}} onClick={this.partnerInputClick} readOnly={this.state.partnerKeyStateReadOnly}
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

export function AIris(props:{[keys:string] : any}) {

    type pairKeyType = {
        pub : string,
        epub : string,
        priv : string,
        epriv : string,
    }
}