import { DataCenter } from '../datacenter/datacenter';
import { SocketManager } from '../frameworks/socketManager';
export class UserData {
    req() {
        SocketManager.instance.sendToServer('userData', { uid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    resp(data: any) {
        DataCenter.instance.userData = data;
    }
}