/**
 * @file Match.ts
 * @description 游戏匹配模块：处理游戏匹配和匹配退出操作
 * @category 网络请求模块
 */

import { LogColors } from '../frameworks/Framework';
import { UserStatus } from './UserStatus';
import { SprotoMatchJoin, SprotoMatchLeave } from '../../types/protocol/lobby/c2s';
import { BaseModule } from '../frameworks/base/BaseModule';

/**
 * @class Match
 * @description 游戏匹配管理类，负责处理游戏匹配逻辑，使用单例模式
 * @category 网络请求模块
 * @singleton 单例模式
 */
export class Match extends BaseModule {
    static get instance(): Match {
        return this._getInstance<Match>(Match);
    }

    private _callBack: ((b:boolean, data?:any) => void) | null = null;

    /**
     * @method req
     * @description 请求游戏匹配，向服务器发送匹配请求
     * @param {number} [type=0] - 匹配类型，默认为0
     */
    req(type = 0, callBack?:(b:boolean, data?:any)=>void) {
        if (callBack) {
            this._callBack = callBack
        }
        this.reqLobby(SprotoMatchJoin,{ gameid: 10001, queueid: 1 }, this.resp.bind(this))
    }

    /**
     * @method resp
     * @description 处理匹配响应，更新用户状态并处理匹配结果
     * @param {any} result - 服务器返回的匹配结果
     */
    resp(result: SprotoMatchJoin.Response) {
        UserStatus.instance.req()
        if (result && result.code == 1) {
            console.log(LogColors.green(result.msg))
            this._callBack && this._callBack(true)
        } else {
            result && console.log(LogColors.red(result.msg))
            this._callBack && this._callBack(false, result)
        }
    }

    /**
     * @description 请求退出匹配
     * @param callBack 回调函数
     */
    reqLeave(callBack?:(b:boolean, data?:any)=>void): void {
        if (callBack) {
            this._callBack = callBack
        }
        this.reqLobby(SprotoMatchLeave,{ gameid: 10001, queueid: 1 }, this.respLeave.bind(this))
    }

    /**
     * @description 处理退出匹配的响应
     * @param result 服务器返回的退出匹配结果
     */
    respLeave(result:SprotoMatchLeave.Response): void {
        UserStatus.instance.req()
        if (result && result.code == 1) {
            this._callBack && this._callBack(true)
        } else {
            this._callBack && this._callBack(false, result)
        }
    }
}