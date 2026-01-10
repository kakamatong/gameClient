import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { DispatchEvent } from '../frameworks/Framework';
import { UserstatusResponse } from '../../types/protocol/lobby/c2s';
export class UserStatus {
    req() {
        LobbySocketManager.instance.sendToServer('userStatus', { userid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: UserstatusResponse) {
        DataCenter.instance.userStatus = data;
        DispatchEvent('userStatus',data)
    }
}