import {DataCenter} from '../datacenter/datacenter';
import { LogColors } from '../frameworks/framework';
import { GameSocketManager } from '../frameworks/gameSocketManager';
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

        GameSocketManager.instance.loadProtocol("game10001",()=>{
            const loginInfo = DataCenter.instance.getLoginInfo();
            const params = `username=${loginInfo?.username ?? ''}&userid=${loginInfo?.userid ?? ''}&token=${loginInfo?.token ?? ''}&channel=${'account'}&subid=${loginInfo?.subid ?? ''}&gameid=${gameid}&roomid=${roomid}`
            const url = `${DataCenter.instance.appConfig.authGameUrl}?${params}`
            GameSocketManager.instance.start(url, undefined, this.resp.bind(this))
        })
    }

    resp(success:boolean){
        if(success){
            DataCenter.instance.addSubid();
            console.log(LogColors.green("连接游戏服务成功"))
        }else{
            console.log(LogColors.red("连接游戏服务失败"))
        }
        this._callBack && this._callBack(success);
    }
}