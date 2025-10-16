import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { DispatchEvent } from '../frameworks/Framework';
export class UserStatus {
    req() {
        LobbySocketManager.instance.sendToServer('userStatus', { userid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: any) {
        DataCenter.instance.userStatus = data;
        DispatchEvent('userStatus',data)
    }
}