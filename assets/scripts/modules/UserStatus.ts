import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { DispatchEvent } from '../frameworks/Framework';
import { SprotoUserStatus } from '../../types/protocol/lobby/c2s';
export class UserStatus {
    req() {
        LobbySocketManager.instance.sendToServer(SprotoUserStatus, { userid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: SprotoUserStatus.Response) {
        DataCenter.instance.userStatus = data;
        DispatchEvent('userStatus',data)
    }
}