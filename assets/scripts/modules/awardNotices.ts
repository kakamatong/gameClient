import { DataCenter } from '../datacenter/datacenter';
import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { DispatchEvent } from '../frameworks/framework';
export class AwardNotices {
    req() {
        LobbySocketManager.instance.sendToServer('getAwardNotice', { userid:DataCenter.instance.userid}, this.resp.bind(this))

    }

    resp(data: any) {
        console.log(data);
    }

    reqRead(id:number){
        LobbySocketManager.instance.sendToServer('setAwardNoticeRead', { id:id})
    }

}