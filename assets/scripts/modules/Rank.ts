import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { LogColors } from '../frameworks/Framework';
import { SprotoCallActivityFunc } from '../../types/protocol/lobby/c2s';

export class Rank {
    private _callBack:((b:boolean, data:any)=>void) | null = null; // 登入成功，但不一定已经拉到数据

    req(callBack?:(b:boolean,data:any)=>void) {
        if (callBack) {
            this._callBack = callBack;
        }
        LobbySocketManager.instance.sendToServer(SprotoCallActivityFunc,{moduleName : 'gameRank', funcName : 'getRankList', args:JSON.stringify({})} , this.resp.bind(this))
    }

    /**
     * @method resp
     * @description 处理返回
     * @param {any} result - 服务器返回的匹配结果
     */
    resp(result: SprotoCallActivityFunc.Response) {
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
}