import { SocketManager } from '../frameworks/socketManager';
import {LogColors} from '../frameworks/framework';
export class Match {
    req(){
        SocketManager.instance.sendToServer('match', { gameid: 0, gameSubid:0 }, this.resp.bind(this))
    }

    resp(result:any){
        if(result && result.code == 0){
            console.log(LogColors.green("进入匹配列队成功"))
        }else{
            console.log('Match fail')
        }
    }
}