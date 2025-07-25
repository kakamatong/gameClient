import { DataCenter } from '../datacenter/datacenter';
import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { DispatchEvent } from '../frameworks/framework';
export class UserData {
    req() {
        LobbySocketManager.instance.sendToServer('userData', { userid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: any) {
        DataCenter.instance.userData = data;
        DispatchEvent('userData',data)
    }
}