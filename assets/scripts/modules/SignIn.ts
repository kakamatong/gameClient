import { SprotoCallActivityFunc } from "../../types/protocol/lobby/c2s";
import { LogColors } from "../frameworks/Framework";
import { LobbySocketManager } from "../frameworks/LobbySocketManager";


export class SignIn {

    // 签到数据回调
    private _signDataCallBack: ((success: boolean, data: any) => void) | null = null;
    // 签到回调
    private _signInCallBack: ((success: boolean, data: any) => void) | null = null;
    // 补签到回调
    private _fillSignInCallBack: ((success: boolean, data: any) => void) | null = null;

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

    /**
     * 签到
     * @param mult 是否翻倍
     * @param callBack 签到回调
     */
    reqSignIn(mult:number, callBack: (success: boolean, data: any) => void):void{
        this._signInCallBack = callBack
        LobbySocketManager.instance.sendToServer(SprotoCallActivityFunc,{moduleName : 'daySignIn', funcName : 'signIn', args:JSON.stringify({mult})} , this.respSignIn.bind(this))
    }

    /**
     * 签到回调
     * @param result 签到结果
     */
    respSignIn(result: SprotoCallActivityFunc.Response): void { 
        if(result && result.code == 1){
            const res = JSON.parse(result.result);
            if(res.error){
                console.log(LogColors.red(res.error));
                this._signInCallBack && this._signInCallBack(false, res)
            }else{
                this._signInCallBack && this._signInCallBack(true, res)
            }
        }else{
            this._signInCallBack && this._signInCallBack(false, null)
        }
    }

    /**
     * 补签
     * @param callBack 签到回调
     * @param index 补签天数
     */
    reqFillSignIn(index:number, callBack: (success: boolean, data: any) => void):void{
        this._fillSignInCallBack = callBack
        LobbySocketManager.instance.sendToServer(SprotoCallActivityFunc,{moduleName : 'daySignIn', funcName : 'fillSignIn', args:JSON.stringify({index})} , this.respFillSignIn.bind(this))
    }

    /**
     * 补签回调
     * @param result 签到结果
     */
    respFillSignIn(result: SprotoCallActivityFunc.Response): void { 
        if(result && result.code == 1){
            const res = JSON.parse(result.result);
            if(res.error){
                console.log(LogColors.red(res.error));
                this._fillSignInCallBack && this._fillSignInCallBack(false, res)
            }else{
                this._fillSignInCallBack && this._fillSignInCallBack(true, res)
            }
        }else{
            this._fillSignInCallBack && this._fillSignInCallBack(false, null)
        }
    }
}