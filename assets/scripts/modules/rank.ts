import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { LogColors } from '../frameworks/framework';

export class Rank {

    private _callBack:((b:boolean, data:any)=>void) | null = null; // 登入成功，但不一定已经拉到数据

    reqAll(callBack?:(b:boolean,data:any)=>void) {
        if (callBack) {
            this._callBack = callBack;
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc',{moduleName : 'gameRank', funcName : 'getRankList', args:JSON.stringify({})} , this.respAll.bind(this))
    }

    /**
     * @method resp
     * @description 处理返回
     * @param {any} result - 服务器返回的匹配结果
     */
    respAll(result: any) {
        if(result && result.code == 1){
            const res = JSON.parse(result.result);
            if(res.error){
                console.log(LogColors.red(res.error));
                this._callBack && this._callBack(false, res)
            }else{
                this._callBack && this._callBack(true, res)
            }
        }else{
            this._callBack && this._callBack(false, null)
        }
    }

    reqSelf(callBack?:(b:boolean,data:any)=>void) {
        if (callBack) {
            this._callBack = callBack;
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc',{moduleName : 'gameRank', funcName : 'getRank', args:JSON.stringify({})}, this.respSelf.bind(this))
    }

    respSelf(result: any) {
        if(result && result.code == 1){
            const res = JSON.parse(result.result);
            if(res.error){
                console.log(LogColors.red(res.error));
                this._callBack && this._callBack(false, res)
            }else{
                this._callBack && this._callBack(true, res)
            }
        }else{
        }
    }
}