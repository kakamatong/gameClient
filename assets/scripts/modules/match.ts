import { SocketManager } from '../frameworks/socketManager';
import { LogColors } from '../frameworks/framework';
export class Match {
    req(type = 0) {
        SocketManager.instance.sendToServer('match', { gameid: 10001, gameSubid: 1, type: type }, this.resp.bind(this))
    }

    resp(result: any) {
        if (result && result.code == 0) {
            console.log(LogColors.green(result.msg))
        } else {
            result && console.log(LogColors.red(result.msg))
        }
    }
}