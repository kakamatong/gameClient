import { DataCenter } from '../datacenter/datacenter';
import { SocketManager } from '../frameworks/SocketManager';
import { DispatchEvent } from '../frameworks/framework';
export class UserStatus {
    req() {
        SocketManager.instance.sendToServer('userStatus', { uid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: any) {
        DataCenter.instance.userStatus = data;
        DispatchEvent('userStatus',data)
    }
}