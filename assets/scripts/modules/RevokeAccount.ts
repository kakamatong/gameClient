import { CancelrevokeaccResponse, RevokeaccResponse } from '../../types/protocol/lobby/c2s';
import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { SprotoRevokeAcc, SprotoCancelRevokeAcc } from '../../types/protocol/lobby/c2s';


/**
 * @class UserData
 * @description 用户数据管理类，负责用户数据的请求和响应处理
 * @category 业务模块
 */
export class RevokeAccount {
    private _callback: ((data:any)=>void) | null = null;
    /**
     * @method req
     * @description 请求用户数据，向服务器发送用户数据请求
     */
    reqRevokeAccount(callback?: (data:any)=>void) {
        if (callback) {
            this._callback = callback
        }
        const loginInfo = DataCenter.instance.getLoginInfo();
        LobbySocketManager.instance.sendToServer(SprotoRevokeAcc, { loginType: loginInfo?.loginType }, this.respRevoke.bind(this))
    }

    reqCancelRevokeAccount(callback?: (data:any)=>void) {
        if (callback) {
            this._callback = callback
        }
        const loginInfo = DataCenter.instance.getLoginInfo();
        LobbySocketManager.instance.sendToServer(SprotoCancelRevokeAcc, { userid: loginInfo?.loginType }, this.respCancelRevoke.bind(this))
    }

    /**
     * @method resp
     * @description 处理用户数据响应，更新本地数据并发送事件通知
     * @param {any} data - 服务器返回的用户数据
     */
    respRevoke(data: SprotoRevokeAcc.Response) {
        this._callback && this._callback(data);
    }

    respCancelRevoke(data: SprotoCancelRevokeAcc.Response) {
        this._callback && this._callback(data);
    }
}