import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { LogColors } from '../frameworks/Framework';
import { UserStatus } from './UserStatus';
import { SprotoMatchJoin, SprotoMatchLeave } from '../../types/protocol/lobby/c2s';

/**
 * @class Match
 * @description 游戏匹配管理类，负责处理游戏匹配逻辑，使用单例模式
 * @category 业务模块
 * @singleton 单例模式
 */
export class Match {
    /**
     * @property {Match} _instance - 单例实例
     * @private
     * @static
     */
    private static _instance: Match;

    private _callBack: ((b:boolean, data?:any) => void) | null = null;
    
    /**
     * @method instance
     * @description 获取Match的单例实例
     * @static
     * @returns {Match} Match单例实例
     */
    public static get instance(): Match {
        if (!this._instance) {
            this._instance = new Match();
        }
        return this._instance;
    }

    /**
     * @method req
     * @description 请求游戏匹配，向服务器发送匹配请求
     * @param {number} [type=0] - 匹配类型，默认为0
     */
    req(type = 0, callBack?:(b:boolean, data?:any)=>void) {
        if (callBack) {
            this._callBack = callBack
        }
        LobbySocketManager.instance.sendToServer(SprotoMatchJoin,{ gameid: 10001, queueid: 1 }, this.resp.bind(this))
    }

    /**
     * @method resp
     * @description 处理匹配响应，更新用户状态并处理匹配结果
     * @param {any} result - 服务器返回的匹配结果
     */
    resp(result: SprotoMatchJoin.Response) {
        const userStatus = new UserStatus()
        userStatus.req()
        if (result && result.code == 1) {
            console.log(LogColors.green(result.msg))
            this._callBack && this._callBack(true)
        } else {
            result && console.log(LogColors.red(result.msg))
            this._callBack && this._callBack(false, result)
        }
    }

    reqLeave(callBack?:(b:boolean, data?:any)=>void): void {
        if (callBack) {
            this._callBack = callBack
        }
        LobbySocketManager.instance.sendToServer(SprotoMatchLeave,{ gameid: 10001, queueid: 1 }, this.respLeave.bind(this))
    }

    respLeave(result:SprotoMatchLeave.Response): void { 
        const userStatus = new UserStatus()
        userStatus.req()
        if (result && result.code == 1) {
            this._callBack && this._callBack(true)
        } else {
            this._callBack && this._callBack(false, result)
        }
    }
}