import {DataCenter} from '../datacenter/datacenter';
import { LogColors } from '../frameworks/framework';
import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { SocketManager } from '../frameworks/socketManager';
import { UserData } from './userData';
import { UserRiches } from './userRiches';
import { UserStatus } from './userStatus';
export class Auth {
    //Auth
    private _time :number = 0
    private static _instance: Auth;
    public static get instance(): Auth {
        if (!this._instance) {
            this._instance = new Auth();
        }
        return this._instance;
    }

    req(){
        LobbySocketManager.instance.loadProtocol(()=>{
            const loginInfo = DataCenter.instance.getLoginInfo();
            const params = `username=${loginInfo?.username ?? ''}&userid=${loginInfo?.userid ?? ''}&token=${(loginInfo?.token ?? '')}&device=${'pc'}&version=${'0.0.1'}&channel=${'account'}&subid=${loginInfo?.subid ?? ''}`
            const url = `${DataCenter.instance.appConfig.authUrl}?${params}`
            // for(let i = 0; i < 200; i++){
            //     const s =new SocketManager()
            //     s.start(url, undefined, this.resp.bind(this))
            // }
            this._time = Date.now()
            LobbySocketManager.instance.start(url, undefined, this.resp.bind(this))
        })
    }

    resp(success:boolean){
        if(success){
            const dt = Date.now() - this._time
            console.log('auth time:', dt / 1000)
            
            DataCenter.instance.addSubid();
            console.log(LogColors.green("认证成功"))
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