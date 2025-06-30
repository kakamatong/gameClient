import {DataCenter} from '../datacenter/datacenter';
import { SocketManager } from '../frameworks/socketManager';
import { UserData } from './userData';
import { UserRiches } from './userRiches';
import { UserStatus } from './userStatus';
export class Auth {
    req(){
        SocketManager.instance.loadProtocol(()=>{
            SocketManager.instance.start(DataCenter.instance.appConfig.authUrl ?? "",this.respContent.bind(this))
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
            // 用户信息
            const userData = new UserData()
            userData.req()

            // 用户财富
            const userRiches = new UserRiches()
            userRiches.req()

            // 用户状态
            const userStatus = new UserStatus()
            userStatus.req()

        }else{
            console.log('auth fail')
        }
    }
}