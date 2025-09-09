import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { LogColors } from '../frameworks/framework';

export class Rank {
    /**
     * @property {Rank} _instance - 单例实例
     * @private
     * @static
     */
    private static _instance: Rank;
    private _callBack:((b:boolean, data:any)=>void) | null = null; // 登入成功，但不一定已经拉到数据
    /**
     * @method instance
     * @description 获取Match的单例实例
     * @static
     * @returns {Rank} Match单例实例
     */
    public static get instance(): Rank {
        if (!this._instance) {
            this._instance = new Rank();
        }
        return this._instance;
    }


    req(callBack?:(b:boolean,data:any)=>void) {
        if (callBack) {
            this._callBack = callBack;
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc',{moduleName : 'gameRank', funcName : 'getRankList', args:JSON.stringify({})} , this.resp.bind(this))
    }

    /**
     * @method resp
     * @description 处理返回
     * @param {any} result - 服务器返回的匹配结果
     */
    resp(result: any) {
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