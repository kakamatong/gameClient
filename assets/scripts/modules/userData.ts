import { DataCenter } from '../datacenter/datacenter';
import { SocketManager } from '../frameworks/socketManager';
import { DispatchEvent } from '../frameworks/framework';
export class UserData {
    req() {
        SocketManager.instance.callServer('user', '', 'userData', { uid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: any) {
        DataCenter.instance.userData = data;
        DispatchEvent('userData',data)
    }
}