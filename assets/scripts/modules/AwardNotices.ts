import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { GetawardnoticeResponse } from '../../types/protocol//lobby/c2s';
export class AwardNotices {
    req() {
        LobbySocketManager.instance.sendToServer('getAwardNotice', { userid:DataCenter.instance.userid}, this.resp.bind(this))

    }

    resp(data: GetawardnoticeResponse) {
        // 这是未通知到的奖励，可以一个一个通知，或者合并通知
        data && data.list && console.log(data.list)
    }

    reqRead(id:number){
        LobbySocketManager.instance.sendToServer('setAwardNoticeRead', { id:id})
    }

}