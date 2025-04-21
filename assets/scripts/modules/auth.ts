import {DataCenter} from '../datacenter/datacenter';
import { SocketManager } from '../frameworks/socketManager';
export class Auth {
    req(){
        SocketManager.instance.loadProtocol(()=>{
            SocketManager.instance.start("ws://192.168.1.140:9002",this.respContent.bind(this))
        })
    }

    respContent(result:boolean){
        if(result){
            SocketManager.instance.content(this.resp.bind(this))
        }
    }

    resp(result:boolean){
        if(result){
            console.log('auth success')
        }else{
            console.log('auth fail')
        }
    }
}