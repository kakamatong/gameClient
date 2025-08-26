import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { LogColors } from '../frameworks/framework';
import { UserStatus } from './userStatus';

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
    req(type = 0) {
        LobbySocketManager.instance.sendToServer('matchJoin',{ gameid: 10001, queueid: 1 }, this.resp.bind(this))
    }

    /**
     * @method resp
     * @description 处理匹配响应，更新用户状态并处理匹配结果
     * @param {any} result - 服务器返回的匹配结果
     */
    resp(result: any) {
        const userStatus = new UserStatus()
        userStatus.req()
        if (result && result.code == 1) {
            console.log(LogColors.green(result.msg))
        } else {
            result && console.log(LogColors.red(result.msg))
            // 已经在游戏中，直接进入
            if(result.code == 3){
                //console.log(LogColors.red(result.msg))
            }
        }
    }
}