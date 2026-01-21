import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { DispatchEvent } from '../frameworks/Framework';
import { SprotoUserStatus } from '../../types/protocol/lobby/c2s';
import { EVENT_NAMES } from '../datacenter/CommonConfig';
export class UserStatus {
    req() {
        LobbySocketManager.instance.sendToServer(SprotoUserStatus, { userid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: SprotoUserStatus.Response) {
        DataCenter.instance.userStatus = data;
        DispatchEvent(EVENT_NAMES.USER_STATUS,data)
    }
}