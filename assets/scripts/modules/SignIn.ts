import { SprotoCallActivityFunc } from "../../types/protocol/lobby/c2s";
import { LogColors } from "../frameworks/Framework";
import { LobbySocketManager } from "../frameworks/LobbySocketManager";


export class SignIn {

    // 签到数据回调
    private _signDataCallBack: ((success: boolean, data: any) => void) | null = null;

    /**
     * 请求签到数据
     * @param callBack 签到数据回调
     */
    reqSignData(callBack: (success: boolean, data: any) => void){
        this._signDataCallBack = callBack;
        LobbySocketManager.instance.sendToServer(SprotoCallActivityFunc,{moduleName : 'daySignIn', funcName : 'getSignInInfo', args:JSON.stringify({})} , this.respSignData.bind(this))
    }

    /**
     * 签到数据回调
     * @param result 签到数据
     */
    respSignData(result: SprotoCallActivityFunc.Response): void { 
        if(result && result.code == 1){
            const res = JSON.parse(result.result);
            if(res.error){
                console.log(LogColors.red(res.error));
                this._signDataCallBack && this._signDataCallBack(false, res)
            }else{
                this._signDataCallBack && this._signDataCallBack(true, res)
            }
        }else{
            this._signDataCallBack && this._signDataCallBack(false, null)
        }
    }
}