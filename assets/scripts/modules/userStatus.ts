import { DataCenter } from '../datacenter/datacenter';
import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { DispatchEvent } from '../frameworks/framework';
export class UserStatus {
    req() {
        LobbySocketManager.instance.sendToServer('userStatus', { userid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: any) {
        DataCenter.instance.userStatus = data;
        DispatchEvent('userStatus',data)
    }
}