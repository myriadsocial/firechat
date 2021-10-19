import { useState } from "react"

export function Login (props:any) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keterangan, setKeterangan] = useState("");

    const login = () => {
        setKeterangan("Proses...");
        props.fg.userLogin(username,password)
        .then(()=>{
            props.setAlias(props.fg.user.alias)
            props.setMyPubKey(`${props.fg.user.pair.pub}&${props.fg.user.pair.epub}`)
        })
        .catch((s:any)=>{
            setKeterangan(s.err);
        })
    }

    const signup = () => {
        setKeterangan("Proses...");
        props.fg.userNew(username,password)
        .then(()=>{
            props.setAlias(props.fg.user.alias)
            props.setMyPubKey(`${props.fg.user.pair.pub}&${props.fg.user.pair.epub}`)
        })
        .catch((s:any)=>{
            setKeterangan(s.err);
        })        
    }
    
    return (
        <>
            <table>
                <tbody>
                <tr>
                    <td>Username</td>
                    <td>:</td>
                    <td><input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} /></td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td>:</td>
                    <td><input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} /></td>
                </tr>
                <tr>
                    <td>{keterangan}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><input type="button" value="Login" onClick={login} /></td>
                    <td></td>
                    <td><input type="button" value="Sign UP" onClick={signup} /></td>
                </tr>
                </tbody>
            </table>
        </>
    )
}