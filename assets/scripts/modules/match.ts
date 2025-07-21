import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { LogColors } from '../frameworks/framework';
import { UserStatus } from './userStatus';
export class Match {
    //单例
    private static _instance: Match;
    public static get instance(): Match {
        if (!this._instance) {
            this._instance = new Match();
        }
        return this._instance;
    }

    req(type = 0) {
        LobbySocketManager.instance.callServer('match','','join', { gameid: 10001, queueid: 1 }, this.resp.bind(this))
    }

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