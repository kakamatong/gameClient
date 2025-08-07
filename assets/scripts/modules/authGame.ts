import CryptoJS from 'crypto-js';   
import {DataCenter} from '../datacenter/datacenter';
import { LogColors } from '../frameworks/framework';
import { GameSocketManager } from '../frameworks/gameSocketManager';
import { customDESEncryptStr } from '../frameworks/utils/utils';
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

    req(addr:string,gameid:number,roomid:string,callBack:(success:boolean)=>void){
        this._callBack = callBack;
        GameSocketManager.instance.loadProtocol("game10001",()=>{
            const loginInfo = DataCenter.instance.getLoginInfo();
            const loginData = {
                device:'pc',
                version:'0.0.1',
                channel:'account',
                subid:loginInfo?.subid ?? '',
                time: Date.now(),
                username:loginInfo?.username ?? '',
            }
            let str = JSON.stringify(loginData)
            const secret = CryptoJS.enc.Hex.parse(loginInfo?.token ?? "")
            const token = customDESEncryptStr(str, secret)
            const urlToken = encodeURIComponent(token)

            const params = `ver=1&userid=${loginInfo?.userid ?? ''}&gameid=${gameid}&roomid=${roomid}&token=${urlToken}`
            const newAddr = DataCenter.instance.gameAuthList[addr];

            const url = `${newAddr}?${params}`
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