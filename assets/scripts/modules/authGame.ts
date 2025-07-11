import {DataCenter} from '../datacenter/datacenter';
import { LogColors } from '../frameworks/framework';
import { GameSocketManager } from '../frameworks/gameSocketManager';
import { UserData } from './userData';
import { UserRiches } from './userRiches';
import { UserStatus } from './userStatus';
export class AuthGame {
    //Auth
    private static _instance: AuthGame;
    private _callBack:((success:boolean)=>void) | null = null;



    public static get instance(): AuthGame {
        if (!this._instance) {
            this._instance = new AuthGame();
        }
        return this._instance;
    }

    req(gameid:number,roomid:number,callBack:(success:boolean)=>void){
        this._callBack = callBack;

        GameSocketManager.instance.loadProtocol(()=>{
            const loginInfo = DataCenter.instance.getLoginInfo();
            const params = `username=${loginInfo?.username ?? ''}&userid=${loginInfo?.userid ?? ''}&token=${loginInfo?.token ?? ''}&channel=${'account'}&subid=${loginInfo?.subid ?? ''}&gameid=${gameid}&roomid=${roomid}`
            const url = `${DataCenter.instance.appConfig.authGameUrl}?${params}`
            GameSocketManager.instance.start(url, undefined, this.resp.bind(this))
        })
    }

    resp(success:boolean){
        if(success){
            
        }else{
            console.log('auth fail')
        }
        this._callBack && this._callBack(success);
    }
}